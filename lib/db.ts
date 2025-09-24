import "server-only"
import { Pool } from "pg"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

// base URL used for QR check-in links (fallback to localhost)
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? "http://localhost:3000"

// -----------------------------
// DB connection
// -----------------------------
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// generic query helper
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const res = await pool.query(text, params)
  return res.rows
}

export async function sql<T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> {
  const text = strings.reduce((prev, curr, i) => prev + curr + (i < values.length ? `$${i + 1}` : ""), "")
  return query<T>(text, values)
}

// -----------------------------
// Users
// -----------------------------
export async function createUser(userData: {
  id: string
  email: string
  name: string
  role?: string
  organization?: string
  title?: string
  phone?: string
  dietary_restrictions?: string
  accessibility_needs?: string
  networking_interests?: string[]
}) {
  const qrCode = `USER_${userData.id}_${Date.now()}`
  const rows = await query(
    `INSERT INTO users (
      id, email, name, role, organization, title, phone,
      dietary_restrictions, accessibility_needs, networking_interests,
      qr_code, created_at, updated_at
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW()
    )
    RETURNING *`,
    [
      userData.id,
      userData.email,
      userData.name,
      userData.role || "attendee",
      userData.organization || "",
      userData.title || "",
      userData.phone || "",
      userData.dietary_restrictions || "",
      userData.accessibility_needs || "",
      userData.networking_interests || [],
      qrCode,
    ]
  )
  return rows[0]
}

export async function getUserByEmail(email: string) {
  const result = await query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email])
  return result[0] || null
}

export async function getUserById(userId: string) {
  const result = await query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [userId])
  return result[0] || null
}

export async function checkInUser(qrCode: string) {
  const rows = await query(
    `UPDATE users
     SET checked_in = TRUE, check_in_time = NOW(), updated_at = NOW()
     WHERE qr_code = $1
     RETURNING *`,
    [qrCode]
  )
  return rows[0] || null
}

export async function getAllUsers() {
  return await query("SELECT * FROM users ORDER BY created_at DESC")
}

// -----------------------------
// Events
// -----------------------------
export async function getAllEvents() {
  try {
    const rows = await query(
      `SELECT e.*, COUNT(s.id) AS session_count
       FROM events e
       LEFT JOIN sessions s ON e.id = s.event_id
       GROUP BY e.id
       ORDER BY e.start_date DESC`
    )
    return rows || []
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
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
  location?: string
  max_attendees?: number | null
  registration_deadline?: string | null
  status?: string
}) {
  const qrCode = `${BASE_URL}/checkin/${eventData.id}`

  const rows = await query(
    `INSERT INTO events (
      id, title, description, start_date, end_date, location,
      max_attendees, registration_deadline, status, qr_code, created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
    RETURNING *`,
    [
      eventData.id,
      eventData.title,
      eventData.description || "",
      eventData.start_date,
      eventData.end_date,
      eventData.location || "",
      eventData.max_attendees ?? null,
      eventData.registration_deadline ?? null,
      eventData.status || "draft",
      qrCode,
    ]
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

export async function getEventByQRCode(qr_Code: string) {
  const rows = await query(`SELECT * FROM events WHERE qr_code = $1 LIMIT 1`, [qr_Code])
  return rows[0] || null
}

export const getEventByQr = getEventByQRCode

// -----------------------------
// Event check-ins
// -----------------------------
export async function createEventCheckin(eventId: string, email: string) {
  const rows = await query(
    `INSERT INTO event_checkins (event_id, email, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (event_id, email) DO NOTHING
     RETURNING *`,
    [eventId, email]
  )
  return rows[0] || null
}

export async function getEventCheckins(eventId: string) {
  return await query(
    `SELECT * FROM event_checkins WHERE event_id = $1 ORDER BY created_at DESC`,
    [eventId]
  )
}

export async function checkInToEventByQr(qrCode: string, email: string) {
  const event = await getEventByQRCode(qrCode)
  if (!event) return { event: null, checkin: null, user: null }

  const checkin = await createEventCheckin(String(event.id), email)
  const user = await getUserByEmail(email)

  return { event, checkin, user }
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

export async function createSession(sessionData: {
  id: string
  event_id: string
  title: string
  description?: string
  speaker_name?: string
  speaker_bio?: string
  start_time: string
  end_time: string
  location?: string
  max_attendees?: number | null
  session_type?: string
}) {
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
// Session registrations
// -----------------------------
export async function registerForSession(data: {
  id: string
  session_id: string
  user_id: string
}) {
  const rows = await query(
    `INSERT INTO session_registrations (
      id, session_id, user_id, created_at, updated_at
    )
    VALUES ($1,$2,$3,NOW(),NOW())
    RETURNING *`,
    [data.id, data.session_id, data.user_id]
  )
  return rows[0]
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
