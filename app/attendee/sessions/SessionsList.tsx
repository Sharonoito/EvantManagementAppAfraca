"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users } from "lucide-react"

interface SessionsListProps {
  sessionsByDate: Record<string, any[]>
  currentUserId: string
}

export default function SessionsList({ sessionsByDate, currentUserId }: SessionsListProps) {
  const [sessionsState, setSessionsState] = useState<Record<string, any[]>>(sessionsByDate)

  const handleRegister = async (date: string, sessionId: string) => {
    if (!currentUserId || !sessionId) {
      alert("❌ Missing userId or sessionId")
      return
    }

    try {
      const res = await fetch("/api/register-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, sessionId }),
      })
      const data = await res.json()

      if (data.success) {
        setSessionsState((prev) => {
          const updatedSessions = prev[date].map((s) =>
            s.id === sessionId
              ? { ...s, is_registered: true, registered_count: (s.registered_count || 0) + 1 }
              : s
          )
          return { ...prev, [date]: updatedSessions }
        })
        alert("✅ You have registered successfully!")
      } else {
        alert(data.message || `❌ ${data.error || "Registration failed"}`)
      }
    } catch (err) {
      console.error("API error:", err)
      alert("❌ Something went wrong. Try again.")
    }
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-green-900 mb-8 text-center">
        Event Sessions
      </h1>

      {Object.keys(sessionsState).map((date) => (
        <div key={date} className="mb-12">
          {/* Day Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <Badge variant="outline" className="border-green-600 text-green-700 px-3 py-1">
              {sessionsState[date].length} sessions
            </Badge>
          </div>

          {/* Sessions Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {sessionsState[date].map((session: any) => {
              const sessionId = session.id
              if (!sessionId) return null

              const isFull = session.max_capacity && (session.registered_count || 0) >= session.max_capacity
              const isPast = new Date(`${session.session_date}T${session.end_time}`) < new Date()
              const isRegistered = session.is_registered

              return (
                <Card
                  key={sessionId}
                  className="hover:shadow-xl border border-gray-200 transition-shadow rounded-xl p-4"
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      {/* Session Info */}
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-green-800 mb-1">
                          {session.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mb-3">
                          {session.description}
                        </CardDescription>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span>
                              {session.start_time} - {session.end_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-yellow-600" />
                            <span>
                              {(session.registered_count || 0)}/{session.max_capacity || "∞"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action & Badges */}
                      <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
                        {session.speaker && (
                          <Badge className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            {session.speaker}
                          </Badge>
                        )}
                        {isRegistered && (
                          <Badge className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Registered
                          </Badge>
                        )}
                        {isFull && !isRegistered && (
                          <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Full
                          </Badge>
                        )}
                        {!isRegistered && !isFull && !isPast && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white mt-1"
                            onClick={() => handleRegister(date, sessionId)}
                          >
                            Register
                          </Button>
                        )}
                        {isPast && (
                          <Badge className="bg-gray-200 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                            Past Session
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
