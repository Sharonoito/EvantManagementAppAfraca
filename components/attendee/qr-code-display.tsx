"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User } from "lucide-react"

interface Props {
  qrCode: string
  userName: string
  userEmail: string
}

export function QRCodeDisplay({ qrCode, userName, userEmail }: Props) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // In a real app, you'd call your QR code generation API
        // For now, we'll use a placeholder
        const response = await fetch(`/api/qr-code?data=${encodeURIComponent(qrCode)}`)
        if (response.ok) {
          const blob = await response.blob()
          const imageUrl = URL.createObjectURL(blob)
          setQrCodeImage(imageUrl)
        } else {
          // Fallback to a placeholder QR code service
          setQrCodeImage(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`)
        }
      } catch (error) {
        console.error("Failed to generate QR code:", error)
        // Fallback to a placeholder QR code service
        setQrCodeImage(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`)
      } finally {
        setIsLoading(false)
      }
    }

    generateQRCode()
  }, [qrCode])

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold">{userName}</h3>
        <p className="text-muted-foreground">{userEmail}</p>
        <Badge variant="outline">Attendee</Badge>
      </div>

      {/* QR Code */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          <div className="text-center">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img src={qrCodeImage || undefined} alt="QR Code" className="w-64 h-64 mx-auto" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono text-muted-foreground break-all">{qrCode}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p className="font-medium">8th World Congress on Rural & Agricultural Finance</p>
        <p>Keep this QR code ready for event check-in</p>
      </div>
    </div>
  )
}
