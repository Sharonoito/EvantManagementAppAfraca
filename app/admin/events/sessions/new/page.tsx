"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export default function NewSessionPage() {
  const router = useRouter()
  const [events, setEvents] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_id: "",
    speaker_name: "",
    speaker_bio: "",
    start_time: "",
    end_time: "",
    location: "",
    max_attendees: undefined as number | undefined,
    session_type: "presentation", // default
  })

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/admin/events")
        const data = await res.json()

        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events.map((ev: any) => ({ id: ev.id, name: ev.title })))
        }
      } catch (err) {
        console.error("Error fetching events:", err)
      }
    }
    fetchEvents()
  }, [])

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const newSession = {
        id: uuidv4(),
        ...form,
      }

      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      })

      if (res.ok) {
        router.push("/admin/events/sessions")
      } else {
        console.error("Failed to create session")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create New Session</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Event dropdown */}
        <div className="flex flex-col">
          <label htmlFor="event_id" className="mb-1 font-medium">
            Associated Event
          </label>
          <select
            id="event_id"
            className="w-full border p-2"
            value={form.event_id}
            onChange={(e) => setForm({ ...form, event_id: e.target.value })}
            required
          >
            <option value="">Select an event</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Speaker Name"
          className="w-full border p-2"
          value={form.speaker_name}
          onChange={(e) => setForm({ ...form, speaker_name: e.target.value })}
        />

        <textarea
          placeholder="Speaker Bio"
          className="w-full border p-2"
          value={form.speaker_bio}
          onChange={(e) => setForm({ ...form, speaker_bio: e.target.value })}
        />

        <input
          type="datetime-local"
          className="w-full border p-2"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        />

        <input
          type="datetime-local"
          className="w-full border p-2"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-2"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max Attendees"
          className="w-full border p-2"
          value={form.max_attendees ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              max_attendees: e.target.value ? parseInt(e.target.value, 10) : undefined,
            })
          }
        />

        {/* Session Type dropdown */}
        <div className="flex flex-col">
          <label htmlFor="session_type" className="mb-1 font-medium">
            Session Type
          </label>
          <select
            id="session_type"
            className="w-full border p-2"
            value={form.session_type}
            onChange={(e) => setForm({ ...form, session_type: e.target.value })}
          >
            <option value="presentation">Presentation</option>
            <option value="workshop">Workshop</option>
            <option value="panel">Panel</option>
            <option value="networking">Networking</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Save Session
        </button>
      </form>
    </div>
  )
}


