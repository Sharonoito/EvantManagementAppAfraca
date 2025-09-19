// app/admin/events/sessions/new/page.jsx

import { getAllEvents } from "@/lib/db"; // Assuming this is your database function
import SessionForm from "./session-form"; // Import your client component

export default async function CreateSessionPage() {
    // This function runs on the server
    const events = await getAllEvents();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Pass the events data as a prop to the client component */}
            <SessionForm events={events} />
        </div>
    );
}





// // app/admin/events/sessions/new/page.jsx

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner"; // Assuming you have a toast notification library
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// // You will need to create this function to fetch events from your database
// // In a real application, you might call a Next.js API route instead
// // For demonstration, we'll use a placeholder function
// const fetchEvents = async () => {
//   // This is a placeholder. You need to implement your actual fetch logic.
//   // It should return an array of objects like { id: '...', title: '...' }
//   return [
//     { id: "event_1", title: "Future of AI Summit" },
//     { id: "event_2", title: "Cybersecurity Expo 2024" },
//   ];
// };

// export default function CreateSessionPage() {
//     const router = useRouter();
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [formData, setFormData] = useState({
//         eventId: "",
//         title: "",
//         description: "",
//         speakerName: "",
//         speakerBio: "",
//         startTime: "",
//         endTime: "",
//         location: "",
//         sessionType: "presentation",
//         maxAttendees: null,
//     });

//     // Fetch events when the component mounts
//     useEffect(() => {
//         const getEvents = async () => {
//             try {
//                 const fetchedEvents = await fetchEvents();
//                 setEvents(fetchedEvents);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Failed to fetch events:", error);
//                 toast.error("Could not load events. Please try again.");
//                 setLoading(false);
//             }
//         };
//         getEvents();
//     }, []);

//     const handleChange = (e) => {
//         const { id, value } = e.target;
//         setFormData((prev) => ({ ...prev, [id]: value }));
//     };

//     const handleSelectChange = (id, value) => {
//         setFormData((prev) => ({ ...prev, [id]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         try {
//             // NOTE: You'll need to create a Next.js API Route to handle this POST request.
//             // Example route: app/api/admin/sessions/route.js
//             const response = await fetch("/api/admin/sessions", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Failed to create session");
//             }

//             toast.success("Session created successfully!");
//             router.push("/admin/events/sessions"); // Redirect on success
//         } catch (error) {
//             console.error("Session creation failed:", error);
//             toast.error(error.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) {
//         return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-white">Loading...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex items-center gap-4 mb-8">
//                     <Button asChild variant="ghost" size="icon">
//                         <Link href="/admin/events/sessions">
//                             <ArrowLeft className="h-5 w-5" />
//                         </Link>
//                     </Button>
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Session</h1>
//                         <p className="text-gray-600 dark:text-gray-300">Fill out the details to create a new session.</p>
//                     </div>
//                 </div>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Session Details</CardTitle>
//                         <CardDescription>Enter the information for the new session.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {/* Event Association */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="eventId">Associated Event</Label>
//                                     <Select
//                                         onValueChange={(value) => handleSelectChange("eventId", value)}
//                                         value={formData.eventId}
//                                         required
//                                     >
//                                         <SelectTrigger id="eventId">
//                                             <SelectValue placeholder="Select an event" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {events.map((event) => (
//                                                 <SelectItem key={event.id} value={event.id}>
//                                                     {event.title}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 {/* Session Title */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="title">Session Title</Label>
//                                     <Input
//                                         id="title"
//                                         placeholder="E.g., Keynote on AI"
//                                         value={formData.title}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>

//                                 {/* Speaker Name */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="speakerName">Speaker Name</Label>
//                                     <Input
//                                         id="speakerName"
//                                         placeholder="E.g., Jane Doe"
//                                         value={formData.speakerName}
//                                         onChange={handleChange}
//                                     />
//                                 </div>

//                                 {/* Session Type */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="sessionType">Session Type</Label>
//                                     <Select
//                                         onValueChange={(value) => handleSelectChange("sessionType", value)}
//                                         value={formData.sessionType}
//                                         required
//                                     >
//                                         <SelectTrigger id="sessionType">
//                                             <SelectValue placeholder="Select session type" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="presentation">Presentation</SelectItem>
//                                             <SelectItem value="workshop">Workshop</SelectItem>
//                                             <SelectItem value="panel">Panel</SelectItem>
//                                             <SelectItem value="networking">Networking</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                                 {/* Start Time */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="startTime">Start Time</Label>
//                                     <Input
//                                         id="startTime"
//                                         type="datetime-local"
//                                         value={formData.startTime}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 {/* End Time */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="endTime">End Time</Label>
//                                     <Input
//                                         id="endTime"
//                                         type="datetime-local"
//                                         value={formData.endTime}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 {/* Location */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="location">Location</Label>
//                                     <Input
//                                         id="location"
//                                         placeholder="E.g., Main Hall"
//                                         value={formData.location}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 {/* Max Attendees */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="maxAttendees">Max Attendees</Label>
//                                     <Input
//                                         id="maxAttendees"
//                                         type="number"
//                                         placeholder="Optional"
//                                         value={formData.maxAttendees || ""}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                             </div>
//                             {/* Description */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="description">Description</Label>
//                                 <Textarea
//                                     id="description"
//                                     placeholder="Provide a brief description of the session"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     rows={4}
//                                     required
//                                 />
//                             </div>
//                             {/* Speaker Bio */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="speakerBio">Speaker Bio</Label>
//                                 <Textarea
//                                     id="speakerBio"
//                                     placeholder="Provide a brief bio for the speaker"
//                                     value={formData.speakerBio}
//                                     onChange={handleChange}
//                                     rows={3}
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-2">
//                                 <Button type="submit" disabled={isSubmitting}>
//                                     {isSubmitting ? "Creating..." : "Create Session"}
//                                 </Button>
//                                 <Button asChild variant="outline">
//                                     <Link href="/admin/events/sessions">Cancel</Link>
//                                 </Button>
//                             </div>
//                         </form>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }