import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, User, Calendar } from "lucide-react"
import Link from "next/link"
import { getUserByQRCode } from "@/lib/db"
import { CheckInButton } from "@/components/checkin/checkin-button"
import { redirect } from "next/navigation"   // ✅ server redirect

interface Props {
  params: {
    qrCode: string
  }
}

export default async function CheckInPage({ params }: Props) {
  const { qrCode } = params
  const user = await getUserByQRCode(qrCode)

  // ✅ If QR invalid
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Invalid QR Code</CardTitle>
            <CardDescription>This QR code is not valid or has expired.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Please check your QR code or contact event support for assistance.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ✅ If already checked in → redirect to attendee/profile
  if (user.checked_in) {
    redirect("/attendee/profile")
  }

  // ✅ If not yet checked in → show check-in UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Event Check-in</CardTitle>
          <CardDescription>8th World Congress on Rural & Agricultural Finance</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.organization && (
              <p className="text-sm text-muted-foreground">{user.organization}</p>
            )}
            <Badge variant={user.role === "admin" ? "default" : user.role === "organizer" ? "secondary" : "outline"}>
              {user.role}
            </Badge>
          </div>

          {/* Check-in Button */}
          <div className="space-y-4">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Ready to check in to the event</p>
            </div>
            <CheckInButton qrCode={qrCode} userName={user.name} />
          </div>

          {/* Event Info */}
          <div className="border-t pt-4 text-center text-sm text-muted-foreground">
            <p>Welcome to the 8th World Congress on Rural & Agricultural Finance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
