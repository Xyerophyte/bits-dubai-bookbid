import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

let stripe: Stripe | null = null
if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-08-27.basil",
  })
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ error: "Payment processing is not configured" }, { status: 503 })
    }

    const { bookId, amount } = await request.json()

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch book details
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("*, profiles:seller_id(full_name, email)")
      .eq("id", bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Create payment intent with escrow metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "aed", // UAE Dirham
      metadata: {
        bookId,
        buyerId: user.id,
        sellerId: book.seller_id,
        bookTitle: book.title,
        escrowTransaction: "true",
      },
      description: `BookBid purchase: ${book.title}`,
      receipt_email: user.email,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
