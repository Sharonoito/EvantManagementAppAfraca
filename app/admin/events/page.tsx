import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { getAllEvents } from "@/lib/db"

export default async function EventsPage() {
  const events = await getAllEvents()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#006600] dark:text-[#61CE70] mb-3">
              Event Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Create and manage events and sessions with ease
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              asChild
              variant="outline"
              className="border-[#006600] text-[#006600] hover:bg-[#61CE70] hover:text-white transition-all"
            >
              <Link href="/admin/events/sessions">Manage Sessions</Link>
            </Button>
            <Button
              asChild
              className="bg-[#006600] hover:bg-[#61CE70] text-white transition-all shadow-lg"
            >
              <Link href="/admin/events/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Events List - Card Layout */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <Card className="shadow-lg hover:shadow-xl transition-shadow border border-[#61CE70]">
              <CardContent className="text-center py-10">
                <Calendar className="h-14 w-14 mx-auto mb-4 text-[#C9A277]" />
                <p className="text-gray-500 dark:text-gray-300 text-lg">
                  No events found. Create your first event to get started.
                </p>
                <Button
                  asChild
                  className="mt-5 bg-[#006600] hover:bg-[#61CE70] text-white shadow-md"
                >
                  <Link href="/admin/events/new">Create Your First Event</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-2xl transition-transform transform hover:-translate-y-1 rounded-2xl border border-[#C9A277]"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-[#006600]">
                        {event.title}
                        <Badge
                          className={`${
                            event.status === "published"
                              ? "bg-[#006600] text-white"
                              : event.status === "ongoing"
                              ? "bg-[#61CE70] text-white"
                              : "border border-[#C9A277] text-[#C9A277]"
                          } px-2 py-1 rounded-md text-sm`}
                        >
                          {event.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {event.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-[#61CE70] hover:bg-[#61CE70] hover:text-white"
                      >
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-[#C9A277] hover:bg-[#C9A277] hover:text-white"
                      >
                        <Link href="#">
                          <Trash2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-700 dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#C9A277]" />
                      <span className="text-sm">
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#61CE70]" />
                      <span className="text-sm">{event.location || "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#006600]" />
                      <span className="text-sm">0 attendees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#61CE70]" />
                      <span className="text-sm">{event.session_count || 0} sessions</span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="bg-[#006600] hover:bg-[#61CE70] text-white shadow-md"
                    >
                      <Link href={`/admin/events/${event.id}/sessions`}>Manage Sessions</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-[#61CE70] hover:bg-[#61CE70] hover:text-white"
                    >
                      <Link href={`/admin/events/${event.id}/attendees`}>View Attendees</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-[#C9A277] hover:bg-[#C9A277] hover:text-white"
                    >
                      <Link href={`/admin/events/${event.id}/analytics`}>Analytics</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
