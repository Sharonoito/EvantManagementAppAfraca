"use client"

import { QRCodeCanvas } from "qrcode.react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  QrCode,
} from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  status: string
  session_count?: number
  qr_code: string
}

export default function EventsList({ events = [] }: { events?: Event[] }) {
  function downloadQR(id: number) {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement
    if (!canvas) return

    const url = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = url
    link.download = `event-${id}-qr.png`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Event Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage events and sessions
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link href="/admin/events/sessions">Manage Sessions</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/events/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {!events || events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No events found. Create your first event to get started.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/admin/events/new">Create Your First Event</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {event.title}
                        <Badge
                          variant={
                            event.status === "published"
                              ? "default"
                              : event.status === "ongoing"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {event.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href="#">
                          <Trash2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Event info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.location || "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">0 attendees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.session_count || 0} sessions
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <Button asChild size="sm">
                      <Link href={`/admin/events/${event.id}/sessions`}>
                        Manage Sessions
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/events/${event.id}/attendees`}>
                        View Attendees
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/events/${event.id}/analytics`}>
                        Analytics
                      </Link>
                    </Button>
                  </div>

                  {/* QR Code */}
                  {event.qr_code && (
                    <div className="mt-6 flex flex-col items-center">
                      <QRCodeCanvas
                        id={`qr-${event.id}`}
                        value={event.qr_code}
                        size={160}
                        includeMargin
                      />
                      <Button
                        onClick={() => downloadQR(event.id)}
                        size="sm"
                        variant="outline"
                        className="mt-3 flex items-center gap-2"
                      >
                        <QrCode className="h-4 w-4" />
                        Download QR
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
