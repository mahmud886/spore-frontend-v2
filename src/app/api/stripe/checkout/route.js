import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(req) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  try {
    const { amount, tierName, tierId, name, email, note, mailingAddress } = await req.json();

    if (!amount || !tierName) {
      return NextResponse.json({ error: "Amount and Tier Name are required" }, { status: 400 });
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const origin =
      req.headers.get("origin") ||
      (host ? `${protocol}://${host}` : null) ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    if (!origin) {
      console.error("Origin could not be determined");
      return NextResponse.json({ error: "Origin could not be determined" }, { status: 400 });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Support Spore Fall - ${tierName}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/payment-cancel`,
      metadata: {
        tierId,
        tierName,
        supporterName: name,
        supporterNote: note,
        mailingAddress,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
