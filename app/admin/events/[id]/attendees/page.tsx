"use client"

import { useState, useEffect } from "react"

export default function AttendeesPage({ params }: { params: { id: string } }) {
  const [attendees, setAttendees] = useState<any[]>([])

  useEffect(() => {
    async function fetchAttendees() {
      try {
        const res = await fetch(`/api/admin/events/${params.id}/attendees`)
        const data = await res.json()
        setAttendees(data.attendees || [])
      } catch (err) {
        console.error("Error fetching attendees:", err)
      }
    }
    fetchAttendees()
  }, [params.id])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#006600] mb-6">Attendees</h1>
      {attendees.length === 0 ? (
        <p className="text-gray-600">No attendees registered yet.</p>
      ) : (
        <ul className="space-y-3">
          {attendees.map((a) => (
            <li
              key={a.id}
              className="border p-3 rounded-md shadow flex justify-between"
            >
              <span>{a.name}</span>
              <span className="text-sm text-gray-500">{a.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
