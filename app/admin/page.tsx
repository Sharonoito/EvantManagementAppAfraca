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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              8th World Congress on Rural & Agricultural Finance
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild className="transition-transform hover:scale-105">
              <Link href="/admin/users/import">Import Users</Link>
            </Button>
            <Button asChild variant="outline" className="transition-transform hover:scale-105">
              <Link href="/admin/settings">Settings</Link>
            </Button>
          </div>
        </div>

        {/* Email Test Section */}
        <Card className="mb-10 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">📧 Email Configuration Test</CardTitle>
            <CardDescription>Ensure QR codes can be sent successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <TestEmailButton />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="hover:scale-105 transform transition duration-300 ease-in-out shadow-md hover:shadow-2xl rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{totalUsers}</div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {attendees} attendees, {organizers} organizers
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transform transition duration-300 ease-in-out shadow-md hover:shadow-2xl rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
              <QrCode className="h-5 w-5 text-purple-700 dark:text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800 dark:text-purple-200">{checkedInUsers}</div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                {totalUsers > 0 ? Math.round((checkedInUsers / totalUsers) * 100) : 0}% attendance rate
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transform transition duration-300 ease-in-out shadow-md hover:shadow-2xl rounded-2xl bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Calendar className="h-5 w-5 text-green-700 dark:text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800 dark:text-green-200">0</div>
              <p className="text-xs text-green-700 dark:text-green-300">No sessions scheduled yet</p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transform transition duration-300 ease-in-out shadow-md hover:shadow-2xl rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Q&A Questions</CardTitle>
              <MessageSquare className="h-5 w-5 text-orange-700 dark:text-orange-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800 dark:text-orange-200">0</div>
              <p className="text-xs text-orange-700 dark:text-orange-300">No questions submitted yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { href: "/admin/users", title: "User Management", icon: <Users className="h-5 w-5 text-blue-600" />, desc: "View, edit, and manage users", bg: "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800" },
            { href: "/admin/events", title: "Event Management", icon: <Calendar className="h-5 w-5 text-green-600" />, desc: "Create and manage events", bg: "from-green-50 to-green-100 dark:from-green-900 dark:to-green-800" },
            { href: "/admin/checkin", title: "Check-in System", icon: <QrCode className="h-5 w-5 text-purple-600" />, desc: "QR code scanning and tracking", bg: "from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800" },
            { href: "/admin/analytics", title: "Analytics", icon: <BarChart3 className="h-5 w-5 text-orange-600" />, desc: "Attendance & engagement insights", bg: "from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800" },
            { href: "/admin/qa", title: "Q&A Management", icon: <MessageSquare className="h-5 w-5 text-red-600" />, desc: "Moderate questions and polls", bg: "from-red-50 to-red-100 dark:from-red-900 dark:to-red-800" },
            { href: "/admin/settings", title: "Settings", icon: <Settings className="h-5 w-5 text-gray-600" />, desc: "Configure event preferences", bg: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700" },
          ].map((action, i) => (
            <Card
              key={i}
              className={`hover:scale-105 transform transition duration-300 ease-in-out shadow-md hover:shadow-2xl rounded-2xl cursor-pointer bg-gradient-to-br ${action.bg}`}
            >
              <Link href={action.href}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-semibold text-lg">
                    {action.icon} {action.title}
                  </CardTitle>
                  <CardDescription>{action.desc}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>

        {/* Recent Users */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-2xl bg-gradient-to-r from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Registrations</CardTitle>
            <CardDescription>Latest users who registered for the event</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No users registered yet. Import users or wait for registrations.
              </p>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
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
                    <Button asChild variant="outline" className="transition-transform hover:scale-105">
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
