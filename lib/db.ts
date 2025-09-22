import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

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
  const qrCode = `EVENT_${userData.id}_${Date.now()}`

  return await sql`
    INSERT INTO users (
      id, email, name, role, organization, title, phone,
      dietary_restrictions, accessibility_needs, networking_interests, qr_code, created_at, updated_at
    )
    VALUES (
      ${userData.id}, ${userData.email}, ${userData.name},
      ${userData.role || "attendee"}, ${userData.organization || ""},
      ${userData.title || ""}, ${userData.phone || ""},
      ${userData.dietary_restrictions || ""}, ${userData.accessibility_needs || ""},
      ${userData.networking_interests || []}, ${qrCode}, NOW(), NOW()
    )
    RETURNING *
  `
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `
  return result[0] || null
}

export async function getUserById(userId: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId} LIMIT 1
  `
  return result[0] || null
}

export async function getUserByQRCode(qrCode: string) {
  const result = await sql`
    SELECT * FROM users WHERE qr_code = ${qrCode} LIMIT 1
  `
  return result[0] || null
}

export async function checkInUser(qrCode: string) {
  return await sql`
    UPDATE users
    SET checked_in = TRUE, check_in_time = NOW(), updated_at = NOW()
    WHERE qr_code = ${qrCode}
    RETURNING *
  `
}

export async function getAllUsers() {
  return await sql`
    SELECT * FROM users ORDER BY created_at DESC
  `
}

// -----------------------------
// Events
// -----------------------------
export async function getAllEvents() {
  return await sql`
    SELECT e.*,
           COUNT(s.id) AS session_count
    FROM events e
    LEFT JOIN sessions s ON e.id = s.event_id
    GROUP BY e.id
    ORDER BY e.start_date DESC
  `
}

export async function getEventById(eventId: string) {
  const result = await sql`
    SELECT * FROM events WHERE id = ${eventId} LIMIT 1
  `
  return result[0] || null
}

export async function createEvent(eventData: {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  max_attendees?: number
  registration_deadline?: string
  status?: string
}) {
  return await sql`
    INSERT INTO events (
      id, title, description, start_date, end_date, location,
      max_attendees, registration_deadline, status, created_at, updated_at
    )
    VALUES (
      ${eventData.id}, ${eventData.title}, ${eventData.description || ""},
      ${eventData.start_date}, ${eventData.end_date}, ${eventData.location || ""},
      ${eventData.max_attendees ?? null}, ${eventData.registration_deadline ?? null},
      ${eventData.status || "draft"}, NOW(), NOW()
    )
    RETURNING *
  `
}

export async function updateEvent(
  eventId: string,
  eventData: {
    title: string
    description?: string
    start_date: string
    end_date: string
    location?: string
    max_attendees?: number
    registration_deadline?: string
    status?: string
  },
) {
  return await sql`
    UPDATE events
    SET title = ${eventData.title},
        description = ${eventData.description || ""},
        start_date = ${eventData.start_date},
        end_date = ${eventData.end_date},
        location = ${eventData.location || ""},
        max_attendees = ${eventData.max_attendees ?? null},
        registration_deadline = ${eventData.registration_deadline ?? null},
        status = ${eventData.status || "draft"},
        updated_at = NOW()
    WHERE id = ${eventId}
    RETURNING *
  `
}

export async function getEventSessions(eventId: string) {
  return await sql`
    SELECT * FROM sessions
    WHERE event_id = ${eventId}
    ORDER BY start_time ASC
  `
}

// -----------------------------
// Sessions
// -----------------------------
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
  return await sql`
    INSERT INTO sessions (
      id, event_id, title, description, speaker_name, speaker_bio,
      start_time, end_time, location, max_attendees, session_type, created_at, updated_at
    )
    VALUES (
      ${sessionData.id}, ${sessionData.event_id}, ${sessionData.title},
      ${sessionData.description || ""}, ${sessionData.speaker_name || ""},
      ${sessionData.speaker_bio || ""}, ${sessionData.start_time}, ${sessionData.end_time},
      ${sessionData.location || ""}, ${sessionData.max_attendees ?? null},
      ${sessionData.session_type || "presentation"}, NOW(), NOW()
    )
    RETURNING *
  `
}

export async function getAllSessions() {
  const rows = await sql`
    SELECT 
      s.id,
      s.title,
      s.description,
      s.speaker_name,
      s.start_time,
      s.end_time,
      s.location,
      e.title AS event_title,
      COUNT(r.id) AS registration_count,
      s.max_attendees
    FROM sessions s
    LEFT JOIN events e ON e.id = s.event_id
    LEFT JOIN session_registrations r ON r.session_id = s.id
    GROUP BY s.id, e.title
    ORDER BY s.start_time ASC
  `
  return rows
}

export async function getSessionById(sessionId: string) {
  const result = await sql`
    SELECT s.*, e.title AS event_title
    FROM sessions s
    LEFT JOIN events e ON s.event_id = e.id
    WHERE s.id = ${sessionId}
    LIMIT 1
  `
  return result[0] || null
}

export async function updateSession(
  sessionId: string,
  sessionData: {
    title: string
    description?: string
    speaker_name?: string
    speaker_bio?: string
    start_time: string
    end_time: string
    location?: string
    max_attendees?: number
    session_type?: string
  },
) {
  return await sql`
    UPDATE sessions
    SET title = ${sessionData.title},
        description = ${sessionData.description || ""},
        speaker_name = ${sessionData.speaker_name || ""},
        speaker_bio = ${sessionData.speaker_bio || ""},
        start_time = ${sessionData.start_time},
        end_time = ${sessionData.end_time},
        location = ${sessionData.location || ""},
        max_attendees = ${sessionData.max_attendees ?? null},
        session_type = ${sessionData.session_type || "presentation"},
        updated_at = NOW()
    WHERE id = ${sessionId}
    RETURNING *
  `
}

// -----------------------------
// Session Registrations
// -----------------------------
export async function registerForSession(data: {
  id: string
  session_id: string
  user_id: string
}) {
  return await sql`
    INSERT INTO session_registrations (
      id, session_id, user_id, created_at, updated_at
    )
    VALUES (
      ${data.id}, ${data.session_id}, ${data.user_id}, NOW(), NOW()
    )
    RETURNING *
  `
}

export async function getSessionRegistrations(sessionId: string) {
  return await sql`
    SELECT sr.*, u.name AS user_name, u.email AS user_email
    FROM session_registrations sr
    JOIN users u ON sr.user_id = u.id
    WHERE sr.session_id = ${sessionId}
    ORDER BY sr.created_at ASC
  `
}

export async function checkInSessionRegistration(registrationId: string) {
  return await sql`
    UPDATE session_registrations
    SET checked_in = TRUE, check_in_time = NOW(), updated_at = NOW()
    WHERE id = ${registrationId}
    RETURNING *
  `
}

export async function cancelSessionRegistration(registrationId: string) {
  return await sql`
    DELETE FROM session_registrations
    WHERE id = ${registrationId}
    RETURNING *
  `
}

export async function getUserByQr(qr: string) {
  const result = await sql`
    SELECT *
    FROM users
    WHERE qr_code = ${qr}
    LIMIT 1
  `
  return result[0] || null
}
