import { createClient } from "@/app/lib/supabase-server";

/**
 * Order Service
 * Handles database operations for E-commerce Orders
 */

/**
 * Create a new pending order
 * @param {object} orderData - The order data
 * @param {object} items - The items in the order
 * @param {object} customerData - The customer data
 */
export async function createPendingOrder(orderData, items, customerData) {
  const supabase = await createClient();

  try {
    // 1. Create or Update Customer
    const { data: customer, error: customerError } = await supabase
      .from("ecommerce_customers")
      .upsert(
        {
          email: customerData.email,
          name: customerData.name,
          address: customerData.address,
          phone: customerData.phone || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select()
      .single();

    if (customerError) {
      console.error("Error creating/updating customer:", customerError);
      throw new Error(`Failed to create customer: ${customerError.message}`);
    }

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
      .from("ecommerce_orders")
      .insert({
        order_number: orderData.orderId,
        customer_id: customer.id,
        amount_total: orderData.totalAmount,
        currency: orderData.currency || "usd",
        status: "pending",
        payment_status: "unpaid",
        shipping_address: customerData.address,
        metadata: {
          ...orderData.metadata,
          itemsCount: items.length,
        },
        stripe_session_id: orderData.stripeSessionId || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // 3. Create Order Items
    const orderItems = items.map((item) => {
      const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
      return {
        order_id: order.id,
        product_name: item.name,
        product_id: item.id || item.productId,
        variant_id: item.variant_id || item.variantId || null,
        quantity: item.quantity || 1,
        unit_amount: price,
        total_amount: (price * (item.quantity || 1)).toFixed(2),
        image_url: item.image,
        metadata: item.metadata || {},
      };
    });

    const { error: itemsError } = await supabase.from("ecommerce_order_items").insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Depending on requirement, we might want to delete the order here to maintain consistency
      // await supabase.from('ecommerce_orders').delete().eq('id', order.id);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    return { success: true, order, customer };
  } catch (error) {
    console.error("createPendingOrder failed:", error);
    // Return null instead of throwing to allow checkout to proceed even if DB save fails
    return { success: false, error: error.message };
  }
}

/**
 * Create order from Stripe Session (Fallback)
 */
export async function createOrderFromStripeSession(session) {
  const supabase = await createClient();

  try {
    // Extract customer details
    const customerEmail = session.customer_details?.email || session.metadata?.customerEmail;
    const customerName = session.customer_details?.name || session.metadata?.customerName;
    const customerAddress = session.shipping_details?.address || session.customer_details?.address;

    // 1. Create or Update Customer
    const { data: customer, error: customerError } = await supabase
      .from("ecommerce_customers")
      .upsert(
        {
          email: customerEmail,
          name: customerName,
          address: customerAddress,
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select()
      .single();

    if (customerError) throw customerError;

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
      .from("ecommerce_orders")
      .insert({
        order_number: session.metadata?.orderId || `SPORE-${Date.now()}`,
        customer_id: customer.id,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        amount_total: session.amount_total / 100,
        currency: session.currency,
        status: "paid",
        payment_status: session.payment_status,
        shipping_address: session.shipping_details?.address,
        metadata: session.metadata,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Create Order Items (if available in session)
    // Note: line_items must be expanded in the webhook retrieval
    if (session.line_items?.data) {
      const orderItems = session.line_items.data.map((item) => ({
        order_id: order.id,
        product_name: item.description,
        quantity: item.quantity,
        unit_amount: item.price.unit_amount / 100,
        total_amount: (item.amount_total / 100).toFixed(2),
        currency: item.currency,
        stripe_product_id: item.price.product,
      }));

      await supabase.from("ecommerce_order_items").insert(orderItems);
    }

    return { success: true, order };
  } catch (error) {
    console.error("createOrderFromStripeSession failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update order status to PAID
 * @param {string} sessionId - The Stripe session ID
 * @param {object} session - The full Stripe session object
 */
export async function updateOrderPaymentStatus(sessionId, session) {
  const supabase = await createClient();

  try {
    // 1. Find the order by session ID
    let { data: order, error: findError } = await supabase
      .from("ecommerce_orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (!order && session.metadata?.orderId) {
      const { data: orderByNumber } = await supabase
        .from("ecommerce_orders")
        .select("*")
        .eq("order_number", session.metadata.orderId)
        .single();
      if (orderByNumber) order = orderByNumber;
    }

    if (!order) {
      console.warn(`Order not found for session ${sessionId}. Creating new order record from session.`);
      return await createOrderFromStripeSession(session);
    }

    // 2. Update Order
    const { data: updatedOrder, error: updateError } = await supabase
      .from("ecommerce_orders")
      .update({
        status: "paid",
        payment_status: session.payment_status,
        stripe_payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
        stripe_session_id: sessionId, // Ensure this is set if matched by order_number
      })
      .eq("id", order.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("updateOrderPaymentStatus failed:", error);
    return { success: false, error: error.message };
  }
}
