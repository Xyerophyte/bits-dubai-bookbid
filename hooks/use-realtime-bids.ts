"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface Bid {
  id: string
  book_id: string
  bidder_id: string
  amount: number
  is_auto_bid: boolean
  max_auto_bid?: number
  status: string
  created_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}

interface Book {
  id: string
  current_bid: number
  bid_count: number
  status: string
}

export function useRealtimeBids(bookId: string) {
  const [bids, setBids] = useState<Bid[]>([])
  const [currentBid, setCurrentBid] = useState(0)
  const [bidCount, setBidCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const fetchInitialData = async () => {
      try {
        // Fetch current book data
        const { data: book } = await supabase
          .from("books")
          .select("current_bid, bid_count, status")
          .eq("id", bookId)
          .single()

        if (book) {
          setCurrentBid(book.current_bid)
          setBidCount(book.bid_count)
        }

        // Fetch recent bids
        const { data: bidsData } = await supabase
          .from("bids")
          .select(`
            *,
            profiles:bidder_id (
              full_name,
              avatar_url
            )
          `)
          .eq("book_id", bookId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (bidsData) {
          setBids(bidsData)
        }
      } catch (error) {
        console.error("Error fetching initial bid data:", error)
      } finally {
        setLoading(false)
      }
    }

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`bids:${bookId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bids",
            filter: `book_id=eq.${bookId}`,
          },
          async (payload) => {
            console.log("[v0] New bid received:", payload)

            // Fetch the complete bid data with profile info
            const { data: newBid } = await supabase
              .from("bids")
              .select(`
                *,
                profiles:bidder_id (
                  full_name,
                  avatar_url
                )
              `)
              .eq("id", payload.new.id)
              .single()

            if (newBid) {
              setBids((prev) => [newBid, ...prev.slice(0, 9)])
              setCurrentBid(newBid.amount)
              setBidCount((prev) => prev + 1)
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "books",
            filter: `id=eq.${bookId}`,
          },
          (payload) => {
            console.log("[v0] Book updated:", payload)
            const updatedBook = payload.new as Book
            setCurrentBid(updatedBook.current_bid)
            setBidCount(updatedBook.bid_count)
          },
        )
        .subscribe()
    }

    fetchInitialData()
    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [bookId, supabase])

  const placeBid = async (amount: number, isAutoBid = false, maxAutoBid?: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("bids")
        .insert({
          book_id: bookId,
          bidder_id: user.id,
          amount,
          is_auto_bid: isAutoBid,
          max_auto_bid: maxAutoBid,
          status: "active",
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error placing bid:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to place bid" }
    }
  }

  return {
    bids,
    currentBid,
    bidCount,
    loading,
    placeBid,
  }
}
