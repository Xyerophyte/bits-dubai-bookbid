import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = await createClient()

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Create order record
        const { error: orderError } = await supabase.from("orders").insert({
          book_id: paymentIntent.metadata.bookId,
          buyer_id: paymentIntent.metadata.buyerId,
          seller_id: paymentIntent.metadata.sellerId,
          final_price: paymentIntent.amount / 100, // Convert from cents
          payment_method: "stripe",
          payment_intent_id: paymentIntent.id,
          payment_status: "paid",
          delivery_status: "pending",
        })

        if (orderError) {
          console.error("Error creating order:", orderError)
        }

        // Update book status to sold
        const { error: bookError } = await supabase
          .from("books")
          .update({ status: "sold" })
          .eq("id", paymentIntent.metadata.bookId)

        if (bookError) {
          console.error("Error updating book status:", bookError)
        }

        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log("Payment failed:", failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
