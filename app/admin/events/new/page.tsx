"use client"

import { useState } from "react"
import { createEvent } from "@/lib/actions/events"
import { useRouter } from "next/navigation"

export default function NewEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    max_attendees: 0,
  })
  const [qrCode, setQrCode] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = await createEvent(form)
    setQrCode(result.qr_code) // Store QR link for preview
    router.push("/admin/events")
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded p-2 w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <input
          type="datetime-local"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <input
          type="number"
          placeholder="Max Attendees"
          value={form.max_attendees}
          onChange={(e) =>
            setForm({ ...form, max_attendees: Number(e.target.value) })
          }
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Event
        </button>
      </form>

      {qrCode && (
        <div className="mt-6">
          <h2 className="font-semibold">QR Code URL:</h2>
          <p>{qrCode}</p>
        </div>
      )}
    </div>
  )
}
