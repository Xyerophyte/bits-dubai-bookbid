"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Clock, Gavel, ShoppingCart, TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react"
import { useRealtimeBids } from "@/hooks/use-realtime-bids"

interface BiddingInterfaceProps {
  bookId: string
  initialCurrentBid: number
  buyNowPrice?: number
  minBidIncrement: number
  timeLeft: string
  initialBidCount: number
  isAuctionActive: boolean
}

export default function BiddingInterface({
  bookId,
  initialCurrentBid,
  buyNowPrice,
  minBidIncrement,
  timeLeft,
  initialBidCount,
  isAuctionActive,
}: BiddingInterfaceProps) {
  const [bidAmount, setBidAmount] = useState("")
  const [autoBidEnabled, setAutoBidEnabled] = useState(false)
  const [maxAutoBid, setMaxAutoBid] = useState("")
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [bidSuccess, setBidSuccess] = useState(false)
  const [bidError, setBidError] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const { currentBid, bidCount, placeBid } = useRealtimeBids(bookId)

  // Use real-time data if available, fallback to initial props
  const displayCurrentBid = currentBid || initialCurrentBid
  const displayBidCount = bidCount || initialBidCount

  // Parse time left and convert to seconds for countdown
  useEffect(() => {
    const parseTimeLeft = (timeStr: string) => {
      const parts = timeStr.split(" ")
      let totalSeconds = 0

      parts.forEach((part) => {
        if (part.includes("d")) {
          totalSeconds += Number.parseInt(part) * 24 * 60 * 60
        } else if (part.includes("h")) {
          totalSeconds += Number.parseInt(part) * 60 * 60
        } else if (part.includes("m")) {
          totalSeconds += Number.parseInt(part) * 60
        }
      })

      return totalSeconds
    }

    setTimeRemaining(parseTimeLeft(timeLeft))
  }, [timeLeft])

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const formatTimeRemaining = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const secs = seconds % 60

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const getTimeUrgency = () => {
    if (timeRemaining < 300) return "urgent" // Less than 5 minutes
    if (timeRemaining < 3600) return "warning" // Less than 1 hour
    return "normal"
  }

  const minBid = displayCurrentBid + minBidIncrement
  const isValidBid = bidAmount && Number.parseInt(bidAmount) >= minBid
  const urgency = getTimeUrgency()

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString())
  }

  const handlePlaceBid = async () => {
    if (!isValidBid) return

    setIsPlacingBid(true)
    setBidError("")

    try {
      const result = await placeBid(
        Number.parseInt(bidAmount),
        autoBidEnabled,
        autoBidEnabled ? Number.parseInt(maxAutoBid) : undefined,
      )

      if (result.success) {
        setBidSuccess(true)
        setBidAmount("")
        setShowConfirmDialog(false)

        // Reset success state after animation
        setTimeout(() => setBidSuccess(false), 3000)
      } else {
        setBidError(result.error || "Failed to place bid. Please try again.")
      }
    } catch (error) {
      setBidError("Failed to place bid. Please try again.")
    } finally {
      setIsPlacingBid(false)
    }
  }

  const handleBuyNow = () => {
    console.log("[v0] Buy now clicked for book:", bookId)
    // TODO: Implement buy now functionality
  }

  if (!isAuctionActive) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Auction Ended</h3>
            <p className="text-muted-foreground">This auction has concluded.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Success Alert */}
      {bidSuccess && (
        <Alert className="border-green-200 bg-green-50 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Bid placed successfully! You're now the highest bidder.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {bidError && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{bidError}</AlertDescription>
        </Alert>
      )}

      {/* Main Bidding Card */}
      <Card className="relative overflow-hidden">
        {urgency === "urgent" && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" />
        )}

        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                ₹{displayCurrentBid.toLocaleString()}
                {bidSuccess && <Zap className="h-5 w-5 text-yellow-500 animate-bounce" />}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4" />
                <span
                  className={
                    urgency === "urgent"
                      ? "text-red-600 font-semibold animate-pulse"
                      : urgency === "warning"
                        ? "text-orange-600 font-medium"
                        : ""
                  }
                >
                  {formatTimeRemaining(timeRemaining)} remaining
                </span>
                <span>•</span>
                <span>{displayBidCount} bids</span>
              </CardDescription>
            </div>
            {buyNowPrice && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Buy Now</p>
                <p className="text-xl font-bold">₹{buyNowPrice.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Progress bar for time urgency */}
          {urgency !== "normal" && (
            <div className="mt-3">
              <Progress
                value={urgency === "urgent" ? 90 : 70}
                className={`h-2 ${urgency === "urgent" ? "bg-red-100" : "bg-orange-100"}`}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Bid Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => handleQuickBid(minBid)} className="flex-1 min-w-0">
              ₹{minBid.toLocaleString()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBid(minBid + minBidIncrement)}
              className="flex-1 min-w-0"
            >
              ₹{(minBid + minBidIncrement).toLocaleString()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBid(minBid + minBidIncrement * 2)}
              className="flex-1 min-w-0"
            >
              ₹{(minBid + minBidIncrement * 2).toLocaleString()}
            </Button>
          </div>

          {/* Custom Bid Input */}
          <div className="space-y-2">
            <Label htmlFor="bidAmount">Your Bid (₹)</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder={`Minimum: ₹${minBid.toLocaleString()}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={minBid}
                  className={!isValidBid && bidAmount ? "border-red-300 focus:border-red-500" : ""}
                />
                {!isValidBid && bidAmount && (
                  <p className="text-xs text-red-600 mt-1">Minimum bid is ₹{minBid.toLocaleString()}</p>
                )}
              </div>

              <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogTrigger asChild>
                  <Button disabled={!isValidBid || isPlacingBid} className="px-6 relative overflow-hidden">
                    {isPlacingBid ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing...
                      </div>
                    ) : (
                      <>
                        <Gavel className="h-4 w-4 mr-2" />
                        Place Bid
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Your Bid</DialogTitle>
                    <DialogDescription>
                      You're about to place a bid of ₹{Number.parseInt(bidAmount || "0").toLocaleString()} on this
                      textbook.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>Your bid:</span>
                        <span className="font-semibold text-lg">
                          ₹{Number.parseInt(bidAmount || "0").toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Current highest:</span>
                        <span>₹{displayCurrentBid.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handlePlaceBid} disabled={isPlacingBid} className="flex-1">
                        {isPlacingBid ? "Placing Bid..." : "Confirm Bid"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Auto-bid Section */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <Label htmlFor="auto-bid" className="font-medium">
                    Auto-bid
                  </Label>
                </div>
                <Switch id="auto-bid" checked={autoBidEnabled} onCheckedChange={setAutoBidEnabled} />
              </div>

              {autoBidEnabled && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="maxAutoBid" className="text-sm">
                    Maximum auto-bid amount (₹)
                  </Label>
                  <Input
                    id="maxAutoBid"
                    type="number"
                    placeholder="e.g., 1500"
                    value={maxAutoBid}
                    onChange={(e) => setMaxAutoBid(e.target.value)}
                    min={minBid}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll automatically bid for you up to this amount when others outbid you.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buy Now Button */}
          {buyNowPrice && (
            <Button onClick={handleBuyNow} variant="secondary" className="w-full h-12 text-base">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Buy Now for ₹{buyNowPrice.toLocaleString()}
            </Button>
          )}

          {/* Bidding Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Minimum bid increment: ₹{minBidIncrement}</p>
            <p>• Bids placed in the last 2 minutes extend the auction by 2 minutes</p>
            <p>• Payment is secured through our escrow system</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
