import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, MapPin, User, Users, MessageSquare, ThumbsUp, BarChart, Star } from "lucide-react"
import Link from "next/link"
import { getSessionById } from "@/lib/db"

interface Props {
  params: {
    sessionId: string
  }
}

// Mock data for interactive features
const mockQuestions = [
  {
    id: "q1",
    user_name: "Anonymous",
    question: "What are the main challenges facing rural finance institutions?",
    upvotes: 15,
    is_answered: true,
    answer:
      "The main challenges include limited infrastructure, high operational costs, and lack of credit history for rural borrowers.",
    created_at: "2024-01-15T10:30:00Z",
  },
]

const mockPoll = {
  id: "poll1",
  question: "What is the biggest barrier to rural finance adoption?",
  options: [
    { text: "Lack of infrastructure", votes: 45, percentage: 38 },
    { text: "High interest rates", votes: 32, percentage: 27 },
    { text: "Limited financial literacy", votes: 28, percentage: 23 },
    { text: "Regulatory challenges", votes: 15, percentage: 12 },
  ],
  total_votes: 120,
  user_voted: false,
}

export default async function SessionDetailPage({ params }: Props) {
  const session = await getSessionById(params.sessionId)

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Session not found</p>
            <Button asChild className="mt-4">
              <Link href="/attendee/sessions">Back to Sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/attendee/sessions">Back to Sessions</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{session.title}</CardTitle>
                    <CardDescription className="text-base">{session.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{session.session_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>{new Date(session.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {new Date(session.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(session.end_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {session.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{session.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{session.registration_count || 0} registered</span>
                  </div>
                </div>

                {session.speaker_name && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold">{session.speaker_name}</p>
                        <p className="text-sm text-muted-foreground">Speaker</p>
                      </div>
                    </div>
                    {session.speaker_bio && <p className="text-sm text-muted-foreground mt-3">{session.speaker_bio}</p>}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {new Date(session.start_time) > new Date() ? (
                    <Button className="flex-1">Register for Session</Button>
                  ) : (
                    <Button variant="outline" className="flex-1 bg-transparent" disabled>
                      Session Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Poll */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Live Poll
                </CardTitle>
                <CardDescription>{mockPoll.question}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPoll.options.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Button
                          variant={mockPoll.user_voted ? "outline" : "ghost"}
                          className="flex-1 justify-start h-auto p-3"
                          disabled={mockPoll.user_voted}
                        >
                          <span className="text-left">{option.text}</span>
                        </Button>
                        <span className="text-sm text-muted-foreground ml-3">
                          {option.votes} ({option.percentage}%)
                        </span>
                      </div>
                      <Progress value={option.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">{mockPoll.total_votes} total responses</p>
              </CardContent>
            </Card>

            {/* Q&A Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Q&A
                </CardTitle>
                <CardDescription>Ask questions and see answers from the speaker</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Ask Question */}
                <div className="space-y-3 mb-6">
                  <Textarea placeholder="Ask a question about this session..." className="min-h-20" />
                  <Button>Submit Question</Button>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {mockQuestions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{question.question}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>by {question.user_name}</span>
                            <span>{new Date(question.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {question.upvotes}
                          </Button>
                        </div>
                      </div>

                      {question.is_answered && question.answer && (
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg mt-3">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Answer:</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{question.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Feedback</CardTitle>
                <CardDescription>Rate this session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button key={star} variant="ghost" size="sm" className="p-1">
                      <Star className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
                    </Button>
                  ))}
                </div>
                <Textarea placeholder="Share your thoughts about this session..." className="min-h-20" />
                <Button className="w-full">Submit Feedback</Button>
              </CardContent>
            </Card>

            {/* Related Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No related sessions found</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
