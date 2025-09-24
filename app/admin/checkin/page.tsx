import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Clock } from "lucide-react"
import { getAllUsers } from "@/lib/db"
import UserTable from "./UserTable" // client component

export default async function CheckInPage() {
  const users = await getAllUsers()
  const totalUsers = users.length
  const checkedInUsers = users.filter((user) => user.checked_in).length

  return (
    <div className="min-h-screen bg-[#F9FAF9] dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#006600] mb-2">Check-in System</h1>
            <p className="text-[#C9A277]">View all attendees and their check-in status</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Registered */}
          <Card className="border-[#61CE70]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#006600]">Total Registered</CardTitle>
              <Users className="h-4 w-4 text-[#61CE70]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#006600]">{totalUsers}</div>
            </CardContent>
          </Card>

          {/* Checked In */}
          <Card className="border-[#006600]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#006600]">Checked In</CardTitle>
              <Clock className="h-4 w-4 text-[#61CE70]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#61CE70]">{checkedInUsers}</div>
              <p className="text-xs text-[#C9A277]">
                {totalUsers > 0 ? Math.round((checkedInUsers / totalUsers) * 100) : 0}% attendance
              </p>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="border-[#C9A277]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#006600]">Pending</CardTitle>
              <Clock className="h-4 w-4 text-[#C9A277]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#C9A277]">{totalUsers - checkedInUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#006600]">Attendees</CardTitle>
            <CardDescription className="text-[#C9A277]">
              Search by name or email and view check-in status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable users={users} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
