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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center text-[#006600]">
          Create New Event
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Fill in the details below to schedule your event
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Event Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#61CE70] focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              placeholder="Event Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#61CE70] focus:outline-none transition"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#61CE70] focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#61CE70] focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Event Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#61CE70] focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Max Attendees
            </label>
            <input
              type="number"
              placeholder="Maximum Attendees"
              value={form.max_attendees}
              onChange={(e) =>
                setForm({ ...form, max_attendees: Number(e.target.value) })
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#61CE70] focus:outline-none transition"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/events")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-white bg-[#006600] hover:bg-[#61CE70] focus:ring-2 focus:ring-[#C9A277] shadow-md transition"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
