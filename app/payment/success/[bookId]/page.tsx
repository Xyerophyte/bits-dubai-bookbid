"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, Clock, MessageCircle, Download } from "lucide-react"
import Link from "next/link"

// Mock order data
const mockOrder = {
  id: "ORD-2024-001",
  bookTitle: "Calculus: Early Transcendentals",
  bookAuthor: "James Stewart",
  bookEdition: "8th Edition",
  bookImage: "/images/book-calculo.png",
  amount: 1200,
  escrowFee: 36,
  totalAmount: 1236,
  seller: {
    name: "Arjun Kumar",
    phone: "+971 50 123 4567",
    email: "arjun.kumar@dubai.bits-pilani.ac.in",
  },
  status: "payment_confirmed",
  estimatedDelivery: "2-3 days",
  paymentDate: new Date().toLocaleDateString(),
}

const orderSteps = [
  { id: 1, title: "Payment Confirmed", description: "Your payment has been processed", completed: true },
  { id: 2, title: "Seller Notified", description: "Seller has been notified of your purchase", completed: true },
  { id: 3, title: "Book Handover", description: "Meet with seller to collect the book", completed: false },
  { id: 4, title: "Delivery Confirmed", description: "Confirm receipt and release payment", completed: false },
]

export default function PaymentSuccessPage({ params }: { params: { bookId: string } }) {
  const [currentStep, setCurrentStep] = useState(2)

  useEffect(() => {
    // Simulate order progress updates
    const timer = setTimeout(() => {
      console.log("[v0] Order created successfully:", mockOrder.id)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getProgressPercentage = () => {
    return (currentStep / orderSteps.length) * 100
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BITS Dubai BookBid</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your order has been confirmed and the seller has been notified. Order ID: {mockOrder.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Your purchase information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={mockOrder.bookImage || "/placeholder.svg"}
                    alt={mockOrder.bookTitle}
                    className="w-20 h-24 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2">{mockOrder.bookTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {mockOrder.bookAuthor} • {mockOrder.bookEdition}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Seller: {mockOrder.seller.name}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Book Price</span>
                    <span>₹{mockOrder.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Escrow Fee</span>
                    <span>₹{mockOrder.escrowFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span>₹{mockOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Payment Date</span>
                    <span>{mockOrder.paymentDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Order ID</span>
                    <span className="font-mono">{mockOrder.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Contact</CardTitle>
                <CardDescription>Get in touch to arrange book collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">{mockOrder.seller.name}</p>
                  <p className="text-sm text-muted-foreground">{mockOrder.seller.email}</p>
                  <p className="text-sm text-muted-foreground">{mockOrder.seller.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Seller
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
                <CardDescription>Track your order status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(getProgressPercentage())}% Complete</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>

                <div className="space-y-4">
                  {orderSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          step.completed
                            ? "bg-green-100 text-green-700"
                            : index === currentStep
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {step.completed ? <CheckCircle className="h-3 w-3" /> : step.id}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${step.completed ? "text-green-700" : ""}`}>{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                      {step.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Done
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Contact the Seller</p>
                      <p className="text-xs text-muted-foreground">
                        Message {mockOrder.seller.name} to arrange a convenient time and place for book collection
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Meet on Campus</p>
                      <p className="text-xs text-muted-foreground">
                        Collect your book safely on campus. Check the book condition before confirming receipt
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Confirm Receipt</p>
                      <p className="text-xs text-muted-foreground">
                        Once satisfied, confirm receipt to release payment to the seller
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Estimated delivery:</strong> {mockOrder.estimatedDelivery}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your payment is protected by our escrow service until you confirm receipt.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/books">Browse More Books</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
