"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, QrCode, CheckCircle } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  checked_in: boolean
  check_in_time?: string
}

export function CheckInVerification() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // For demo purposes, we'll simulate user verification
        // In a real app, this would check authentication/session
        const userEmail = localStorage.getItem("attendee_email")

        if (!userEmail) {
          setError("Please verify your identity to access the attendee portal")
          setLoading(false)
          return
        }

        // Simulate API call to verify user and check-in status
        const response = await fetch(`/api/attendee/verify?email=${encodeURIComponent(userEmail)}`)

        if (!response.ok) {
          throw new Error("Failed to verify user")
        }

        const userData = await response.json()
        setUser(userData)

        if (!userData.checked_in) {
          setError("You must be checked in at the event to access your dashboard")
        }
      } catch (err) {
        console.error("[v0] User verification error:", err)
        setError("Unable to verify your access. Please contact support.")
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()
  }, [])

  if (loading) {
    return (
      <div className="mb-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying your access...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !user?.checked_in) {
    return (
      <div className="mb-8">
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="space-y-4">
              <p className="font-medium text-orange-800 dark:text-orange-200">{error || "Check-in Required"}</p>
              <p className="text-orange-700 dark:text-orange-300">
                {user && !user.checked_in
                  ? "You need to check in at the event registration desk to access your attendee dashboard and event features."
                  : "Please verify your identity or check in at the event to continue."}
              </p>
              <div className="flex gap-3">
                <Button asChild size="sm">
                  <Link href="/attendee/qr-code">View My QR Code</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/attendee/verify">Verify Identity</Link>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Welcome back, {user.name}!</p>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Checked in on {new Date(user.check_in_time!).toLocaleDateString()} at{" "}
                {new Date(user.check_in_time!).toLocaleTimeString()}
              </p>
            </div>
            <QrCode className="h-5 w-5 text-green-600" />
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
