import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Users, Plus, Eye } from "lucide-react"
import Link from "next/link"

// Mock data for polls
const mockPolls = [
  {
    id: "poll1",
    session_id: "session1",
    session_title: "Future of Rural Finance",
    question: "What is the biggest barrier to rural finance adoption?",
    options: [
      { text: "Lack of infrastructure", votes: 45 },
      { text: "High interest rates", votes: 32 },
      { text: "Limited financial literacy", votes: 28 },
      { text: "Regulatory challenges", votes: 15 },
    ],
    total_votes: 120,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "poll2",
    session_id: "session2",
    session_title: "Technology in Agriculture",
    question: "Which technology will have the most impact on agriculture?",
    options: [
      { text: "AI and Machine Learning", votes: 38 },
      { text: "IoT Sensors", votes: 25 },
      { text: "Blockchain", votes: 18 },
      { text: "Drones", votes: 22 },
    ],
    total_votes: 103,
    is_active: false,
    created_at: "2024-01-15T14:30:00Z",
  },
]

export default function PollsManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Polls Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Create and manage interactive polls for sessions</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link href="/admin/qa">Back to Q&A</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/qa/polls/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPolls.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPolls.filter((p) => p.is_active).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPolls.reduce((sum, p) => sum + p.total_votes, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Polls List */}
        <div className="space-y-6">
          {mockPolls.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No polls created yet</p>
                <Button asChild>
                  <Link href="/admin/qa/polls/new">Create Your First Poll</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            mockPolls.map((poll) => (
              <Card key={poll.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{poll.question}</CardTitle>
                        <Badge variant={poll.is_active ? "default" : "secondary"}>
                          {poll.is_active ? "Active" : "Closed"}
                        </Badge>
                      </div>
                      <CardDescription>
                        Session: {poll.session_title} • {poll.total_votes} total responses
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {poll.is_active ? "Close Poll" : "Reopen Poll"}
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {poll.options.map((option, index) => {
                      const percentage = poll.total_votes > 0 ? Math.round((option.votes / poll.total_votes) * 100) : 0

                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-muted-foreground">
                              {option.votes} votes ({percentage}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Created {new Date(poll.created_at).toLocaleString()}
                    </span>
                    <Button variant="outline" size="sm">
                      <BarChart className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
