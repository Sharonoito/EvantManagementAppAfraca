import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, QrCode, User, Bell, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getAllEvents, getAllSessions, query } from "@/lib/db"

async function getAttendeeStatus(email: string) {
  const rows = await query(
    `SELECT checked_in, name 
     FROM users 
     WHERE email=$1 
     LIMIT 1`,
    [email]
  )
  return rows[0] || null
}

export default async function AttendeePage({ searchParams }: { searchParams: { email?: string } }) {
  const events = await getAllEvents()
  const sessions = await getAllSessions()
  const upcomingSessions = sessions
    .filter((session) => new Date(session.start_time) > new Date())
    .slice(0, 3)

  const email = searchParams.email || "demo@example.com" // In real app, get from auth session
  const attendeeStatus = await getAttendeeStatus(email)

  if (!attendeeStatus || !attendeeStatus.checked_in) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Check-in Required</CardTitle>
              <CardDescription>You need to check in before accessing your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Please scan your QR code at the registration desk to check in and access your attendee portal.
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  📧 Check your email for the QR code
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
            Welcome {attendeeStatus.name}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-pretty">
            Your personal portal for the 8th World Congress on Rural & Agricultural Finance
          </p>
          <Badge variant="outline" className="mt-4 bg-green-50 text-green-700 border-green-200">
            ✓ Checked In
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/attendee/profile">
              <CardHeader>
                <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>View and update your information</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/attendee/sessions">
              <CardHeader>
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Browse and register for sessions</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/attendee/qr-code">
              <CardHeader>
                <QrCode className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">My QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Access your check-in QR code</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/attendee/networking">
              <CardHeader>
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Connect with other attendees</CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>Sessions you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No upcoming sessions scheduled yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{session.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{session.description}</p>
                            {session.speaker_name && (
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Speaker: {session.speaker_name}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">{session.session_type}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(session.start_time).toLocaleDateString()} at{" "}
                            {new Date(session.start_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {session.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {session.location}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {session.registration_count || 0} registered
                            {session.max_attendees && ` / ${session.max_attendees} max`}
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/attendee/sessions/${session.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="text-center pt-4">
                      <Button asChild variant="outline">
                        <Link href="/attendee/sessions">View All Sessions</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Congress Highlights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Expert keynote speakers</li>
                    <li>• Interactive workshops</li>
                    <li>• Networking opportunities</li>
                    <li>• Policy discussions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Contact our support team for assistance
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-medium">Welcome to the Congress!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check-in opens at 8:00 AM. Don't forget your QR code!
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm font-medium">Networking Session Added</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      New networking session scheduled for tomorrow evening.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
