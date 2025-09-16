import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Building, Phone, Edit, QrCode } from "lucide-react"
import Link from "next/link"

// This would normally get the user from session/auth
const mockUser = {
  id: "user_123",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "attendee",
  organization: "ABC Corporation",
  title: "Senior Manager",
  phone: "+1 (555) 123-4567",
  dietary_restrictions: "Vegetarian",
  accessibility_needs: "None",
  networking_interests: ["Finance", "Technology", "Agriculture"],
  qr_code: "EVENT_user_123_1234567890",
  checked_in: false,
  check_in_time: null,
  created_at: "2024-01-15T10:00:00Z",
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-300">View and manage your congress profile</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link href="/attendee/qr-code">
                <QrCode className="h-4 w-4 mr-2" />
                View QR Code
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/attendee">Back to Portal</Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Basic Information</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <CardDescription>Your personal and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{mockUser.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{mockUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Organization</p>
                      <p className="font-medium">{mockUser.organization}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{mockUser.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Job Title</p>
                  <p className="font-medium">{mockUser.title}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <Badge variant={mockUser.role === "admin" ? "default" : "outline"}>{mockUser.role}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences & Requirements</CardTitle>
                <CardDescription>Your dietary and accessibility preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dietary Restrictions</p>
                  <p className="font-medium">{mockUser.dietary_restrictions || "None specified"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Accessibility Needs</p>
                  <p className="font-medium">{mockUser.accessibility_needs || "None specified"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Networking Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {mockUser.networking_interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Check-in Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Registration</p>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Confirmed
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Check-in Status</p>
                  {mockUser.checked_in ? (
                    <div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Checked In
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {mockUser.check_in_time && new Date(mockUser.check_in_time).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-gray-600 border-gray-300">
                      Not Checked In
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <p className="text-sm">{new Date(mockUser.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/attendee/sessions">Browse Sessions</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/attendee/networking">Find Connections</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/attendee/qr-code">View QR Code</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
