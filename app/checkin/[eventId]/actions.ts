import { query } from "@/lib/db"
import { redirect } from "next/navigation"

export async function checkInByEmail(formData: FormData, eventId: string) {
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
