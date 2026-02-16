import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Helper to save order data to a local file (mock database)
const saveOrderToDisk = (orderData) => {
  try {
    const dirPath = path.join(process.cwd(), "data", "orders");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const fileName = `order_${Date.now()}_${orderData.customerData.email.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2));
    console.log(`✅ Order data saved to disk: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("❌ Failed to save order to disk:", error);
    return null;
  }
};

export async function POST(req) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  try {
    const { items, customerData } = await req.json();

    // 1. CONSOLE FULL DATA
    const fullOrderPayload = {
      timestamp: new Date().toISOString(),
      orderId: `SPORE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerData,
      items,
      totalAmount: items
        .reduce((sum, item) => {
          const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
          return sum + price * (item.quantity || 1);
        }, 0)
        .toFixed(2),
    };

    console.log("=======================================");
    console.log("🚀 NEW CHECKOUT INITIATED");
    console.log("ORDER ID:", fullOrderPayload.orderId);
    console.log("USER DATA:", JSON.stringify(customerData, null, 2));
    console.log("PRODUCT DATA:", JSON.stringify(items, null, 2));
    console.log("TOTAL ESTIMATED:", `$${fullOrderPayload.totalAmount}`);
    console.log("=======================================");

    // 2. STORE DATA TO DISK (MOCK DB)
    saveOrderToDisk(fullOrderPayload);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const origin =
      req.headers.get("origin") ||
      (host ? `${protocol}://${host}` : null) ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const line_items = items.map((item) => {
      const priceValue = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image.startsWith("http") ? item.image : `${origin}${item.image}`] : [],
            description: item.description,
            metadata: {
              variant_id: item.variant_id || "", // Pass variant ID through to Stripe
            },
          },
          unit_amount: Math.round(priceValue * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    const sessionOptions = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/payment/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      metadata: {
        orderId: fullOrderPayload.orderId,
        customerName: customerData.name,
        customerEmail: customerData.email,
        itemsCount: items.length.toString(),
      },
    };

    if (customerData) {
      sessionOptions.customer_email = customerData.email;
      sessionOptions.metadata = {
        ...sessionOptions.metadata,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerAddress: customerData.address?.line1 || "",
        customerCity: customerData.address?.city || "",
        customerState: customerData.address?.state || "",
        customerZip: customerData.address?.postal_code || "",
        customerCountry: customerData.address?.country || "US",
      };
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: fullOrderPayload.orderId,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
