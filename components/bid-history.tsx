"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Crown, RefreshCw } from "lucide-react"

interface BidHistoryItem {
  id: string
  bidder: string
  amount: number
  time: string
  isWinning?: boolean
  isAutoBid?: boolean
}

interface BidHistoryProps {
  bookId: string
  bids: BidHistoryItem[]
  isLive?: boolean
}

export default function BidHistory({ bookId, bids, isLive = true }: BidHistoryProps) {
  const [bidHistory, setBidHistory] = useState(bids)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Randomly add new bids (simulation)
      if (Math.random() > 0.85) {
        const newBid: BidHistoryItem = {
          id: Date.now().toString(),
          bidder: ["Arjun K.", "Priya S.", "Rahul M.", "Sneha P.", "Amit K."][Math.floor(Math.random() * 5)],
          amount: bidHistory[0]?.amount + 50 + Math.floor(Math.random() * 100),
          time: "Just now",
          isWinning: true,
          isAutoBid: Math.random() > 0.7,
        }

        setBidHistory((prev) => [{ ...newBid }, ...prev.map((bid) => ({ ...bid, isWinning: false }))])
      }
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [bidHistory, isLive])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Refreshing bid history for book:", bookId)
    setIsRefreshing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Bid History
            {isLive && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {bidHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bids yet. Be the first to bid!</p>
            </div>
          ) : (
            bidHistory.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  bid.isWinning ? "bg-primary/10 border border-primary/20 animate-fade-in" : "bg-muted/30"
                } ${index === 0 && bid.time === "Just now" ? "animate-pulse" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg`} />
                      <AvatarFallback className="text-sm">
                        {bid.bidder
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {bid.isWinning && (
                      <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bid.bidder}</span>
                      {bid.isAutoBid && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          Auto-bid
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{bid.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${bid.isWinning ? "text-primary" : ""}`}>₹{bid.amount.toLocaleString()}</p>
                  {bid.isWinning && <p className="text-xs text-primary font-medium">Winning bid</p>}
                </div>
              </div>
            ))
          )}
        </div>

        {bidHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Showing {Math.min(bidHistory.length, 10)} of {bidHistory.length} bids
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
