"use client"

import { useState, useEffect } from "react"

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const [stats, setStats] = useState({
    attendees: 0,
    sessions: 0,
    feedback: 0,
  })

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/admin/events/${params.id}/analytics`)
        const data = await res.json()
        setStats(data || { attendees: 0, sessions: 0, feedback: 0 })
      } catch (err) {
        console.error("Error fetching analytics:", err)
      }
    }
    fetchAnalytics()
  }, [params.id])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#006600] mb-6">Event Analytics</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#006600] text-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold">Attendees</h2>
          <p className="text-3xl">{stats.attendees}</p>
        </div>
        <div className="bg-[#61CE70] text-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold">Sessions</h2>
          <p className="text-3xl">{stats.sessions}</p>
        </div>
        <div className="bg-[#C9A277] text-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold">Feedback</h2>
          <p className="text-3xl">{stats.feedback}</p>
        </div>
      </div>
    </div>
  )
}
