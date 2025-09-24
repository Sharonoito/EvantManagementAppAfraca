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
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#006600] dark:text-[#61CE70] mb-3">
              Session Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Create and manage sessions for events
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              asChild
              className="bg-[#006600] hover:bg-[#61CE70] text-white transition-all shadow-md"
            >
              <Link href="/admin/events/sessions/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Link>
            </Button>
          </div>
        </div>

        {/* Sessions List */}
        <Card className="shadow-lg rounded-2xl border border-[#C9A277]">
          <CardHeader>
            <CardTitle className="text-[#006600]">All Sessions</CardTitle>
            <CardDescription>Manage event sessions and speakers</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-14 w-14 text-[#C9A277] mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-300 text-lg mb-4">
                  No sessions created yet
                </p>
                <Button
                  asChild
                  className="bg-[#006600] hover:bg-[#61CE70] text-white shadow-md"
                >
                  <Link href="/admin/events/sessions/new">Create Your First Session</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="rounded-lg border border-gray-200 dark:border-gray-700">
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                      <TableHead className="font-semibold text-[#006600]">Session</TableHead>
                      <TableHead className="font-semibold text-[#006600]">Speaker</TableHead>
                      <TableHead className="font-semibold text-[#006600]">Date & Time</TableHead>
                      <TableHead className="font-semibold text-[#006600]">Location</TableHead>
                      <TableHead className="font-semibold text-[#006600]">Event</TableHead>
                      <TableHead className="font-semibold text-[#006600]">Attendees</TableHead>
                      <TableHead className="text-right font-semibold text-[#006600]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session: any) => (
                      <TableRow
                        key={session.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {session.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {session.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <User className="h-4 w-4 text-[#61CE70]" />
                            {session.speaker_name || "TBA"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Calendar className="h-4 w-4 text-[#C9A277]" />
                            <div>
                              <p>{new Date(session.start_time).toLocaleDateString()}</p>
                              <p className="text-gray-500 dark:text-gray-400">
                                {new Date(session.start_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {" - "}
                                {new Date(session.end_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <MapPin className="h-4 w-4 text-[#61CE70]" />
                            {session.location || "TBD"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              session.event_title
                                ? "bg-[#C9A277] text-white"
                                : "border border-[#C9A277] text-[#C9A277]"
                            } px-2 py-1 rounded-md text-sm`}
                          >
                            {session.event_title || "Unlinked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Users className="h-4 w-4 text-[#006600]" />
                            {session.registration_count || 0} / {session.max_attendees || "∞"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-[#61CE70] hover:bg-[#61CE70] hover:text-white transition-all"
                            >
                              <Link href={`/admin/events/sessions/${session.id}`}>View</Link>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-[#C9A277] hover:bg-[#C9A277] hover:text-white transition-all"
                            >
                              <Link href={`/admin/events/sessions/${session.id}/edit`}>Edit</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
