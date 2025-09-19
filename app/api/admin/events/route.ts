import { type NextRequest, NextResponse } from "next/server"
import { createEvent, getAllEvents } from "@/lib/db" // Import getAllEvents

// This tells Next.js to not cache the response for this route handler.
export const revalidate = 0

// Create new event
export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()

    // Validate required fields
    if (!eventData.title || !eventData.start_date || !eventData.end_date) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, start date, and end date are required",
        },
        { status: 400 },
      )
    }

    // Generate unique event ID
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create event in DB
    const result = await createEvent({ id: eventId, ...eventData })

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      event: result[0],
    })
  } catch (error) {
    console.error("Create event error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create event" },
      { status: 500 },
    )
  }
}

// Fetch all events
export async function GET() {
  try {
    // Corrected line: Call the getAllEvents function from db.ts
    const events = await getAllEvents()

    return NextResponse.json({
      success: true,
      events,
    })
  } catch (error) {
    console.error("Fetch events error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 },
    )
  }
}




// import { type NextRequest, NextResponse } from "next/server"
// import { createEvent } from "@/lib/db"

// export async function POST(request: NextRequest) {
//   try {
//     const eventData = await request.json()

//     // Validate required fields
//     if (!eventData.title || !eventData.start_date || !eventData.end_date) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Title, start date, and end date are required",
//         },
//         { status: 400 },
//       )
//     }

//     // Generate event ID
//     const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

//     // Create event
//     const result = await createEvent({
//       id: eventId,
//       ...eventData,
//     })

//     return NextResponse.json({
//       success: true,
//       message: "Event created successfully",
//       event: result[0],
//     })
//   } catch (error) {
//     console.error("Create event error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to create event",
//       },
//       { status: 500 },
//     )
//   }
// }
