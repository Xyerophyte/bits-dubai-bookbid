"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, X, Gavel, ShoppingCart, Clock, MessageCircle, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "bid" | "outbid" | "sale" | "message" | "auction_ending" | "payment"
  title: string
  message: string
  timestamp: Date
  read: boolean
  bookId?: string
  bookTitle?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show toast notification
    toast(notification.title, {
      description: notification.message,
      action: notification.bookId
        ? {
            label: "View",
            onClick: () => (window.location.href = `/books/${notification.bookId}`),
          }
        : undefined,
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvents = [
        {
          type: "bid" as const,
          title: "New Bid Placed",
          message: "Someone placed a bid on Calculus: Early Transcendentals",
          bookId: "1",
          bookTitle: "Calculus: Early Transcendentals",
        },
        {
          type: "outbid" as const,
          title: "You've been outbid!",
          message: "Your bid on Physics for Scientists was exceeded",
          bookId: "2",
          bookTitle: "Physics for Scientists and Engineers",
        },
        {
          type: "auction_ending" as const,
          title: "Auction Ending Soon",
          message: "Organic Chemistry auction ends in 30 minutes",
          bookId: "3",
          bookTitle: "Organic Chemistry",
        },
        {
          type: "message" as const,
          title: "New Message",
          message: "Seller replied to your question about the book condition",
        },
      ]

      // 20% chance to trigger a notification every 30 seconds
      if (Math.random() < 0.2) {
        const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)]
        addNotification(randomEvent)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function NotificationBell() {
  const { unreadCount } = useNotifications()
  const [showPanel, setShowPanel] = useState(false)

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setShowPanel(!showPanel)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {showPanel && <NotificationPanel onClose={() => setShowPanel(false)} />}
    </div>
  )
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bid":
        return <Gavel className="h-4 w-4 text-blue-600" />
      case "outbid":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case "sale":
        return <ShoppingCart className="h-4 w-4 text-green-600" />
      case "message":
        return <MessageCircle className="h-4 w-4 text-purple-600" />
      case "auction_ending":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <Card className="absolute right-0 top-12 w-80 max-h-96 shadow-lg z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Notifications</CardTitle>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.bookId) {
                        window.location.href = `/books/${notification.bookId}`
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              clearNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.timestamp)}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
