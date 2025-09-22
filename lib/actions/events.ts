"use server"

import { randomUUID } from "crypto"
import { createEvent as dbCreateEvent } from "@/lib/db"

export async function createEvent(data: {
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  max_attendees?: number
  registration_deadline?: string
  status?: string
}) {
  const id = randomUUID()
  const event = await dbCreateEvent({
    id,
    ...data,
  })
  return event[0] // neon returns array
}
