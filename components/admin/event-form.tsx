"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface EventFormData {
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  max_attendees: string
  registration_deadline: string
  status: string
}

export function EventForm({ event }: { event?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || "",
    description: event?.description || "",
    start_date: event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : "",
    end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
    location: event?.location || "",
    max_attendees: event?.max_attendees?.toString() || "",
    registration_deadline: event?.registration_deadline
      ? new Date(event.registration_deadline).toISOString().slice(0, 16)
      : "",
    status: event?.status || "draft",
  })

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await fetch(event ? `/api/admin/events/${event.id}` : "/api/admin/events", {
        method: event ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          max_attendees: formData.max_attendees ? Number.parseInt(formData.max_attendees) : null,
        }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setTimeout(() => {
          router.push("/admin/events")
        }, 1500)
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to save event. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="8th World Congress on Rural & Agricultural Finance"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe your event..."
            rows={4}
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Start Date & Time *
          </Label>
          <Input
            id="start_date"
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            End Date & Time *
          </Label>
          <Input
            id="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Location and Capacity */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Conference Center, City"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_attendees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Max Attendees
          </Label>
          <Input
            id="max_attendees"
            type="number"
            value={formData.max_attendees}
            onChange={(e) => handleChange("max_attendees", e.target.value)}
            placeholder="500"
            min="1"
          />
        </div>
      </div>

      {/* Registration and Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registration_deadline">Registration Deadline</Label>
          <Input
            id="registration_deadline"
            type="datetime-local"
            value={formData.registration_deadline}
            onChange={(e) => handleChange("registration_deadline", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Alert
          className={
            result.success
              ? "border-green-200 bg-green-50 dark:bg-green-950"
              : "border-red-200 bg-red-50 dark:bg-red-950"
          }
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            <p className="font-medium">{result.message}</p>
            {result.success && <p className="text-sm mt-1">Redirecting to events list...</p>}
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}
