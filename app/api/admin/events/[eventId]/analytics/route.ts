import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface Props {
  params: {
    eventId: string
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const stats = await query(
      `
      SELECT
        e.id,
        e.title,
        COUNT(DISTINCT sr.user_id) AS total_attendees,
        COUNT(DISTINCT s.id) AS total_sessions,
        COALESCE(SUM(sr.checked_in::int), 0) AS checked_in_count
      FROM events e
      LEFT JOIN sessions s ON e.id = s.event_id
      LEFT JOIN session_registrations sr ON sr.session_id = s.id
      WHERE e.id = $1
      GROUP BY e.id
      `,
      [params.eventId],
    )

    return NextResponse.json({ success: true, analytics: stats[0] || {} })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 },
    )
  }
}
