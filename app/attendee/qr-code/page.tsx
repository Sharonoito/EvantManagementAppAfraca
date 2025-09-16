import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Download, Share, CheckCircle, Info } from "lucide-react"
import Link from "next/link"
import { QRCodeDisplay } from "@/components/attendee/qr-code-display"

// This would normally get the user from session/auth
const mockUser = {
  id: "user_123",
  name: "John Doe",
  email: "john.doe@example.com",
  qr_code: "EVENT_user_123_1234567890",
  checked_in: false,
}

export default function QRCodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My QR Code</h1>
            <p className="text-gray-600 dark:text-gray-300">Your personal QR code for event check-in</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/attendee">Back to Portal</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Code Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <QrCode className="h-6 w-6" />
                  Your Check-in QR Code
                </CardTitle>
                <CardDescription>Show this QR code at the event entrance for quick check-in</CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeDisplay qrCode={mockUser.qr_code} userName={mockUser.name} userEmail={mockUser.email} />
              </CardContent>
            </Card>
          </div>

          {/* Instructions and Info */}
          <div className="space-y-6">
            {/* Check-in Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Check-in Status</CardTitle>
              </CardHeader>
              <CardContent>
                {mockUser.checked_in ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Checked In</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground">Not checked in yet</p>
                    <Button asChild className="w-full">
                      <Link href={`/checkin/${mockUser.qr_code}`}>Quick Check-in</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">At the Event:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Show this QR code to event staff</li>
                    <li>Staff will scan your code</li>
                    <li>You'll be checked in instantly</li>
                    <li>Enjoy the congress!</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Mobile Check-in:</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can also check in using your mobile device by clicking the "Quick Check-in" button above.
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Save this page to your phone's home screen for quick access during the event.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Share className="h-4 w-4 mr-2" />
                  Share QR Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
