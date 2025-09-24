// app/api/admin/events/sessions/route.ts
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Validate required fields
    if (
      !data.event_id ||
      !data.title ||
      !data.description ||
      !data.start_time ||
      !data.end_time
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build object for DB insert (snake_case)
    const sessionData = {
      id: data.id ?? uuidv4(), // generate if not provided
      event_id: data.event_id,
      title: data.title,
      description: data.description,
      speaker_name: data.speaker_name,
      speaker_bio: data.speaker_bio,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
      location: data.location,
      max_attendees: data.max_attendees
        ? parseInt(data.max_attendees, 10)
        : null,
      session_type: data.session_type,
    }

    await createSession(sessionData)

    return NextResponse.json(
      { message: 'Session created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating session:', error)

    return NextResponse.json(
      { message: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
