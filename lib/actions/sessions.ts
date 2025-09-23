// app/actions/createSession.ts
"use server";

import { pool } from "@/lib/db";
import { randomUUID } from "crypto";

export async function createSession(data: any) {
  const id = randomUUID();

  const query = `
    INSERT INTO sessions 
      (id, title, description, speaker_name, start_time, end_time, location, event_id, max_attendees)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *;
  `;

  const values = [
    id,
    data.title,
    data.description,
    data.speaker_name,
    data.start_time,
    data.end_time,
    data.location,
    data.event_id,
    data.max_attendees,
  ];

  const result = await pool.query(query, values);

  return result.rows[0]; // returns the inserted row
}
