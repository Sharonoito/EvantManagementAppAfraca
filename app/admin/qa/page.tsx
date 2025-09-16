import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ThumbsUp, Clock, User, Search } from "lucide-react"
import Link from "next/link"

// Mock data for Q&A
const mockQuestions = [
  {
    id: "q1",
    session_id: "session1",
    session_title: "Future of Rural Finance",
    user_name: "John Doe",
    question: "What are the main challenges facing rural finance institutions in developing countries?",
    upvotes: 15,
    is_answered: false,
    answer: null,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "q2",
    session_id: "session1",
    session_title: "Future of Rural Finance",
    user_name: "Jane Smith",
    question: "How can technology improve access to financial services in rural areas?",
    upvotes: 8,
    is_answered: true,
    answer:
      "Technology can significantly improve access through mobile banking, digital payments, and AI-powered credit scoring systems that don't rely on traditional collateral.",
    created_at: "2024-01-15T11:15:00Z",
  },
]

export default function QAManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Q&A Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Moderate questions and manage interactive sessions</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link href="/admin/qa/polls">Manage Polls</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQuestions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Answered</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQuestions.filter((q) => q.is_answered).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQuestions.filter((q) => !q.is_answered).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQuestions.reduce((sum, q) => sum + q.upvotes, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search questions by content, session, or user..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Questions</CardTitle>
            <CardDescription>Manage questions from all sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {mockQuestions.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No questions submitted yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {mockQuestions.map((question) => (
                  <Card key={question.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">{question.session_title}</Badge>
                            <Badge variant={question.is_answered ? "default" : "secondary"}>
                              {question.is_answered ? "Answered" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-lg font-medium mb-2">{question.question}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {question.user_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {question.upvotes} upvotes
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(question.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {question.is_answered && question.answer && (
                        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Answer:</p>
                          <p className="text-sm text-green-700 dark:text-green-300">{question.answer}</p>
                        </div>
                      )}

                      {!question.is_answered && (
                        <div className="space-y-3">
                          <Textarea placeholder="Type your answer here..." className="min-h-20" />
                          <div className="flex gap-2">
                            <Button size="sm">Submit Answer</Button>
                            <Button variant="outline" size="sm">
                              Mark as Answered
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
