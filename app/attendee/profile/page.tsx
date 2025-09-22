"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Building, Phone, QrCode } from "lucide-react"
import Link from "next/link"

interface UserType {
  id: string
  name: string
  email: string
  role: string
  organization: string
  title: string
  phone: string
  qr_code: string
  checked_in: boolean
  check_in_time: string | null
  created_at: string
}

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const qrCode = searchParams.get("qr")
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!qrCode) {
      setError("No QR code provided.")
      setLoading(false)
      return
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users?qr=${qrCode}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data?.message || "Failed to fetch user")
        }
        const data = await res.json()
        setUser(data.user)
      } catch (err: any) {
        console.error("Error fetching user:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [qrCode])

  if (loading) return <p className="p-8 text-center text-gray-500">Loading profile...</p>
  if (error || !user) return <p className="p-8 text-center text-red-500">{error || "User not found."}</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Hero */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg rounded-xl transform transition hover:scale-105 duration-300">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
              <p className="text-indigo-100 mt-1">Here’s your profile and quick access to event features.</p>
            </div>
            <Link href={`/attendee/qr-code?qr=${user.qr_code}`}>
              <Card className="bg-white text-gray-800 px-4 py-3 shadow-md rounded-lg hover:scale-105 transition duration-300 cursor-pointer">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  View Your QR Code
                </div>
              </Card>
            </Link>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md rounded-xl hover:shadow-lg transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-indigo-500" />
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-indigo-500" />
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-indigo-500" />
                    <p className="font-medium">{user.organization}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-indigo-500" />
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {user.title}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    {user.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Event Status & Quick Actions */}
          <div className="space-y-6">
            <Card className="shadow-md rounded-xl hover:shadow-lg transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Event Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Registration</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Confirmed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Check-in</span>
                  {user.checked_in ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Checked In
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      Not Checked In
                    </Badge>
                  )}
                </div>
                {user.check_in_time && (
                  <p className="text-sm text-gray-500 mt-1">
                    Checked in at: {new Date(user.check_in_time).toLocaleString()}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span>Member Since</span>
                  <span className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/attendee/sessions">
                <Card className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 px-4 py-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                  Browse Sessions
                </Card>
              </Link>
              <Link href="/attendee/networking">
                <Card className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 px-4 py-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                  Find Connections
                </Card>
              </Link>
              <Link href={`/attendee/qr-code?qr=${user.qr_code}`}>
                <Card className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 px-4 py-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                  View QR Code
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
