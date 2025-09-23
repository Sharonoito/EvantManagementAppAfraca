import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, QrCode, MessageSquare } from "lucide-react"
import Link from "next/link"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FFF8] to-[#FFFDF8] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance drop-shadow-lg">
            8th World Congress on
            <span className="text-[#006600] dark:text-[#61CE70] block animate-gradientText">
              Rural & Agricultural Finance
            </span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-pretty">
            Join us for the premier global event connecting rural finance professionals, agricultural experts, and
            policy makers to shape the future of sustainable finance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-[#006600] hover:bg-[#61CE70] text-white rounded-xl shadow-lg shadow-[#006600]/40 hover:scale-105 transition-transform duration-300"
            >
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 border-2 border-[#C9A277] text-[#C9A277] hover:bg-[#C9A277] hover:text-white rounded-xl shadow-md hover:shadow-[#C9A277]/50 hover:scale-105 transition-transform duration-300"
            >
              <Link href="/attendee/profile">Attendee Portal</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fadeIn delay-200">
          <Card className="text-center rounded-2xl border-2 border-[#C9A277]/30 shadow-md hover:shadow-xl hover:shadow-[#006600]/40 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CalendarDays className="h-12 w-12 text-[#006600] mx-auto mb-4 animate-bounceSlow" />
              <CardTitle className="font-extrabold text-xl tracking-wide text-[#006600]">
                Event Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 italic">
                Comprehensive session scheduling, speaker management, and event coordination
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center rounded-2xl border-2 border-[#61CE70]/30 shadow-md hover:shadow-xl hover:shadow-[#61CE70]/50 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-[#61CE70] mx-auto mb-4 animate-bounceSlow" />
              <CardTitle className="font-extrabold text-xl tracking-wide text-[#61CE70]">
                Attendee Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 italic">
                User registration, profile management, and networking features
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center rounded-2xl border-2 border-[#C9A277]/40 shadow-md hover:shadow-xl hover:shadow-[#C9A277]/60 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <QrCode className="h-12 w-12 text-[#C9A277] mx-auto mb-4 animate-bounceSlow" />
              <CardTitle className="font-extrabold text-xl tracking-wide text-[#C9A277]">
                QR Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 italic">
                Seamless event check-in with QR codes and real-time attendance tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center rounded-2xl border-2 border-[#006600]/30 shadow-md hover:shadow-xl hover:shadow-[#61CE70]/40 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-[#006600] mx-auto mb-4 animate-bounceSlow" />
              <CardTitle className="font-extrabold text-xl tracking-wide text-[#006600]">
                Interactive Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 italic">
                Live Q&amp;A, polls, feedback collection, and networking connections
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Event Info */}
        <Card className="max-w-4xl mx-auto border-2 border-[#61CE70]/30 rounded-2xl shadow-lg hover:shadow-[#61CE70]/50 hover:scale-[1.02] transition-all duration-300 animate-fadeIn delay-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#006600] font-bold">Event Information</CardTitle>
            <CardDescription className="text-[#C9A277]">Key details about the congress</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-[#006600]">Event Highlights</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Keynote speakers from leading financial institutions</li>
                <li>• Interactive workshops on sustainable agriculture</li>
                <li>• Networking sessions with industry experts</li>
                <li>• Policy discussions on rural development</li>
                <li>• Technology showcases and innovation demos</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-[#006600]">Who Should Attend</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
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



