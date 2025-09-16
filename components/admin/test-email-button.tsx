"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export function TestEmailButton() {
  const [email, setEmail] = useState("oitosharonakoth@gmail.com")
  const [loading, setLoading] = useState(false)

  const handleTestEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Test email error:", error)
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="email"
        placeholder="Enter email to test"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="max-w-xs"
      />
      <Button onClick={handleTestEmail} disabled={loading}>
        {loading ? "Sending..." : "Send Test Email"}
      </Button>
    </div>
  )
}
