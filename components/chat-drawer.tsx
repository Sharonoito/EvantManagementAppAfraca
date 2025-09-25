"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export function ChatDrawer({
  attendee,
  currentUser,
}: {
  attendee: { id: string; name: string }
  currentUser: { id: string }
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  async function fetchMessages() {
    try {
      if (!currentUser.id || !attendee.id) return
      const res = await fetch(`/api/messages?userId=${currentUser.id}&otherUserId=${attendee.id}`)
      if (!res.ok) return console.error("Failed to fetch messages")
      const data = await res.json()
      if (data.success) setMessages(data.messages)
    } catch (err) {
      console.error("Error fetching messages:", err)
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (isOpen) {
      fetchMessages()
      intervalId = setInterval(fetchMessages, 3000)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isOpen, attendee.id, currentUser.id])

  async function sendMessage() {
    if (!newMessage.trim()) return
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: attendee.id,
          content: newMessage,
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Failed to send message:", errorText)
        return
      }

      setNewMessage("")
      await fetchMessages()
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#006600] hover:bg-[#006600]/90 text-white"
      >
        Message {attendee.name}
      </Button>
      <DrawerContent className="flex justify-center items-center bg-white dark:bg-gray-800">
        {/* ✅ Center the card and shrink width */}
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg flex flex-col">
          <DrawerHeader className="border-b border-[#61CE70]/50 dark:border-[#006600]/50">
            <DrawerTitle className="text-gray-900 dark:text-white">
              Chat with {attendee.name}
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 dark:text-gray-400">
              Your conversation with {attendee.name}
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="h-96 p-4">
            <div className="flex flex-col gap-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 rounded-xl text-sm max-w-[80%] shadow-md ${
                    m.sender_id === currentUser.id
                      ? "self-end bg-[#C9A277] text-white rounded-br-none"
                      : "self-start bg-[#61CE70] text-gray-900 rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* ✅ Input row centered and full width */}
          <div className="p-4 border-t border-[#61CE70]/50 dark:border-[#006600]/50 flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              className="flex-1 focus:ring-2 focus:ring-[#61CE70] focus:border-[#61CE70]"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage()
              }}
            />
            <Button
              onClick={sendMessage}
              className="bg-[#006600] hover:bg-[#006600]/90 text-white"
            >
              Send
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
