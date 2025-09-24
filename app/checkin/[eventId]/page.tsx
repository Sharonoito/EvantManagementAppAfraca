// app/checkin/[eventId]/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { query } from "@/lib/db"
import { redirect } from "next/navigation"
import { CheckInForm } from "./CheckInForm"

interface CheckInPageProps {
  params: { eventId: string }
}

export default async function CheckInPage({ params }: CheckInPageProps) { 
  const { eventId } = params

  const event = await query(`SELECT title FROM events WHERE id = $1 LIMIT 1`, [eventId])
  const eventTitle = event.length > 0 ? event[0].title : "Unknown Event"

  async function checkInByEmail(formData: FormData) {
    "use server"
    const email = formData.get("email") as string
    if (!email) throw new Error("Email is required")

    const users = await query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email]
    )
    if (users.length === 0) throw new Error("No user found with that email")

    const user = users[0]

    if (!user.checked_in) {
      await query(
        `UPDATE users SET checked_in = true, check_in_time = NOW() WHERE id = $1`,
        [user.id]
      )
    }

    redirect(`/attendee/profile?email=${encodeURIComponent(user.email)}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#006600] dark:text-[#61CE70] mb-2 tracking-tight">
            Event Check-in 
          </h1>
          <p className="text-xl text-[#C9A277] dark:text-[#C9A277]">
            Welcome to <span className="font-semibold">{eventTitle}</span>
          </p>
        </div>

        <Card className="w-full bg-white dark:bg-gray-900 border border-[#61CE70] shadow-xl rounded-lg">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-[#61CE70] p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-[#006600] dark:text-[#61CE70]">Email Check-in</CardTitle>
            <CardDescription className="mt-1 text-[#C9A277] dark:text-[#C9A277]">
              Please enter your registered email to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <CheckInForm onSubmit={checkInByEmail} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}