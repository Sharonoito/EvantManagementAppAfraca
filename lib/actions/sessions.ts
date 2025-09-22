"use server";

import { sql } from "@/lib/db";
import { randomUUID } from "crypto";

export async function createSession(data: any) {
  const id = randomUUID();

  await sql/*sql*/`
    INSERT INTO sessions (id, title, description, speaker_name, start_time, end_time, location, event_id, max_attendees)
    VALUES (
      ${id}, 
      ${data.title}, 
      ${data.description}, 
      ${data.speaker_name}, 
      ${data.start_time}, 
      ${data.end_time}, 
      ${data.location}, 
      ${data.event_id}, 
      ${data.max_attendees}
    )
  `;

  return { id, ...data };
}
