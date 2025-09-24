// /app/attendee/sessions/page.tsx
export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { getAllEvents, getEventSessions } from "@/lib/db"

// TODO: You might later pass eventId via params or context.
// For now, we’ll just grab the first event.
const DEFAULT_EVENT_ID = process.env.NEXT_PUBLIC_DEFAULT_EVENT_ID || ""

export default async function SchedulePage() {
  try {
    // 1. Get event (latest or default)
    const events = await getAllEvents()
    const event = events.find((e: any) => e.id === DEFAULT_EVENT_ID) || events[0]

    // 2. Get sessions for that event
    const sessions = await getEventSessions(event.id)

    // 3. Transform sessions -> add session_date for grouping
    const sessionsWithDate = sessions.map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      speaker: s.speaker_name || "",
      session_date: new Date(s.start_time).toISOString().split("T")[0],
      start_time: new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      end_time: new Date(s.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: s.location,
      max_capacity: s.max_attendees,
      registered_count: Number(s.registration_count || 0),
      is_registered: false, // TODO: tie this to actual attendee registration
    }))

    // 4. Group sessions by date
    const sessionsByDate = sessionsWithDate.reduce((acc: any, session: any) => {
      if (!acc[session.session_date]) acc[session.session_date] = []
      acc[session.session_date].push(session)
      return acc
    }, {})

    const eventDates = Object.keys(sessionsByDate).sort()

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-green-700 hover:text-green-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Event Schedule</h1>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/networking">
                  <Button variant="ghost" className="text-green-700 hover:text-green-800">
                    Networking
                  </Button>
                </Link>
                <Link href="/qa">
                  <Button variant="ghost" className="text-green-700 hover:text-green-800">
                    Q&A
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Event Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{event?.title}</h2>
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>
                  {event && (
                    <>
                      {new Date(event.start_date).toLocaleDateString()} -{" "}
                      {new Date(event.end_date).toLocaleDateString()}
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-yellow-600" />
                <span>{event?.location}</span>
              </div>
            </div>
          </div>

          {/* Schedule Tabs */}
          <Tabs defaultValue={eventDates[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-yellow-100">
              {eventDates.map((date, index) => (
                <TabsTrigger
                  key={date}
                  value={date}
                  className="flex flex-col data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <span className="font-medium">Day {index + 1}</span>
                  <span className="text-xs">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {eventDates.map((date) => (
              <TabsContent key={date} value={date}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <Badge variant="outline" className="border-green-600 text-green-700">
                      {sessionsByDate[date].length} sessions
                    </Badge>
                  </div>

                  <div className="grid gap-6">
                    {sessionsByDate[date].map((session: any) => {
                      const isFull =
                        session.max_capacity &&
                        session.registered_count >= session.max_capacity
                      const isPast =
                        new Date(`${session.session_date}T${session.end_time}`) < new Date()
                      const isRegistered = session.is_registered

                      return (
                        <Card
                          key={session.id}
                          className="hover:shadow-lg border-green-200 transition-shadow"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2 text-green-800">
                                  {session.title}
                                </CardTitle>
                                <CardDescription className="text-base mb-3">
                                  {session.description}
                                </CardDescription>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    <span>
                                      {session.start_time} - {session.end_time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-green-600" />
                                    <span>{session.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-yellow-600" />
                                    <span>
                                      {session.registered_count}/{session.max_capacity || "∞"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {session.speaker && (
                                  <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                                    {session.speaker}
                                  </Badge>
                                )}

                                {isRegistered && (
                                  <Badge className="bg-green-600 text-white">Registered</Badge>
                                )}

                                {isFull && !isRegistered && (
                                  <Badge className="bg-red-500 text-white">Full</Badge>
                                )}

                                {!isRegistered && !isFull && !isPast && (
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                    Register
                                  </Button>
                                )}
                                {isPast && (
                                  <Badge variant="outline" className="text-gray-400">
                                    Past Session
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <div className="px-6 pb-6 pt-0 text-sm text-gray-700">
                            <p>Speakers: {session.speaker}</p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Schedule page error:", error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              There was an error loading the schedule. Please try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }
}



// // /app/attendee/sessions/page.tsx

// export const dynamic = "force-dynamic";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
// import Link from "next/link";
// // The following line is commented out to prevent a "Module not found" error
// // import { SessionRegistrationButton } from "@/components/session-registration-button";


// // For demo purposes, we'll use a hardcoded user ID
// const DEMO_USER_ID = "demo-user-123";

// // ---------------------------------------------
// // MOCK DATA
// // ---------------------------------------------

// // MOCK DATA for 8th World Congress
// const mockEvent = {
//   id: 8,
//   name: "8th World Congress in Rural and Agricultural Finance",
//   theme: "Building Resilient Local Agrifood Systems : The Role of Robust Financing Mechanism and Policy",
//   start_date: "2025-10-27",
//   end_date: "2025-10-31",
//   location: "Sarova Whitesands Beach Resort & Spa, Mombasa, Kenya",
// };

// // Sessions extracted from the preliminary agenda
// const mockSessions = [
//   // Pre-Congress: 27th Oct
//   {
//     id: 1,
//     title: "AFRACA Policy Dissemination Session",
//     description:
//       "Insights into Central Bank Policies on Rural and Agricultural Finance: The Case of AFRACA Members",
//     speaker: "Yaw Brantuo (Moderator), Panelists from Central Banks",
//     session_date: "2025-10-27",
//     start_time: "10:00",
//     end_time: "11:30",
//     location: "Main Hall",
//     max_capacity: 300,
//     registered_count: 150,
//     is_registered: false,
//   },
//   {
//     id: 2,
//     title: "Knowledge Exchange & Special Report Presentation",
//     description:
//       "Presentation of the Special Report on Financing Agrifood Systems Transformation.",
//     speaker: "Ezra Anyango (Moderator) + Panelists from FAO, CPI, Shamba Centre",
//     session_date: "2025-10-27",
//     start_time: "11:45",
//     end_time: "12:45",
//     location: "Main Hall",
//     max_capacity: 300,
//     registered_count: 120,
//     is_registered: false,
//   },
//   {
//     id: 3,
//     title: "Unlocking Public Development Bank Investment",
//     description:
//       "Investment towards more Inclusive Food Systems for youth and women with global case studies.",
//     speaker: "AgriPDB Platform / IFAD",
//     session_date: "2025-10-27",
//     start_time: "13:45",
//     end_time: "14:45",
//     location: "Main Hall",
//     max_capacity: 250,
//     registered_count: 200,
//     is_registered: true,
//   },
//   {
//     id: 4,
//     title: "23rd AFRACA General Assembly",
//     description: "Annual General Assembly for AFRACA Members.",
//     speaker: "AFRACA",
//     session_date: "2025-10-27",
//     start_time: "16:00",
//     end_time: "19:00",
//     location: "Main Auditorium",
//     max_capacity: 400,
//     registered_count: 380,
//     is_registered: false,
//   },

//   // Day 2: 28th Oct
//   {
//     id: 5,
//     title: "Executive Breakfast: Masterclass on AI in Rural and Agricultural Finance",
//     description:
//       "Exclusive masterclass on Artificial Intelligence in Rural and Agricultural Finance.",
//     speaker: "AFRACA / Pathways Technologies",
//     session_date: "2025-10-28",
//     start_time: "08:00",
//     end_time: "10:00",
//     location: "VIP Lounge",
//     max_capacity: 80,
//     registered_count: 80,
//     is_registered: false,
//   },
//   {
//     id: 6,
//     title: "Climate Intelligence Tools for Finance",
//     description: "Showcasing innovative climate intelligence tools.",
//     speaker: "Alliance for Bioversity & CIAT",
//     session_date: "2025-10-28",
//     start_time: "10:30",
//     end_time: "11:10",
//     location: "Room 101",
//     max_capacity: 150,
//     registered_count: 75,
//     is_registered: false,
//   },
//   {
//     id: 7,
//     title: "Catalysing Rural Resilience: Agri-SME Financing",
//     description:
//       "Financing Innovations for Agri-SMEs through Local Institutions.",
//     speaker: "Small Foundation + ARIA + Vista Bank Sierra Leone",
//     session_date: "2025-10-28",
//     start_time: "11:10",
//     end_time: "12:00",
//     location: "Main Hall",
//     max_capacity: 200,
//     registered_count: 150,
//     is_registered: true,
//   },
//   {
//     id: 8,
//     title: "The Role of Digital Lenders in Agribusiness Value Chains",
//     description:
//       "Exploring digital lending innovations across Africa for agribusiness financing.",
//     speaker: "Small Foundation / Emerald Africa + Panellists",
//     session_date: "2025-10-28",
//     start_time: "12:10",
//     end_time: "13:10",
//     location: "Main Auditorium",
//     max_capacity: 220,
//     registered_count: 180,
//     is_registered: false,
//   },

//   // Day 3: 29th Oct
//   {
//     id: 9,
//     title: "Opening Session",
//     description:
//       "Keynote speeches, ministerial addresses, and official opening of the Congress.",
//     speaker:
//       "Thomas Essel, Dieudonne Fikiri Alimasi, Dr. Kamau Thugge, Hon. Mutahi Kagwe + IFAD & FAO",
//     session_date: "2025-10-29",
//     start_time: "09:15",
//     end_time: "10:30",
//     location: "Main Auditorium",
//     max_capacity: 500,
//     registered_count: 400,
//     is_registered: true,
//   },
//   {
//     id: 10,
//     title: "Global Session 1: Regional Perspectives on Financing Mechanisms",
//     description:
//       "Global experts share regional insights on integrating finance into food systems pathways.",
//     speaker: "FAO/UNDP, AFRACA, ALIDE, APRACA, CICA",
//     session_date: "2025-10-29",
//     start_time: "11:00",
//     end_time: "13:00",
//     location: "Main Hall",
//     max_capacity: 400,
//     registered_count: 250,
//     is_registered: false,
//   },
//   {
//     id: 11,
//     title: "Business Session 1 (AFRACA): Inclusive Financing Models",
//     description:
//       "Maximizing transformative policies and models for resilient agri-food systems in Africa.",
//     speaker: "AFRACA + Co-operative Bank of Kenya + Credit Agricole du Maroc",
//     session_date: "2025-10-29",
//     start_time: "14:00",
//     end_time: "15:45",
//     location: "Main Hall",
//     max_capacity: 300,
//     registered_count: 260,
//     is_registered: false,
//   },

//   // Day 4: 30th Oct
//   {
//     id: 12,
//     title: "Business Session 2 (APRACA): Leveraging Green Finance",
//     description:
//       "Accelerating sustainable agri-food systems in Asia and the Pacific.",
//     speaker: "APRACA + Panelists from Thailand, India, Cambodia, Nepal, Philippines, Indonesia",
//     session_date: "2025-10-30",
//     start_time: "09:00",
//     end_time: "10:45",
//     location: "Main Hall",
//     max_capacity: 350,
//     registered_count: 310,
//     is_registered: true,
//   },
//   {
//     id: 13,
//     title: "Business Session 3 (ALIDE): Building Resilient Agrifood Systems",
//     description:
//       "Latin American institutions share mechanisms to strengthen agri-food financing.",
//     speaker: "ALIDE + Banco de México + Agrobanco Peru + Finagro Colombia",
//     session_date: "2025-10-30",
//     start_time: "11:15",
//     end_time: "13:00",
//     location: "Main Hall",
//     max_capacity: 300,
//     registered_count: 250,
//     is_registered: false,
//   },
//   {
//     id: 14,
//     title: "Global Session 2: Policy Enablers for Financing Agri-food Systems",
//     description:
//       "Global policy enablers and frameworks to strengthen national food system pathways.",
//     speaker: "AFRACA + FAO + IFAD + AGRA + UNDP",
//     session_date: "2025-10-30",
//     start_time: "14:45",
//     end_time: "15:45",
//     location: "Main Auditorium",
//     max_capacity: 400,
//     registered_count: 200,
//     is_registered: false,
//   },

//   // Day 5: 31st Oct
//   {
//     id: 15,
//     title: "Wildlife Safari / Mombasa City Tour",
//     description:
//       "Full-day excursion for delegates: Tsavo National Park Safari or Mombasa City Tour.",
//     speaker: "AFRACA Organizing Committee",
//     session_date: "2025-10-31",
//     start_time: "06:30",
//     end_time: "21:30",
//     location: "Tsavo National Park / Mombasa",
//     max_capacity: null,
//     registered_count: 100,
//     is_registered: false,
//   },
// ];

// // ---------------------------------------------
// // END MOCK DATA
// // ---------------------------------------------


// export default async function SchedulePage() {
//   try {
//     // Replace DB calls with mock data
//     const event = mockEvent;
//     const sessions = mockSessions;

//     // Group sessions by date
//     const sessionsByDate = sessions.reduce((acc, session) => {
//       const date = session.session_date;
//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(session);
//       return acc;
//     }, {});

//     const eventDates = Object.keys(sessionsByDate).sort();

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center h-16">
//               <div className="flex items-center gap-4">
//                 <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Dashboard
//                 </Link>
//                 <h1 className="text-2xl font-bold text-gray-900">Event Schedule</h1>
//               </div>
//               <div className="flex items-center gap-4">
//                 <Link href="/networking">
//                   <Button variant="ghost">Networking</Button>
//                 </Link>
//                 <Link href="/qa">
//                   <Button variant="ghost">Q&A</Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Event Header */}
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">{event?.name}</h2>
//             <div className="flex items-center gap-6 text-gray-600">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5" />
//                 <span>
//                   {event && (
//                     <>
//                       {new Date(event.start_date).toLocaleDateString()} -{" "}
//                       {new Date(event.end_date).toLocaleDateString()}
//                     </>
//                   )}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-5 w-5" />
//                 <span>{event?.location}</span>
//               </div>
//             </div>
//           </div>

//           {/* Schedule Tabs */}
//           <Tabs defaultValue={eventDates[0]} className="w-full">
//             <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-200">
//               {eventDates.map((date, index) => (
//                 <TabsTrigger key={date} value={date} className="flex flex-col data-[state=active]:bg-blue-600 data-[state=active]:text-white">
//                   <span className="font-medium">Day {index + 1}</span>
//                   <span className="text-xs">
//                     {new Date(date).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </span>
//                 </TabsTrigger>
//               ))}
//             </TabsList>

//             {eventDates.map((date) => (
//               <TabsContent key={date} value={date}>
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       {new Date(date).toLocaleDateString("en-US", {
//                         weekday: "long",
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })}
//                     </h3>
//                     <Badge variant="outline">{sessionsByDate[date].length} sessions</Badge>
//                   </div>

//                   <div className="grid gap-6">
//                     {sessionsByDate[date].map((session) => {
//                       const isFull = session.max_capacity && session.registered_count >= session.max_capacity;
//                       const isPast = new Date(`${session.session_date}T${session.end_time}:00Z`) < new Date();
//                       const isRegistered = session.is_registered;

//                       return (
//                         <Card key={session.id} className="hover:shadow-lg transition-shadow">
//                           <CardHeader>
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <CardTitle className="text-xl mb-2">{session.title}</CardTitle>
//                                 <CardDescription className="text-base mb-3">{session.description}</CardDescription>
//                                 <div className="flex items-center gap-4 text-sm text-gray-600">
//                                   <div className="flex items-center gap-1">
//                                     <Clock className="h-4 w-4" />
//                                     <span>
//                                       {session.start_time} - {session.end_time}
//                                     </span>
//                                   </div>
//                                   <div className="flex items-center gap-1">
//                                     <MapPin className="h-4 w-4" />
//                                     <span>{session.location}</span>
//                                   </div>
//                                   <div className="flex items-center gap-1">
//                                     <Users className="h-4 w-4" />
//                                     <span>
//                                       {session.registered_count}/{session.max_capacity || "∞"}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="flex flex-col items-end gap-2">
//                                 {session.speaker && <Badge variant="secondary">{session.speaker}</Badge>}
                                
//                                 {isRegistered && (
//                                   <Badge className="bg-blue-600 text-white hover:bg-blue-600">
//                                     Registered
//                                   </Badge>
//                                 )}
                                
//                                 {isFull && !isRegistered && (
//                                   <Badge className="bg-red-500 text-white hover:bg-red-500">
//                                     Full
//                                   </Badge>
//                                 )}

//                                 {!isRegistered && !isFull && !isPast && (
//                                   <Button size="sm" className="bg-green-500 hover:bg-green-600">
//                                     Register
//                                   </Button>
//                                 )}
//                                 {isPast && (
//                                     <Badge variant="outline" className="text-gray-400">Past Session</Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </CardHeader>
//                           <div className="px-6 pb-6 pt-0 text-sm text-gray-700">
//                              <p>**Speakers:** {session.speaker}</p>
//                           </div>
//                         </Card>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>

//           {/* Legend */}
//           <Card className="mt-8">
//             <CardHeader>
//               <CardTitle>Schedule Legend</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span>Available (Register)</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
//                   <span>Registered</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                   <span>Full</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//                   <span>Past Session</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </main>
//       </div>
//     );
//   } catch (error) {
//     // Since we're using mock data, this block won't be reached
//     console.error("Schedule page error:", error);
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
//         <Card className="max-w-md w-full">
//           <CardHeader>
//             <CardTitle className="text-red-600">Error</CardTitle>
//             <CardDescription>There was an error loading the schedule. Please try again.</CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     );
//   }
// }


