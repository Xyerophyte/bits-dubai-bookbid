"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, ArrowLeft, Shield, Clock, CheckCircle, AlertTriangle, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { createClient } from "@/lib/supabase/client"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
}

interface Book {
  id: string
  title: string
  author: string | null
  edition: string | null
  condition: string
  images: string[] | null
  current_bid: number
  buy_now_price: number | null
  profiles: {
    full_name: string | null
    rating: number
  }
}

function CheckoutForm({ book, bookId }: { book: Book; bookId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [paymentError, setPaymentError] = useState("")
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  })

  const finalPrice = book.buy_now_price || book.current_bid
  const escrowFee = Math.round(finalPrice * 0.03) // 3% escrow fee
  const totalAmount = finalPrice + escrowFee

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId,
            amount: totalAmount,
          }),
        })

        const data = await response.json()
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setPaymentError("Failed to initialize payment")
        }
      } catch (error) {
        setPaymentError("Failed to initialize payment")
        console.error("Error creating payment intent:", error)
      }
    }

    createPaymentIntent()
  }, [bookId, totalAmount])

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      return
    }

    if (!agreedToTerms) {
      setPaymentError("Please agree to the terms and conditions")
      return
    }

    setIsProcessing(true)
    setPaymentError("")

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setPaymentError("Card element not found")
      setIsProcessing(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: contactInfo.email,
            phone: contactInfo.phone,
          },
        },
      })

      if (error) {
        setPaymentError(error.message || "Payment failed")
      } else if (paymentIntent.status === "succeeded") {
        // Redirect to success page
        router.push(`/payment/success/${bookId}?payment_intent=${paymentIntent.id}`)
      }
    } catch (error) {
      setPaymentError("Payment processing failed")
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your purchase details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <img
                src={book.images?.[0] || "/placeholder.svg"}
                alt={book.title}
                className="w-20 h-24 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {book.author && `by ${book.author}`} {book.edition && `• ${book.edition}`}
                </p>
                <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
                  {book.condition}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Seller: {book.profiles.full_name || "Unknown"}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Book Price</span>
                <span>₹{finalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Escrow Service Fee (3%)</span>
                <span>₹{escrowFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escrow Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Buyer Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Secure Escrow Service</p>
                <p className="text-xs text-muted-foreground">
                  Your payment is held securely until you confirm receipt of the book
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">7-Day Protection Period</p>
                <p className="text-xs text-muted-foreground">Full refund if the book doesn't match the description</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Verified Sellers Only</p>
                <p className="text-xs text-muted-foreground">All sellers are verified BITS Dubai students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter your card information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Card Information</Label>
              <div className="p-3 border rounded-md">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@dubai.bits-pilani.ac.in"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+971 50 123 4567"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Payment */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                . I understand that my payment will be held in escrow until I confirm receipt of the book.
              </Label>
            </div>

            {paymentError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Your payment will be processed securely through Stripe. The seller will only receive payment after you
                confirm the book is as described.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handlePayment}
              disabled={!agreedToTerms || isProcessing || !stripe || !clientSecret}
              className="w-full h-12 text-base"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Pay ₹{totalAmount.toLocaleString()} Securely
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Powered by Stripe. Your payment information is encrypted and secure.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutPage({ params }: { params: { bookId: string } }) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, error } = await supabase
          .from("books")
          .select(`
            *,
            profiles:seller_id (
              full_name,
              rating
            )
          `)
          .eq("id", params.bookId)
          .single()

        if (error) throw error
        setBook(data)
      } catch (error) {
        setError("Failed to load book details")
        console.error("Error fetching book:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [params.bookId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-muted-foreground">{error || "Book not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">BITS Dubai BookBid</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Secure Checkout</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <Link
            href={`/books/${params.bookId}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Book
          </Link>

          <CheckoutForm book={book} bookId={params.bookId} />
        </div>
      </div>
    </Elements>
  )
}
