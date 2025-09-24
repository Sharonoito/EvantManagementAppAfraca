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
    session_type: "presentation",
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-[#006600] text-center">
          Create New Session
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Event dropdown */}
          <div>
            <label
              htmlFor="event_id"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Associated Event
            </label>
            <select
              id="event_id"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
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

          {/* Speaker Name */}
          <input
            type="text"
            placeholder="Speaker Name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            value={form.speaker_name}
            onChange={(e) => setForm({ ...form, speaker_name: e.target.value })}
          />

          {/* Speaker Bio */}
          <textarea
            placeholder="Speaker Bio"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            rows={2}
            value={form.speaker_bio}
            onChange={(e) => setForm({ ...form, speaker_bio: e.target.value })}
          />

          {/* Start Time */}
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          />

          {/* End Time */}
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          {/* Max Attendees */}
          <input
            type="number"
            placeholder="Max Attendees"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
            value={form.max_attendees ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                max_attendees: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
          />

          {/* Session Type dropdown */}
          <div>
            <label
              htmlFor="session_type"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Session Type
            </label>
            <select
              id="session_type"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#61CE70]"
              value={form.session_type}
              onChange={(e) => setForm({ ...form, session_type: e.target.value })}
            >
              <option value="presentation">Presentation</option>
              <option value="workshop">Workshop</option>
              <option value="panel">Panel</option>
              <option value="networking">Networking</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#006600] text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#61CE70] transition-colors font-semibold"
          >
            Save Session
          </button>
        </form>
      </div>
    </div>
  )
}
