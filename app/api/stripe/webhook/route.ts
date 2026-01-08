import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update organization with subscription info
        if (session.metadata?.organizationId) {
          await prisma.organization.update({
            where: { id: session.metadata.organizationId },
            data: {
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: 'active',
              subscriptionTier: session.metadata.planType,
              currentPeriodEnd: session.subscription
                ? new Date((await stripe.subscriptions.retrieve(session.subscription as string)).current_period_end * 1000)
                : undefined,
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Find organization by subscription ID
        const org = await prisma.organization.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (org) {
          await prisma.organization.update({
            where: { id: org.id },
            data: {
              subscriptionStatus: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Find and cancel organization subscription
        const org = await prisma.organization.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (org) {
          await prisma.organization.update({
            where: { id: org.id },
            data: {
              subscriptionStatus: 'cancelled',
              subscriptionTier: 'trial',
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment succeeded:', invoice.id)
        // You can add email notifications here
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed:', invoice.id)
        
        // Update subscription status
        if (invoice.subscription) {
          const org = await prisma.organization.findFirst({
            where: { stripeSubscriptionId: invoice.subscription as string },
          })

          if (org) {
            await prisma.organization.update({
              where: { id: org.id },
              data: { subscriptionStatus: 'past_due' },
            })
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
