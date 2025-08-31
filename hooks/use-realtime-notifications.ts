"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface Notification {
  id: string
  type: "bid" | "outbid" | "auction_ending" | "auction_won" | "message"
  title: string
  message: string
  book_id?: string
  created_at: string
  read: boolean
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel
    let userId: string | null = null

    const setupRealtimeSubscription = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        userId = user.id

        // Subscribe to bid updates for user's active bids
        channel = supabase
          .channel(`notifications:${userId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "bids",
            },
            async (payload) => {
              // Check if this bid affects any of the user's bids
              const { data: userBids } = await supabase
                .from("bids")
                .select("book_id, amount")
                .eq("bidder_id", userId)
                .eq("book_id", payload.new.book_id)
                .eq("status", "active")

              if (userBids && userBids.length > 0 && payload.new.bidder_id !== userId) {
                // User has been outbid
                const { data: book } = await supabase
                  .from("books")
                  .select("title")
                  .eq("id", payload.new.book_id)
                  .single()

                const notification: Notification = {
                  id: `outbid-${Date.now()}`,
                  type: "outbid",
                  title: "You've been outbid!",
                  message: `Someone placed a higher bid on "${book?.title || "Unknown book"}"`,
                  book_id: payload.new.book_id,
                  created_at: new Date().toISOString(),
                  read: false,
                }

                setNotifications((prev) => [notification, ...prev])
                setUnreadCount((prev) => prev + 1)

                // Show toast notification
                toast({
                  title: notification.title,
                  description: notification.message,
                  variant: "destructive",
                })
              }
            },
          )
          .subscribe()

        // Simulate auction ending notifications
        const checkAuctionEndings = () => {
          // This would normally be handled by a server-side cron job
          // For demo purposes, we'll simulate it
          const mockEndingNotification: Notification = {
            id: `ending-${Date.now()}`,
            type: "auction_ending",
            title: "Auction ending soon!",
            message: 'The auction for "Calculus: Early Transcendentals" ends in 5 minutes',
            book_id: "1",
            created_at: new Date().toISOString(),
            read: false,
          }

          // Randomly show ending notifications for demo
          if (Math.random() < 0.1) {
            // 10% chance every check
            setNotifications((prev) => [mockEndingNotification, ...prev])
            setUnreadCount((prev) => prev + 1)

            toast({
              title: mockEndingNotification.title,
              description: mockEndingNotification.message,
              variant: "default",
            })
          }
        }

        // Check for auction endings every 30 seconds
        const endingInterval = setInterval(checkAuctionEndings, 30000)

        return () => {
          clearInterval(endingInterval)
        }
      } catch (error) {
        console.error("Error setting up notifications:", error)
      }
    }

    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}
