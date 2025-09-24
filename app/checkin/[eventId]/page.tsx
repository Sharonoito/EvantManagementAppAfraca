import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Clock, QrCode } from "lucide-react"
import { query } from "@/lib/db"
import { redirect } from "next/navigation"
import { CheckInForm } from "./CheckInForm"

interface CheckInPageProps {
  params: { eventId: string }
}

export default async function CheckInPage({ params }: CheckInPageProps) {
  const { eventId } = params

  // Server Action inside the Server Component
  async function checkInByEmail(formData: FormData) {
    "use server"
    const email = formData.get("email") as string
    if (!email) throw new Error("Email is required")

    const users = await query(`SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`, [email])
    if (users.length === 0) throw new Error("No user found with that email")

    const user = users[0]

    if (!user.checked_in) {
      await query(`UPDATE users SET checked_in = true, check_in_time = NOW() WHERE id = $1`, [user.id])
    }

    redirect(`/attendee/profile?email=${encodeURIComponent(user.email)}`)
  }

  // Fetch all users for stats
  const users = await query(`SELECT * FROM users`)
  const totalUsers = users.length
  const checkedInUsers = users.filter((user) => user.checked_in).length
  const recentCheckIns = users
    .filter((user) => user.checked_in && user.check_in_time)
    .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime())
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Check-in System
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Enter your email to check in for Event ID: {eventId}
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Email Check-in</CardTitle>
              <CardDescription>Enter your registered email to check in</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pass server action as prop */}
              <CheckInForm onSubmit={checkInByEmail} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Check-ins</CardTitle>
              <CardDescription>Latest attendees who checked in</CardDescription>
            </CardHeader>
            <CardContent>
              {recentCheckIns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No check-ins yet</p>
              ) : (
                <div className="space-y-4">
                  {recentCheckIns.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(user.check_in_time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
