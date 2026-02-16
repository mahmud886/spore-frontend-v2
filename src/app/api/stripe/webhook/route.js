import { updateDonationPaymentStatus } from "@/app/lib/services/donations";
import { updateOrderPaymentStatus } from "@/app/lib/services/orders";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe Webhook Secret is not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Payment successful for session:", session.id);
      console.log("Supporter:", session.metadata?.supporterName || session.metadata?.customerName);

      // Retrieve full session with line items to ensure we have all data for order creation if needed
      try {
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items", "payment_intent"],
        });

        // Determine if this is a Product Order or a Donation
        if (fullSession.metadata?.type === "donation") {
          // Handle Donation
          const result = await updateDonationPaymentStatus(session.id, fullSession);
          if (result.success) {
            console.log(`Donation ${result.donation.donation_number} confirmed via webhook.`);
          } else {
            console.error("Failed to update donation via webhook:", result.error);
          }
        } else {
          // Handle E-commerce Order (Default)
          const result = await updateOrderPaymentStatus(session.id, fullSession);
          if (result.success) {
            console.log(`Order ${result.order?.order_number || "Unknown"} confirmed via webhook.`);
          } else {
            console.error("Failed to update order via webhook:", result.error);
          }
        }
      } catch (err) {
        console.error("Error processing webhook order update:", err);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
