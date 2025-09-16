"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Scan, CheckCircle, AlertCircle, User } from "lucide-react"

interface CheckInResult {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
    organization?: string
    already_checked_in?: boolean
  }
}

export function QRScanner() {
  const [qrCode, setQrCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<CheckInResult | null>(null)

  const handleScan = async () => {
    if (!qrCode.trim()) return

    setIsScanning(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode: qrCode.trim() }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setQrCode("") // Clear input on successful check-in
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to process check-in. Please try again.",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan()
    }
  }

  return (
    <div className="space-y-6">
      {/* QR Code Input */}
      <div className="space-y-2">
        <Label htmlFor="qr-input">QR Code</Label>
        <div className="flex gap-2">
          <Input
            id="qr-input"
            placeholder="Scan or enter QR code..."
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isScanning}
            className="flex-1"
          />
          <Button onClick={handleScan} disabled={!qrCode.trim() || isScanning}>
            <Scan className="h-4 w-4 mr-2" />
            {isScanning ? "Scanning..." : "Check In"}
          </Button>
        </div>
      </div>

      {/* Camera Scanner (Placeholder) */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">Camera Scanner</p>
        <p className="text-sm text-gray-400">Camera integration would go here</p>
        <Button variant="outline" size="sm" className="mt-4 bg-transparent" disabled>
          Enable Camera
        </Button>
      </div>

      {/* Check-in Result */}
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
            <div className="space-y-3">
              <p className="font-medium">{result.message}</p>

              {result.user && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{result.user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.user.email}</p>
                      {result.user.organization && <p className="text-xs text-gray-500">{result.user.organization}</p>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant={result.success ? "default" : "secondary"}>
                      {result.user.already_checked_in ? "Already Checked In" : "Checked In Successfully"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>
          <strong>Instructions:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Scan the attendee's QR code using a barcode scanner</li>
          <li>Or manually enter the QR code in the input field above</li>
          <li>Press Enter or click "Check In" to process</li>
          <li>The system will automatically record the check-in time</li>
        </ul>
      </div>
    </div>
  )
}
