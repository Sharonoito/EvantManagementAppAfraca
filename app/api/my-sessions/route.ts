import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/my-sessions?userId=123
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Corrected the table name from "sessions_registrations" to "session_registrations"
    const sessions = await query(
      `SELECT s.id, s.title, s.description, s.start_time, s.end_time, 
              s.location, s.speaker_name, s.max_attendees,
              sr.registered_at, sr.attended
       FROM session_registrations sr 
       JOIN sessions s ON sr.session_id = s.id
       WHERE sr.user_id = $1
       ORDER BY s.start_time ASC`,
      [userId]
    )

    return NextResponse.json({ sessions })
  } catch (err) {
    console.error("My sessions error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}