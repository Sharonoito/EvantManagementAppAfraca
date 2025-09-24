import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import {
  getEventSessions,
  createSession,
  updateSession,
  getSessionById,
  query,
} from "@/lib/db"

// -----------------------------
// GET all sessions for event
// -----------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const sessions = await getEventSessions(params.eventId)
    return NextResponse.json({ success: true, data: sessions })
  } catch (err: any) {
    console.error("GET /sessions error:", err)
    return NextResponse.json(
      { success: false, message: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

// -----------------------------
// POST create new session
// -----------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const body = await req.json()
    const newSession = await createSession({
      id: uuidv4(),
      event_id: params.eventId,
      title: body.title,
      description: body.description || "",
      speaker_name: body.speaker_name || "",
      speaker_bio: body.speaker_bio || "",
      start_time: body.start_time,
      end_time: body.end_time,
      location: body.location || "",
      max_attendees: body.max_attendees ?? null,
      session_type: body.session_type || "presentation",
    })
    return NextResponse.json({ success: true, data: newSession })
  } catch (err: any) {
    console.error("POST /sessions error:", err)
    return NextResponse.json(
      { success: false, message: "Failed to create session" },
      { status: 500 }
    )
  }
}

// -----------------------------
// PUT update session
// -----------------------------
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      )
    }

    const existing = await getSessionById(body.id)
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      )
    }

    const updated = await updateSession(body.id, {
      title: body.title,
      description: body.description || "",
      speaker_name: body.speaker_name || "",
      speaker_bio: body.speaker_bio || "",
      start_time: body.start_time,
      end_time: body.end_time,
      location: body.location || "",
      max_attendees: body.max_attendees ?? null,
      session_type: body.session_type || "presentation",
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    console.error("PUT /sessions error:", err)
    return NextResponse.json(
      { success: false, message: "Failed to update session" },
      { status: 500 }
    )
  }
}

// -----------------------------
// DELETE session
// -----------------------------
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      )
    }

    const rows = await query(
      `DELETE FROM sessions WHERE id=$1 RETURNING *`,
      [id]
    )

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (err: any) {
    console.error("DELETE /sessions error:", err)
    return NextResponse.json(
      { success: false, message: "Failed to delete session" },
      { status: 500 }
    )
  }
}



// import { type NextRequest, NextResponse } from "next/server"
// import { getEventSessions, createSession } from "@/lib/db"
// import { v4 as uuidv4 } from "uuid"

// interface Props {
//   params: {
//     eventId: string
//   }
// }

// // GET: all sessions for an event
// export async function GET(request: NextRequest, { params }: Props) {
//   try {
//     const sessions = await getEventSessions(params.eventId)
//     return NextResponse.json({ success: true, sessions })
//   } catch (error) {
//     console.error("Get sessions error:", error)
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch sessions" },
//       { status: 500 },
//     )
//   }
// }

// // POST: create new session
// export async function POST(request: NextRequest, { params }: Props) {
//   try {
//     const data = await request.json()

//     if (!data.title || !data.start_time || !data.end_time) {
//       return NextResponse.json(
//         { success: false, message: "Title, start_time, and end_time are required" },
//         { status: 400 },
//       )
//     }

//     const newSession = {
//       id: uuidv4(),
//       event_id: params.eventId,
//       title: data.title,
//       description: data.description || "",
//       speaker_name: data.speaker_name || "",
//       speaker_bio: data.speaker_bio || "",
//       start_time: new Date(data.start_time).toISOString(),
//       end_time: new Date(data.end_time).toISOString(),
//       location: data.location || "",
//       max_attendees: data.max_attendees ? parseInt(data.max_attendees, 10) : null,
//       session_type: data.session_type || "presentation",
//     }

//     const result = await createSession(newSession)

//     return NextResponse.json({ success: true, session: result }, { status: 201 })
//   } catch (error) {
//     console.error("Create session error:", error)
//     return NextResponse.json(
//       { success: false, message: "Failed to create session" },
//       { status: 500 },
//     )
//   }
// }
