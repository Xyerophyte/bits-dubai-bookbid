"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Star, MessageCircle, Shield } from "lucide-react"

interface OrderTrackingProps {
  orderId: string
  bookTitle: string
  sellerName: string
  amount: number
  status: "pending" | "delivered" | "completed" | "disputed"
  onConfirmDelivery?: () => void
  onDispute?: () => void
}

export default function OrderTracking({
  orderId,
  bookTitle,
  sellerName,
  amount,
  status,
  onConfirmDelivery,
  onDispute,
}: OrderTrackingProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showDisputeDialog, setShowDisputeDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [disputeReason, setDisputeReason] = useState("")

  const handleConfirmDelivery = () => {
    console.log("[v0] Confirming delivery for order:", orderId)
    onConfirmDelivery?.()
    setShowConfirmDialog(false)
    setShowReviewDialog(true)
  }

  const handleSubmitReview = () => {
    console.log("[v0] Submitting review:", { orderId, rating, review })
    setShowReviewDialog(false)
    // TODO: Submit review to backend
  }

  const handleSubmitDispute = () => {
    console.log("[v0] Submitting dispute:", { orderId, disputeReason })
    onDispute?.()
    setShowDisputeDialog(false)
    // TODO: Submit dispute to backend
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "disputed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "delivered":
        return "Awaiting Confirmation"
      case "disputed":
        return "Under Review"
      default:
        return "In Progress"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{bookTitle}</CardTitle>
            <CardDescription>
              Order #{orderId} • Seller: {sellerName}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>{getStatusText(status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Amount in Escrow:</span>
          <span className="font-semibold">₹{amount.toLocaleString()}</span>
        </div>

        {status === "pending" && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your payment is safely held in escrow. Contact the seller to arrange book collection.
            </AlertDescription>
          </Alert>
        )}

        {status === "delivered" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              The seller has marked this order as delivered. Please confirm receipt to release payment.
            </AlertDescription>
          </Alert>
        )}

        {status === "disputed" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This order is under review. Our support team will contact you within 24 hours.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message Seller
          </Button>

          {status === "delivered" && (
            <>
              <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Receipt
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Book Receipt</DialogTitle>
                    <DialogDescription>
                      Please confirm that you have received the book and it matches the description. This will release
                      the payment to the seller.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        By confirming, you acknowledge that the book is as described and in the expected condition.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmDelivery} className="flex-1">
                        Confirm Receipt
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Dispute
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                    <DialogDescription>
                      If the book doesn't match the description or there's an issue, please let us know.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dispute-reason">Describe the issue</Label>
                      <Textarea
                        id="dispute-reason"
                        placeholder="Please describe what's wrong with the book or transaction..."
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowDisputeDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitDispute} disabled={!disputeReason.trim()} className="flex-1">
                        Submit Dispute
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate Your Experience</DialogTitle>
              <DialogDescription>Help other students by rating this seller</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="p-1">
                      <Star
                        className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review">Review (Optional)</Label>
                <Textarea
                  id="review"
                  placeholder="Share your experience with this seller..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)} className="flex-1">
                  Skip
                </Button>
                <Button onClick={handleSubmitReview} disabled={rating === 0} className="flex-1">
                  Submit Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
