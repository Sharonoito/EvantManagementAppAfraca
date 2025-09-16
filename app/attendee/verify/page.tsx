"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VerifyPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Attempting to verify email:", email)

      const response = await fetch(`/api/attendee/verify?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Verification failed")
      }

      // Store user email in localStorage for session management
      localStorage.setItem("attendee_email", email)
      localStorage.setItem("attendee_data", JSON.stringify(data))

      console.log("[v0] User verified successfully:", data)

      // Redirect to attendee portal
      router.push("/attendee")
    } catch (err: any) {
      console.error("[v0] Verification error:", err)
      setError(err.message || "Failed to verify your identity. Please check your email and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
          <CardDescription>Enter your registered email to access the attendee portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Need help? Contact our support team or visit the registration desk.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
