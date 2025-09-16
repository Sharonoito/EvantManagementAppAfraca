"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  qrCode: string
  userName: string
}

export function CheckInButton({ qrCode, userName }: Props) {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()

  const handleCheckIn = async () => {
    setIsChecking(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Redirect to attendee portal after successful check-in
        setTimeout(() => {
          router.push("/attendee")
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to check in. Please try again.",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleCheckIn} disabled={isChecking} className="w-full" size="lg">
        {isChecking ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Checking In...
          </>
        ) : (
          "Check In Now"
        )}
      </Button>

      {result && (
        <Alert
          className={
            result.success
              ? "border-green-200 bg-green-50 dark:bg-green-950"
              : "border-red-200 bg-red-50 dark:bg-red-950"
          }
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            <p className="font-medium">{result.message}</p>
            {result.success && <p className="text-sm mt-1">Redirecting to attendee portal...</p>}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
