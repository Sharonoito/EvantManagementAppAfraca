import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Scan, Users, Clock } from "lucide-react"
import Link from "next/link"
import { getAllUsers } from "@/lib/db"
import { QRScanner } from "@/components/admin/qr-scanner"

export default async function CheckInPage() {
  const users = await getAllUsers()
  const totalUsers = users.length
  const checkedInUsers = users.filter((user) => user.checked_in).length
  const recentCheckIns = users
    .filter((user) => user.checked_in && user.check_in_time)
    .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime())
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Check-in System</h1>
            <p className="text-gray-600 dark:text-gray-300">QR code scanning and attendance tracking</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link href="/admin/checkin/manual">Manual Check-in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
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
                {totalUsers > 0 ? Math.round((checkedInUsers / totalUsers) * 100) : 0}% attendance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers - checkedInUsers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>Scan attendee QR codes for instant check-in</CardDescription>
            </CardHeader>
            <CardContent>
              <QRScanner />
            </CardContent>
          </Card>

          {/* Recent Check-ins */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Check-ins</CardTitle>
              <CardDescription>Latest attendees who checked in</CardDescription>
            </CardHeader>
            <CardContent>
              {recentCheckIns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No check-ins yet</p>
              ) : (
                <div className="space-y-4">
                  {recentCheckIns.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Checked In
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(user.check_in_time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
