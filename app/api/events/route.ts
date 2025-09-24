import { NextResponse } from "next/server"
import { getAllEvents } from "@/lib/db"

export async function GET() {
  try {
    const events = await getAllEvents()
    return NextResponse.json(events)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
