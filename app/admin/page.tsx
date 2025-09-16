import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, QrCode, MessageSquare, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { getAllUsers } from "@/lib/db"
import { TestEmailButton } from "@/components/admin/test-email-button"

export default async function AdminDashboard() {
  const users = await getAllUsers()
  const totalUsers = users.length
  const checkedInUsers = users.filter((user) => user.checked_in).length
  const attendees = users.filter((user) => user.role === "attendee").length
  const organizers = users.filter((user) => user.role === "organizer").length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">8th World Congress on Rural & Agricultural Finance</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild>
              <Link href="/admin/users/import">Import Users</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/settings">Settings</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Email Configuration Test</CardTitle>
            <CardDescription>Test your email configuration to ensure QR codes can be sent</CardDescription>
          </CardHeader>
          <CardContent>
            <TestEmailButton />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {attendees} attendees, {organizers} organizers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{checkedInUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalUsers > 0 ? Math.round((checkedInUsers / totalUsers) * 100) : 0}% attendance rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No sessions scheduled yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Q&A Questions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No questions submitted yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/users">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  User Management
                </CardTitle>
                <CardDescription>View, edit, and manage all registered users</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/events">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Event Management
                </CardTitle>
                <CardDescription>Create and manage events and sessions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/checkin">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  Check-in System
                </CardTitle>
                <CardDescription>QR code scanning and attendance tracking</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/analytics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  Analytics
                </CardTitle>
                <CardDescription>View attendance and engagement metrics</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/qa">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-red-600" />
                  Q&A Management
                </CardTitle>
                <CardDescription>Moderate questions and manage polls</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Settings
                </CardTitle>
                <CardDescription>Configure event settings and preferences</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>Latest users who registered for the event</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No users registered yet. Import users or wait for registrations.
              </p>
            ) : (
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.organization && <p className="text-xs text-muted-foreground">{user.organization}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : user.role === "organizer" ? "secondary" : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                      {user.checked_in && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Checked In
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {users.length > 5 && (
                  <div className="text-center pt-4">
                    <Button asChild variant="outline">
                      <Link href="/admin/users">View All Users ({users.length})</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
