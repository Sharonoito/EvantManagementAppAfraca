"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function ManageSessionsPage({ params }: { params: { id: string } }) {
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch(`/api/admin/events/${params.id}/sessions`)
        const data = await res.json()
        setSessions(data.sessions || [])
      } catch (err) {
        console.error("Error fetching sessions:", err)
      }
    }
    fetchSessions()
  }, [params.id])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#006600]">Manage Sessions</h1>
        <Link
          href={`/admin/events/${params.id}/sessions/new`}
          className="flex items-center bg-[#006600] hover:bg-[#61CE70] text-white px-4 py-2 rounded shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Link>
      </div>
      {sessions.length === 0 ? (
        <p className="text-gray-600">No sessions yet.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="p-4 border rounded-md shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold text-lg text-[#006600]">{s.title}</h2>
                <p className="text-gray-600">{s.speaker_name}</p>
              </div>
              <Link
                href={`/admin/sessions/${s.id}/edit`}
                className="text-[#C9A277] hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
