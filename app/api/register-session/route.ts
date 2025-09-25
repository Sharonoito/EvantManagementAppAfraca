import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getSessionById, getUserById } from "@/lib/db"
import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId } = await req.json()
    console.log("[register-session] Incoming payload:", { userId, sessionId })

    if (!userId || !sessionId) {
      return NextResponse.json({ error: "Missing userId or sessionId" }, { status: 400 })
    }

    // Validate user
    const user = await getUserById(userId)
    if (!user) return NextResponse.json({ error: `User ${userId} not found` }, { status: 404 })

    // Validate session
    const session = await getSessionById(sessionId)
    if (!session) return NextResponse.json({ error: `Session ${sessionId} not found` }, { status: 404 })

    // Attempt to register (safe upsert)
    try {
    // api/register-session/route.ts
    const res = await pool.query(
      `
      INSERT INTO session_registrations (user_id, session_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, session_id) DO NOTHING
      RETURNING *
      `,
      [userId, sessionId] 
    )

      if (res.rows.length === 0) {
        return NextResponse.json({ success: false, message: "Already registered" })
      }

      return NextResponse.json({ success: true, message: "Registered successfully", registration: res.rows[0] })
    } catch (dbErr: unknown) {
      const message = dbErr instanceof Error ? dbErr.message : "Unknown DB error"
      console.error("[register-session] DB error on INSERT:", message)
      return NextResponse.json({ error: "Database error on INSERT", details: message }, { status: 500 })
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error"
    console.error("[register-session] Unexpected error:", message)
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 })
  }
}
