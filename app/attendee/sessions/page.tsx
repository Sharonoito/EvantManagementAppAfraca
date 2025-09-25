// app/attendee/sessions/page.tsx
import { cookies } from "next/headers"
import { getUserById, getAllEvents, getEventSessions } from "@/lib/db"
import SessionsList from "./SessionsList"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default async function SchedulePage() {
  // -------------------------
  // 1️⃣ Get logged-in user from cookie
  // -------------------------
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) throw new Error("User is not logged in")

  const user = await getUserById(userId)
  if (!user) throw new Error("User not found")

  // -------------------------
  // 2️⃣ Fetch events & sessions
  // -------------------------
  const events = await getAllEvents()
  if (events.length === 0) throw new Error("No events found")

  const event = events[0] // Using the first event
  const sessions = await getEventSessions(event.id)

  // -------------------------
  // 3️⃣ Prepare sessions for display
  // -------------------------
  const sessionsWithDate = sessions.map((s: any) => ({
    ...s,
    session_date: new Date(s.start_time).toISOString().split("T")[0],
    start_time: new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    end_time: new Date(s.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    is_registered: false, // Optional: you can enhance to fetch actual user's registrations
  }))

  const sessionsByDate = sessionsWithDate.reduce((acc: any, session: any) => {
    if (!acc[session.session_date]) acc[session.session_date] = []
    acc[session.session_date].push(session)
    return acc
  }, {})

  const eventDates = Object.keys(sessionsByDate).sort()

  // -------------------------
  // 4️⃣ Render tabs and sessions
  // -------------------------
  return (
    <Tabs defaultValue={eventDates[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8 bg-yellow-100">
        {eventDates.map((date, index) => (
          <TabsTrigger key={date} value={date}>
            Day {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>

      {eventDates.map((date) => (
        <TabsContent key={date} value={date}>
          <SessionsList sessionsByDate={{ [date]: sessionsByDate[date] }} currentUserId={user.id} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
