'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{session.user?.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{session.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Organization</p>
                  <p className="font-medium">{(session.user as any)?.organization || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full">Analytics</Button>
                </Link>
                <Link href="/ai-upload">
                  <Button variant="outline" className="w-full">AI Upload</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">View Plans</Button>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button 
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="destructive"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
