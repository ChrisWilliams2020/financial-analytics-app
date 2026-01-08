import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // For demo purposes, just log the event
        console.log('Checkout session completed:', session.id)
        
        // In production, you would update your database here
        // Example:
        // if (session.metadata?.organizationId && session.subscription) {
        //   const subscription = await stripe.subscriptions.retrieve(
        //     session.subscription as string
        //   )
        //   
        //   await prisma.organization.update({
        //     where: { id: session.metadata.organizationId },
        //     data: {
        //       stripeSubscriptionId: subscription.id,
        //       subscriptionStatus: 'active',
        //       subscriptionTier: session.metadata.planType,
        //       currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        //     },
        //   })
        // }
        
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('Subscription event:', event.type, subscription.id)
        
        // In production, update your database here
        // Example:
        // await prisma.organization.update({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: {
        //     subscriptionStatus: subscription.status,
        //     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        //   },
        // })
        
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
