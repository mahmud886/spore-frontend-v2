import { createOrder } from "@/app/lib/printful";
import { updateDonationPaymentStatus } from "@/app/lib/services/donations";
import { updateOrderPaymentStatus } from "@/app/lib/services/orders";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(req) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // 1. Retrieve full session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    });

    // 2. Combine all data
    // Check if it's a donation
    const isDonation = session.metadata?.type === "donation";

    // Update order status in Supabase (in case webhook is delayed)
    let supabaseResult;
    if (isDonation) {
      supabaseResult = await updateDonationPaymentStatus(sessionId, session);
    } else {
      supabaseResult = await updateOrderPaymentStatus(sessionId, session);
    }

    if (!supabaseResult.success) {
      console.warn("Failed to update order status in Supabase from confirm route:", supabaseResult.error);
    }

    const confirmedOrderData = {
      orderId: session.metadata.orderId || `SPORE-CONF-${Date.now()}`,
      status: "PAID",
      timestamp: new Date().toISOString(),
      type: isDonation ? "donation" : "order",
      stripeData: {
        sessionId: session.id,
        paymentIntentId: session.payment_intent?.id,
        amountTotal: session.amount_total / 100,
        currency: session.currency,
        paymentStatus: session.payment_status,
      },
      customerData: {
        name: session.customer_details?.name || session.metadata.customerName,
        email: session.customer_details?.email || session.metadata.customerEmail,
        address: session.shipping_details?.address || {
          line1: session.metadata.customerAddress,
          city: session.metadata.customerCity,
          state: session.metadata.customerState,
          postal_code: session.metadata.customerZip,
          country: session.metadata.customerCountry,
        },
      },
      products: session.line_items.data.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total / 100,
        currency: item.currency,
        variant_id: item.price?.product?.metadata?.variant_id || null, // Extract variant_id from product metadata
      })),
    };

    // 3. CONSOLE FULL DATA
    console.log("=======================================");
    console.log("✅ PAYMENT SUCCESSFUL & VERIFIED");
    console.log("ORDER ID:", confirmedOrderData.orderId);
    console.log("TYPE:", confirmedOrderData.type);
    console.log("FULL DATA:", JSON.stringify(confirmedOrderData, null, 2));
    console.log("=======================================");

    // 4. STORE CONFIRMED DATA TO DISK
    const dirPath = path.join(process.cwd(), "data", "orders", "confirmed");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const fileName = `confirmed_${confirmedOrderData.orderId}_${Date.now()}.json`;
    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(confirmedOrderData, null, 2));

    // Skip Printful for donations
    if (isDonation) {
      console.log("ℹ️ Skipping Printful integration for donation.");
      return NextResponse.json({ success: true, order: confirmedOrderData });
    }

    // 5. OPTIONAL: PUSH TO PRINTFUL
    let printfulOrder = null;
    const apiKey = process.env.PRINTFUL_API_KEY;

    console.log("🔍 Printful API Key present:", !!apiKey);

    if (apiKey) {
      try {
        console.log("📤 Attempting to push order to Printful...");

        // Map our data to Printful Order format
        const printfulOrderData = {
          external_id: confirmedOrderData.orderId,
          confirm: false, // Create as draft for manual review
          recipient: {
            name: confirmedOrderData.customerData.name,
            email: confirmedOrderData.customerData.email,
            address1: confirmedOrderData.customerData.address.line1,
            city: confirmedOrderData.customerData.address.city,
            state_code: confirmedOrderData.customerData.address.state || "",
            zip: confirmedOrderData.customerData.address.postal_code,
            country_code: confirmedOrderData.customerData.address.country || "US",
          },
          items: await Promise.all(
            confirmedOrderData.products.map(async (p) => {
              const item = {
                quantity: p.quantity,
                name: p.name,
                retail_price: p.price.toString(),
              };

              let finalVariantId = p.variant_id;

              // EMERGENCY FALLBACK: If variant_id is missing, try to fetch it from the store by name
              if (!finalVariantId) {
                console.log(`🔍 EMERGENCY: Fetching missing variant_id for "${p.name}"...`);
                try {
                  const { getStoreProducts, getStoreProductDetail } = await import("@/app/lib/printful");
                  const allProducts = await getStoreProducts(100);

                  // Try to find product by name
                  const matchedProduct = allProducts.find(
                    (ap) =>
                      p.name.toLowerCase().includes(ap.name.toLowerCase()) ||
                      ap.name.toLowerCase().includes(p.name.toLowerCase()),
                  );

                  if (matchedProduct) {
                    console.log(`📍 Found potential match: ${matchedProduct.name} (ID: ${matchedProduct.id})`);
                    const detail = await getStoreProductDetail(matchedProduct.id);

                    if (detail) {
                      const sync_variants = detail.sync_variants || [];

                      const firstVariant = sync_variants.find((v) => v.synced) || sync_variants[0];

                      if (firstVariant) {
                        finalVariantId = firstVariant.id;
                      } else {
                        console.warn(`⚠️ Matched product ${matchedProduct.name} has no variants.`);
                      }
                    } else {
                      console.error(`❌ Could not fetch details for matched product ID: ${matchedProduct.id}`);
                    }
                  } else {
                    console.warn(`❌ No match found for "${p.name}" in store products.`);
                  }
                } catch (e) {
                  console.error("Failed emergency recovery fetch:", e);
                }
              }

              // Printful requires either sync_variant_id or variant_id
              if (finalVariantId) {
                item.sync_variant_id = finalVariantId;
              } else {
                console.warn(`⚠️ No variant_id for product: ${p.name}. Order will likely fail Printful validation.`);
              }

              return item;
            }),
          ),
        };

        console.log("📝 Printful Order Payload:", JSON.stringify(printfulOrderData, null, 2));

        try {
          printfulOrder = await createOrder(printfulOrderData);
        } catch (pError) {
          // If order already exists, try to fetch it instead of failing
          if (pError.message.includes("already exists") || pError.message.includes("OR-13")) {
            console.log(
              `🔄 Order ${printfulOrderData.external_id} already exists in Printful. Fetching existing order...`,
            );
            const { getOrderByExternalId } = await import("@/app/lib/printful");
            printfulOrder = await getOrderByExternalId(printfulOrderData.external_id);
          } else {
            throw pError;
          }
        }

        if (printfulOrder && printfulOrder.id) {
          console.log("✅ Printful Order Created:", printfulOrder.id);
          confirmedOrderData.printfulOrderId = printfulOrder.id;
          confirmedOrderData.printfulStatus = printfulOrder.status;
          confirmedOrderData.printfulDashboardUrl = printfulOrder.dashboard_url;

          // Re-save with Printful info
          fs.writeFileSync(filePath, JSON.stringify(confirmedOrderData, null, 2));
        }
      } catch (pError) {
        console.error("❌ Printful Order Creation Failed:");
        console.error("- Message:", pError.message);
        if (pError.response) {
          console.error("- Response:", JSON.stringify(pError.response, null, 2));
        }
        confirmedOrderData.printfulError = pError.message;
        fs.writeFileSync(filePath, JSON.stringify(confirmedOrderData, null, 2));
      }
    } else {
      console.warn("⚠️ Skipping Printful order: PRINTFUL_API_KEY is not set.");
    }

    return NextResponse.json({
      success: true,
      orderId: confirmedOrderData.orderId,
      printfulOrderId: printfulOrder?.id,
      data: confirmedOrderData,
    });
  } catch (error) {
    console.error("Order Confirmation Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
