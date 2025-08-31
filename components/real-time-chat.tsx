"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, X } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isCurrentUser: boolean
}

interface ChatProps {
  bookId: string
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  currentUserId: string
  currentUserName: string
}

export function RealTimeChat({
  bookId,
  sellerId,
  sellerName,
  sellerAvatar,
  currentUserId,
  currentUserName,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Initialize with some sample messages
  useEffect(() => {
    const sampleMessages: Message[] = [
      {
        id: "1",
        senderId: sellerId,
        senderName: sellerName,
        senderAvatar: sellerAvatar,
        content: "Hi! Thanks for your interest in this book. It's in excellent condition with minimal highlighting.",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isCurrentUser: false,
      },
      {
        id: "2",
        senderId: currentUserId,
        senderName: currentUserName,
        content: "Great! Can you tell me more about the condition of the binding?",
        timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
        isCurrentUser: true,
      },
      {
        id: "3",
        senderId: sellerId,
        senderName: sellerName,
        senderAvatar: sellerAvatar,
        content: "The binding is perfect - no cracks or loose pages. I've taken good care of it.",
        timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
        isCurrentUser: false,
      },
    ]
    setMessages(sampleMessages)
  }, [sellerId, sellerName, sellerAvatar, currentUserId, currentUserName])

  // Simulate real-time messages from seller
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      // 15% chance to receive a message every 20 seconds when chat is open
      if (Math.random() < 0.15) {
        const responses = [
          "I can meet you at the library tomorrow if you'd like to see it in person.",
          "The book includes all the original access codes too.",
          "I'm flexible on the price if you're interested in buying it now.",
          "Let me know if you have any other questions!",
          "I have a few other textbooks available if you're interested.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        // Show typing indicator first
        setIsTyping(true)

        setTimeout(() => {
          const newMsg: Message = {
            id: Math.random().toString(36).substr(2, 9),
            senderId: sellerId,
            senderName: sellerName,
            senderAvatar: sellerAvatar,
            content: randomResponse,
            timestamp: new Date(),
            isCurrentUser: false,
          }

          setMessages((prev) => [...prev, newMsg])
          setIsTyping(false)

          if (!isOpen) {
            setUnreadCount((prev) => prev + 1)
          }
        }, 2000) // 2 second typing delay
      }
    }, 20000) // Every 20 seconds

    return () => clearInterval(interval)
  }, [isOpen, sellerId, sellerName, sellerAvatar])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Clear unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage.trim(),
      timestamp: new Date(),
      isCurrentUser: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 h-12 px-4 shadow-lg z-40">
        <MessageCircle className="h-4 w-4 mr-2" />
        Chat with Seller
        {unreadCount > 0 && (
          <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">{unreadCount}</Badge>
        )}
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-lg z-40 flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={sellerAvatar || "/placeholder.svg"} />
              <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{sellerName}</CardTitle>
              <p className="text-xs text-muted-foreground">Seller</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                {!message.isCurrentUser && (
                  <Avatar className="h-6 w-6 mt-1">
                    <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                    message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <Avatar className="h-6 w-6 mt-1">
                  <AvatarImage src={sellerAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{sellerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
