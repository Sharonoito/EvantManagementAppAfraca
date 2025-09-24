import "dotenv/config"
import { Pool } from "pg"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params)
  return res.rows
}

// -----------------------------
// Users
// -----------------------------
export async function getAllUsers() {
  return await query("SELECT * FROM users ORDER BY created_at DESC")
}

// -----------------------------
// Events
// -----------------------------
export async function getAllEvents() {
  return await query("SELECT * FROM events ORDER BY start_date ASC")
}

export async function getEventById(eventId: string) {
  const rows = await query("SELECT * FROM events WHERE id=$1 LIMIT 1", [eventId])
  return rows[0] || null
}

export async function createEvent(eventData: {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
}) {
  const rows = await query(
    `INSERT INTO events (id, title, description, start_date, end_date, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
     RETURNING *`,
    [eventData.id, eventData.title, eventData.description || "", eventData.start_date, eventData.end_date]
  )
  return rows[0]
}

export async function updateEvent(eventId: string, eventData: any) {
  const rows = await query(
    `UPDATE events
     SET title=$1, description=$2, start_date=$3, end_date=$4, updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [eventData.title, eventData.description || "", eventData.start_date, eventData.end_date, eventId]
  )
  return rows[0]
}

// -----------------------------
// Sessions
// -----------------------------
export async function getEventSessions(eventId: string) {
  return await query(
    `SELECT s.*, COUNT(r.id) AS registration_count
     FROM sessions s
     LEFT JOIN session_registrations r ON r.session_id = s.id
     WHERE s.event_id = $1
     GROUP BY s.id
     ORDER BY s.start_time ASC`,
    [eventId]
  )
}

export async function getAllSessions() {
  return await query(
    `SELECT s.*, e.title AS event_title, COUNT(r.id) AS registration_count
     FROM sessions s
     LEFT JOIN events e ON e.id = s.event_id
     LEFT JOIN session_registrations r ON r.session_id = s.id
     GROUP BY s.id, e.title
     ORDER BY s.start_time ASC`
  )
}

export async function getSessionById(sessionId: string) {
  const rows = await query("SELECT * FROM sessions WHERE id=$1 LIMIT 1", [sessionId])
  return rows[0] || null
}

export async function createSession(sessionData: any) {
  const rows = await query(
    `INSERT INTO sessions (
      id, event_id, title, description, speaker_name, speaker_bio,
      start_time, end_time, location, max_attendees, session_type,
      created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
    RETURNING *`,
    [
      sessionData.id,
      sessionData.event_id,
      sessionData.title,
      sessionData.description || "",
      sessionData.speaker_name || "",
      sessionData.speaker_bio || "",
      sessionData.start_time,
      sessionData.end_time,
      sessionData.location || "",
      sessionData.max_attendees ?? null,
      sessionData.session_type || "presentation",
    ]
  )
  return rows[0]
}

export async function updateSession(sessionId: string, sessionData: any) {
  const rows = await query(
    `UPDATE sessions
     SET title=$1, description=$2, speaker_name=$3, speaker_bio=$4,
         start_time=$5, end_time=$6, location=$7,
         max_attendees=$8, session_type=$9, updated_at=NOW()
     WHERE id=$10
     RETURNING *`,
    [
      sessionData.title,
      sessionData.description || "",
      sessionData.speaker_name || "",
      sessionData.speaker_bio || "",
      sessionData.start_time,
      sessionData.end_time,
      sessionData.location || "",
      sessionData.max_attendees ?? null,
      sessionData.session_type || "presentation",
      sessionId,
    ]
  )
  return rows[0]
}

export async function deleteSession(sessionId: string) {
  const rows = await query("DELETE FROM sessions WHERE id=$1 RETURNING *", [sessionId])
  return rows[0] || null
}

// -----------------------------
// Attendees
// -----------------------------
export async function getEventAttendees(eventId: string) {
  return await query(
    `SELECT a.*, u.name, u.email
     FROM attendees a
     JOIN users u ON u.id = a.user_id
     WHERE a.event_id=$1
     ORDER BY u.created_at DESC`,
    [eventId]
  )
}

// -----------------------------
// Analytics
// -----------------------------
export async function getEventAnalytics(eventId: string) {
  const rows = await query(
    `SELECT
        COUNT(DISTINCT a.user_id) AS total_attendees,
        COUNT(DISTINCT s.id) AS total_sessions,
        COUNT(DISTINCT sr.id) AS total_registrations
     FROM events e
     LEFT JOIN attendees a ON a.event_id = e.id
     LEFT JOIN sessions s ON s.event_id = e.id
     LEFT JOIN session_registrations sr ON sr.session_id = s.id
     WHERE e.id=$1
     GROUP BY e.id`,
    [eventId]
  )
  return rows[0] || {
    total_attendees: 0,
    total_sessions: 0,
    total_registrations: 0,
  }
}
