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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Event Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Create and manage events and sessions</p>
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

        {/* Events List - Card Layout */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No events found. Create your first event to get started.</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/events/new">Create Your First Event</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
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
                        {/* The trash icon would typically trigger a delete function. This is just for the layout. */}
                        <Link href="#"> 
                          <Trash2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                      <span className="text-sm">
                        {/* Assuming you don't have this data, it's a placeholder */}
                        0 attendees
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.session_count || 0} sessions</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm">
                      <Link href={`/admin/events/${event.id}/sessions`}>Manage Sessions</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/events/${event.id}/attendees`}>View Attendees</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
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


// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Calendar, MapPin, Users, Plus } from "lucide-react"
// import Link from "next/link"
// import { getAllEvents } from "@/lib/db"

// export default async function EventsPage() {
//   const events = await getAllEvents()

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Event Management</h1>
//             <p className="text-gray-600 dark:text-gray-300">Create and manage events and sessions</p>
//           </div>
//           <div className="flex gap-3 mt-4 md:mt-0">
//             <Button asChild variant="outline">
//               <Link href="/admin/events/sessions">Manage Sessions</Link>
//             </Button>
//             <Button asChild>
//               <Link href="/admin/events/new">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Event
//               </Link>
//             </Button>
//           </div>
//         </div>

//         {/* Events List */}
//         <Card>
//           <CardHeader>
//             <CardTitle>All Events</CardTitle>
//             <CardDescription>Manage your events and their sessions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {events.length === 0 ? (
//               <div className="text-center py-12">
//                 <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-muted-foreground mb-4">No events created yet</p>
//                 <Button asChild>
//                   <Link href="/admin/events/new">Create Your First Event</Link>
//                 </Button>
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Event</TableHead>
//                     <TableHead>Date & Time</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Sessions</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {events.map((event) => (
//                     <TableRow key={event.id}>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{event.title}</p>
//                           <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p>{new Date(event.start_date).toLocaleDateString()}</p>
//                             <p className="text-muted-foreground">
//                               {new Date(event.start_date).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-sm">
//                           <MapPin className="h-4 w-4 text-muted-foreground" />
//                           {event.location || "TBD"}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             event.status === "published"
//                               ? "default"
//                               : event.status === "ongoing"
//                                 ? "secondary"
//                                 : event.status === "completed"
//                                   ? "outline"
//                                   : "outline"
//                           }
//                         >
//                           {event.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Users className="h-4 w-4 text-muted-foreground" />
//                           {event.session_count || 0} sessions
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex gap-2 justify-end">
//                           <Button asChild variant="outline" size="sm">
//                             <Link href={`/admin/events/${event.id}`}>View</Link>
//                           </Button>
//                           <Button asChild variant="outline" size="sm">
//                             <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


