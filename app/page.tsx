import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, QrCode, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            8th World Congress on
            <span className="text-blue-600 dark:text-blue-400 block">Rural & Agricultural Finance</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-pretty">
            Join us for the premier global event connecting rural finance professionals, agricultural experts, and
            policy makers to shape the future of sustainable finance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/attendee">Attendee Portal</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CalendarDays className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Event Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive session scheduling, speaker management, and event coordination
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Attendee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>User registration, profile management, and networking features</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <QrCode className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>QR Check-in</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Seamless event check-in with QR codes and real-time attendance tracking</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Interactive Features</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Live Q&A, polls, feedback collection, and networking connections</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Event Info */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Event Information</CardTitle>
            <CardDescription>Key details about the congress</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Event Highlights</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Keynote speakers from leading financial institutions</li>
                <li>• Interactive workshops on sustainable agriculture</li>
                <li>• Networking sessions with industry experts</li>
                <li>• Policy discussions on rural development</li>
                <li>• Technology showcases and innovation demos</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Who Should Attend</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Rural finance professionals</li>
                <li>• Agricultural development experts</li>
                <li>• Policy makers and government officials</li>
                <li>• Fintech entrepreneurs and innovators</li>
                <li>• Academic researchers and students</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
