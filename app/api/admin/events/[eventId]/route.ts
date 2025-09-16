import { type NextRequest, NextResponse } from "next/server"
import { getEventById, updateEvent } from "@/lib/db"

interface Props {
  params: {
    eventId: string
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const event = await getEventById(params.eventId)

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Get event error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get event",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
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

    // Update event
    const result = await updateEvent(params.eventId, eventData)

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      event: result[0],
    })
  } catch (error) {
    console.error("Update event error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update event",
      },
      { status: 500 },
    )
  }
}
