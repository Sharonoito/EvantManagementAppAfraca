// app/profile/ProfilePageClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Building,
  Phone,
  QrCode,
  Clock,
  MapPin,
  Users,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FindConnectionsCard } from "@/components/FindConnectionsCard";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  title: string;
  phone: string;
  qr_code: string;
  checked_in: boolean;
  check_in_time: string | null;
  created_at: string;
  consent_networking: boolean;
}

interface SessionType {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  registration_count: number;
  max_attendees: number | null;
  speaker_name: string;
}

export default function ProfilePageClient({ user, sessions }: { user: UserType; sessions: SessionType[] }) {
  const router = useRouter();
  const [showConsent, setShowConsent] = useState(false);
  const [isUpdatingConsent, setIsUpdatingConsent] = useState(false);

  const handleConsentConfirm = async () => {
    setIsUpdatingConsent(true);
    try {
      const res = await fetch("/api/update-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, consent: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update consent.");
      }

      setShowConsent(false);
      router.push(`/attendee/networking?userId=${user.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdatingConsent(false);
    }
  };

  const handleFindConnectionsClick = () => {
    if (user.consent_networking) {
      router.push(`/attendee/networking?userId=${user.id}`);
    } else {
      setShowConsent(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Column */}
      <aside className="w-96 bg-white dark:bg-gray-800 shadow-xl p-8 rounded-2xl m-6 space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-5xl font-bold text-gray-500">
            {user.name.charAt(0)}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.title}</p>
          </div>
        </div>

        <Card className="shadow-none border rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-[#C9A277]" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Building className="h-5 w-5 text-[#C9A277]" />
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium">{user.organization}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-[#C9A277]" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <User className="h-5 w-5 text-[#C9A277]" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Right Column */}
      <main className="flex-1 p-8">
        <div className="space-y-8">
          {/* Welcome + Event Status */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <Card className="flex-1 bg-gradient-to-r from-[#006600] to-[#61CE70] text-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <p className="text-xl font-semibold">Welcome, {user.name}!</p>
                <p className="text-sm text-green-100 mt-1">Here’s your profile at a glance.</p>
              </CardContent>
            </Card>
            <Card className="min-w-[250px] shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Event Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Registration</span>
                  <Badge variant="outline" className="text-[#006600] border-[#006600]">
                    Confirmed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Check-in</span>
                  {user.checked_in ? (
                    <Badge variant="outline" className="text-[#006600] border-[#006600]">
                      Checked In
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      Not Checked In
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/attendee/sessions">
              <Card className="bg-[#61CE70] text-white cursor-pointer shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                <CardContent className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                  <Mail className="h-6 w-6" />
                  <div className="font-semibold text-base">Browse Sessions</div>
                </CardContent>
              </Card>
            </Link>

            <FindConnectionsCard
              onFindConnectionsClick={handleFindConnectionsClick}
              hasConsent={user.consent_networking}
            />

            <Link href={`/attendee/qr-code?qr=${user.qr_code}`}>
              <Card className="bg-[#C9A277] text-white cursor-pointer shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                <CardContent className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                  <QrCode className="h-6 w-6" />
                  <div className="font-semibold text-base">View QR Code</div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Registered Sessions */}
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-8">My Registered Sessions</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="px-3 py-1 bg-gray-200 text-gray-800">
                {sessions.length} sessions
              </Badge>
            </div>

            {sessions.map((session) => (
              <Card key={session.id} className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold">{session.title}</h4>
                    <Link href={`/attendee/session/${session.id}`}>
                      <span className="text-sm text-blue-600 hover:underline">View Details</span>
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600">{session.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> 
                      {/* FIX: Include Date in the formatting */}
                      {new Date(session.start_time).toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
                      {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {session.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> {session.registration_count}/{session.max_attendees || "∞"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Speakers:</strong> {session.speaker_name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Consent Dialog */}
      <Dialog open={showConsent} onOpenChange={(open) => setShowConsent(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consent Required</DialogTitle>
            <DialogDescription>
              By continuing, you agree that your profile information (name, email, organization, etc.) will be visible to
              other attendees for networking purposes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setShowConsent(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleConsentConfirm}
              disabled={isUpdatingConsent}
            >
              {isUpdatingConsent ? "Processing..." : "I Agree & Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}