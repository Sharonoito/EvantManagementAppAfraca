'use client'

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, Building, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { ChatDrawer } from "@/components/chat-drawer";

// Define the type for an attendee
interface Attendee {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  title: string;
  // Add other fields you need here
}

export default function NetworkingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // ✅ Get the userId from the URL parameters
  const currentUserId = searchParams.get("userId");

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttendees() {
      try {
        if (!currentUserId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Use an API route to fetch the attendees
        const res = await fetch(`/api/networking-attendees?userId=${currentUserId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch attendees.');
        }

        const data = await res.json();
        setAttendees(data.attendees);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendees();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {/* Use the light green color for the loader */}
        <Loader2 className="h-8 w-8 animate-spin text-[#61CE70]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gray-50 dark:bg-gray-900">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Networking
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with fellow congress attendees
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {/* Styled Button with Gold accent */}
            <Button
              asChild
              className="bg-[#C9A277] text-white hover:bg-opacity-90 transition-colors"
            >
              <Link href="/attendee/networking/connections">
                My Connections
              </Link>
            </Button>
            {/* Styled Button with Deep Green accent */}
            <Button
              asChild
              className="bg-[#006600] text-white hover:bg-opacity-90 transition-colors"
            >
              <Link href={`/attendee/profile?userId=${currentUserId}`}>
                Back to Portal
              </Link>
            </Button>
          </div>
        </div>

        {/* Removed: Stats Cards */}

        {/* Search and Filters */}
        <Card className="mb-6 border-[#61CE70] dark:border-[#006600]">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#006600] h-4 w-4" />
                <Input
                  placeholder="Search attendees by name, organization, or interests..."
                  className="pl-10 focus:border-[#61CE70]" // Highlight focus with light green
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48 focus:ring-[#61CE70]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="attendee">Attendees</SelectItem>
                  <SelectItem value="organizer">Organizers</SelectItem>
                  <SelectItem value="speaker">Speakers</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48 focus:ring-[#61CE70]">
                  <SelectValue placeholder="Filter by interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Interests</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Attendees Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendees.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-[#61CE70] mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No attendees found</p>
              <p className="text-sm text-muted-foreground">
                Check back later as more people check in to the event
              </p>
            </div>
          ) : (
            attendees.map((attendee) => (
              <Card
                key={attendee.id}
                className="hover:shadow-lg transition-shadow border-t-4 border-[#006600]" // Accent line with Deep Green
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#61CE70]/20 dark:bg-[#006600]/50 rounded-full flex items-center justify-center">
                        {/* Use Deep Green for the initial */}
                        <span className="text-[#006600] dark:text-[#61CE70] font-semibold">
                          {attendee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {attendee.name}
                        </h3>
                        {/* Style Badge using the theme colors */}
                        <Badge
                          variant={
                            attendee.role === "organizer"
                              ? "default" // Use primary button styles for default
                              : "outline"
                          }
                          className={
                            attendee.role === "organizer"
                              ? "bg-[#C9A277] hover:bg-[#C9A277]/90 text-white" // Gold for organizers
                              : "border-[#006600] text-[#006600] dark:border-[#61CE70] dark:text-[#61CE70]" // Deep Green outline
                          }
                        >
                          {attendee.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {attendee.organization && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4 text-[#006600]" />
                        {attendee.organization}
                      </div>
                    )}
                    {attendee.title && (
                      <p className="text-sm text-muted-foreground">
                        {attendee.title}
                      </p>
                    )}
                  </div>

                  {/* <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {["Finance", "Agriculture"].map((interest, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-[#61CE70] text-[#006600] dark:text-[#61CE70] bg-[#61CE70]/10" // Light Green accent
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div> */}

                  <div className="flex gap-2">
                    {/* Primary Button with Deep Green */}
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#006600] hover:bg-[#006600]/90 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <ChatDrawer
                      attendee={{ id: attendee.id, name: attendee.name }}
                      currentUser={{ id: currentUserId! }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}