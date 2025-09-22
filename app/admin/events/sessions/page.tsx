import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, Users, Plus, User } from "lucide-react"
import Link from "next/link"
import { getAllSessions } from "@/lib/db"

export default async function SessionsPage() {
  const sessions = await getAllSessions()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Session Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Create and manage sessions for events</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild>
              <Link href="/admin/events/sessions/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Link>
            </Button>
          </div>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
            <CardDescription>Manage event sessions and speakers</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No sessions created yet</p>
                <Button asChild>
                  <Link href="/admin/events/sessions/new">Create Your First Session</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Speaker</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {session.speaker_name || "TBA"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p>{new Date(session.start_time).toLocaleDateString()}</p>
                            <p className="text-muted-foreground">
                              {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              {" - "}
                              {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {session.location || "TBD"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.event_title || "Unlinked"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {session.registration_count || 0} / {session.max_attendees || "∞"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/events/sessions/${session.id}`}>View</Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/events/sessions/${session.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
