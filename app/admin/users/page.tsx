"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Download, Upload, Mail } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string
  role: string
  organization?: string
  checked_in: boolean
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingQR, setSendingQR] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      console.log("response",response)
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendAllQRCodes = async () => {
    setSendingQR(true)
    try {
      const response = await fetch("/api/admin/users/send-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulk: true }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send QR codes",
        variant: "destructive",
      })
    } finally {
      setSendingQR(false)
    }
  }

  const handleSendQRCode = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users/send-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [userId] }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: "QR code sent successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send QR code",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage all registered users for the event</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link href="/admin/users/import">
                <Upload className="h-4 w-4 mr-2" />
                Import Users
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users/export">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              onClick={handleSendAllQRCodes}
              disabled={sendingQR || users.length === 0}
            >
              <Mail className="h-4 w-4 mr-2" />
              {sendingQR ? "Sending..." : "Send QR Codes to All"}
            </Button>
            <Button asChild>
              <Link href="/admin/users/new">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search users by name, email, or organization..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Users</Button>
                <Button variant="outline">Attendees</Button>
                <Button variant="outline">Organizers</Button>
                <Button variant="outline">Checked In</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
            <CardDescription>Complete list of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No users found</p>
                <Button asChild>
                  <Link href="/admin/users/import">Import Users</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.organization || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : user.role === "organizer" ? "secondary" : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.checked_in ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Checked In
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600 border-gray-300">
                            Not Checked In
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/admin/users/${user.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/users/${user.id}/edit`}>Edit User</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendQRCode(user.id)}>Send QR Code</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
