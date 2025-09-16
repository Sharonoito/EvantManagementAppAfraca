import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EventForm } from "@/components/admin/event-form"

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Event</h1>
            <p className="text-gray-600 dark:text-gray-300">Set up a new event with sessions and details</p>
          </div>
        </div>

        {/* Event Form */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Fill in the information for your new event</CardDescription>
            </CardHeader>
            <CardContent>
              <EventForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
