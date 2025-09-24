import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Check-in System
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Enter your email to check in for Event ID: {eventId}
        </p>

        <div className="max-w-md mx-auto">
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
        </div>
      </div>
    </div>
  )
}
