import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, User, Users, Search } from "lucide-react"
import Link from "next/link"
import { getAllSessions, getAllEvents } from "@/lib/db"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react"

export default async function SessionsPage() {
  const sessions = await getAllSessions()
  const events = await getAllEvents()

  // Group sessions by date
  const sessionsByDate = sessions.reduce(
    (acc, session) => {
      const date = new Date(session.start_time).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(session)
      return acc
    },
    {} as Record<string, typeof sessions>,
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sessions</h1>
            <p className="text-gray-600 dark:text-gray-300">Browse and register for congress sessions</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/attendee">Back to Portal</Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search sessions by title, speaker, or topic..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="panel">Panel</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {Object.keys(sessionsByDate).map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString([], {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions by Date */}
        {Object.keys(sessionsByDate).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No sessions scheduled yet</p>
              <p className="text-sm text-muted-foreground">Check back later for session updates</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(sessionsByDate)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, dateSessions]) => (
                <div key={date}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {new Date(date).toLocaleDateString([], {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>

                  <div className="grid gap-6">
                    {dateSessions
                      .sort((a: { start_time: string | number | Date }, b: { start_time: string | number | Date }) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                      .map((session: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; session_type: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; speaker_name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; start_time: string | number | Date; end_time: string | number | Date; location: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; registration_count: any; max_attendees: any }) => (
                        <Card key={session.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-semibold">{session.title}</h3>
                                  <Badge variant="outline">{session.session_type}</Badge>
                                </div>

                                <p className="text-muted-foreground mb-3 line-clamp-2">{session.description}</p>

                                {session.speaker_name && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                      {session.speaker_name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(session.start_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(session.end_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>

                              {session.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {session.location}
                                </div>
                              )}

                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {session.registration_count || 0} registered
                                {session.max_attendees && ` / ${session.max_attendees} max`}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {new Date(session.start_time) < new Date() ? (
                                  <Badge variant="outline" className="text-gray-600 border-gray-300">
                                    Completed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Upcoming
                                  </Badge>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/attendee/sessions/${session.id}`}>View Details</Link>
                                </Button>
                                {new Date(session.start_time) > new Date() && <Button size="sm">Register</Button>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
