// app/admin/events/sessions/new/session-form.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // Assuming you have a toast notification library
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SessionForm({ events }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        eventId: "",
        title: "",
        description: "",
        speakerName: "",
        speakerBio: "",
        startTime: "",
        endTime: "",
        location: "",
        sessionType: "presentation",
        maxAttendees: null,
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value) => {
        setFormData((prev) => ({ ...prev, eventId: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create session");
            }

            toast.success("Session created successfully!");
            router.push("/admin/events/sessions");
        } catch (error) {
            console.error("Session creation failed:", error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Button asChild variant="ghost" size="icon">
                    <Link href="/admin/events/sessions">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Session</h1>
                    <p className="text-gray-600 dark:text-gray-300">Fill out the details to create a new session.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Session Details</CardTitle>
                    <CardDescription>Enter the information for the new session.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Association */}
                            <div className="space-y-2">
                                <Label htmlFor="eventId">Associated Event</Label>
                                <Select
                                    onValueChange={handleSelectChange}
                                    value={formData.eventId}
                                    required
                                >
                                    <SelectTrigger id="eventId">
                                        <SelectValue placeholder="Select an event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map((event) => (
                                            <SelectItem key={event.id} value={event.id}>
                                                {event.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Session Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Session Title</Label>
                                <Input
                                    id="title"
                                    placeholder="E.g., Keynote on AI"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Speaker Name */}
                            <div className="space-y-2">
                                <Label htmlFor="speakerName">Speaker Name</Label>
                                <Input
                                    id="speakerName"
                                    placeholder="E.g., Jane Doe"
                                    value={formData.speakerName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Session Type */}
                            <div className="space-y-2">
                                <Label htmlFor="sessionType">Session Type</Label>
                                <Select
                                    onValueChange={(value) => handleSelectChange(value, 'sessionType')}
                                    value={formData.sessionType}
                                    required
                                >
                                    <SelectTrigger id="sessionType">
                                        <SelectValue placeholder="Select session type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="presentation">Presentation</SelectItem>
                                        <SelectItem value="workshop">Workshop</SelectItem>
                                        <SelectItem value="panel">Panel</SelectItem>
                                        <SelectItem value="networking">Networking</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Start Time */}
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* End Time */}
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="E.g., Main Hall"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Max Attendees */}
                            <div className="space-y-2">
                                <Label htmlFor="maxAttendees">Max Attendees</Label>
                                <Input
                                    id="maxAttendees"
                                    type="number"
                                    placeholder="Optional"
                                    value={formData.maxAttendees || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Provide a brief description of the session"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                required
                            />
                        </div>
                        {/* Speaker Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="speakerBio">Speaker Bio</Label>
                            <Textarea
                                id="speakerBio"
                                placeholder="Provide a brief bio for the speaker"
                                value={formData.speakerBio}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Session"}
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/admin/events/sessions">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}