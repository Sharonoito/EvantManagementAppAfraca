"use client"

import { useState, useEffect } from "react"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/admin/events/${params.id}`)
        const data = await res.json()
        setForm({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          start_date: data.start_date?.slice(0, 16) || "",
          end_date: data.end_date?.slice(0, 16) || "",
        })
      } catch (err) {
        console.error("Error fetching event:", err)
      }
    }
    fetchEvent()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch(`/api/admin/events/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    alert("Event updated!")
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#006600] mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded-md"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border p-2 rounded-md"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="datetime-local"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="datetime-local"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="w-full border p-2 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-[#006600] text-white px-4 py-2 rounded hover:bg-[#61CE70] transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
