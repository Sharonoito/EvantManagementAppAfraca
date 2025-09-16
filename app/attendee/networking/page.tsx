import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Building, MessageCircle, UserPlus } from "lucide-react"
import Link from "next/link"
import { getAllUsers } from "@/lib/db"

export default async function NetworkingPage() {
  const users = await getAllUsers()
  const attendees = users.filter((user) => user.role === "attendee" && user.checked_in)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Networking</h1>
            <p className="text-gray-600 dark:text-gray-300">Connect with fellow congress attendees</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link href="/attendee/networking/connections">My Connections</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/attendee">Back to Portal</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendees.length}</div>
              <p className="text-xs text-muted-foreground">Currently checked in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Connections</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Start connecting!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No new messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search attendees by name, organization, or interests..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="attendee">Attendees</SelectItem>
                  <SelectItem value="organizer">Organizers</SelectItem>
                  <SelectItem value="speaker">Speakers</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Interests</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Attendees Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendees.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No attendees found</p>
              <p className="text-sm text-muted-foreground">Check back later as more people check in to the event</p>
            </div>
          ) : (
            attendees.map((attendee) => (
              <Card key={attendee.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {attendee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{attendee.name}</h3>
                        <Badge variant={attendee.role === "organizer" ? "secondary" : "outline"}>{attendee.role}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {attendee.organization && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        {attendee.organization}
                      </div>
                    )}
                    {attendee.title && <p className="text-sm text-muted-foreground">{attendee.title}</p>}
                  </div>

                  {/* Mock networking interests */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {["Finance", "Agriculture"].map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
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
