import { createClient } from "@/app/lib/supabase-server";

/**
 * Donation Service
 * Handles database operations for Support Us / Donations
 */

/**
 * Create a new pending donation
 * @param {object} donationData - The donation data
 */
export async function createPendingDonation(donationData) {
  const supabase = await createClient();

  try {
    const { data: donation, error } = await supabase
      .from("supporter_donations")
      .insert({
        donation_number: `DON-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        stripe_session_id: donationData.stripeSessionId,

        supporter_name: donationData.name,
        supporter_email: donationData.email,
        supporter_note: donationData.note,
        mailing_address: donationData.mailingAddress,

        tier_id: donationData.tierId,
        tier_name: donationData.tierName,
        amount: donationData.amount,
        currency: "usd",

        status: "pending",
        payment_status: "unpaid",

        metadata: donationData.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating donation record:", error);
      throw new Error(`Failed to create donation: ${error.message}`);
    }

    return { success: true, donation };
  } catch (error) {
    console.error("createPendingDonation failed:", error);
    // Return null to allow checkout to proceed even if DB save fails
    return { success: false, error: error.message };
  }
}

/**
 * Update donation status to PAID
 * @param {string} sessionId - The Stripe session ID
 * @param {object} session - The full Stripe session object
 */
export async function updateDonationPaymentStatus(sessionId, session) {
  const supabase = await createClient();

  try {
    // 1. Find the donation by session ID
    let { data: donation, error: findError } = await supabase
      .from("supporter_donations")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (findError && findError.code !== "PGRST116") {
      throw findError;
    }

    if (!donation) {
      console.warn(`Donation not found for session ${sessionId}. Creating new record from session.`);

      // Fallback: Create donation from session data if not found
      const { data: newDonation, error: createError } = await supabase
        .from("supporter_donations")
        .insert({
          donation_number: `DON-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          stripe_session_id: sessionId,
          stripe_payment_intent_id: session.payment_intent,

          supporter_name: session.metadata?.supporterName || session.customer_details?.name,
          supporter_email: session.metadata?.customerEmail || session.customer_details?.email, // Metadata key might vary
          supporter_note: session.metadata?.supporterNote,
          mailing_address: session.metadata?.mailingAddress,

          tier_id: session.metadata?.tierId || "unknown",
          tier_name: session.metadata?.tierName || "Unknown Tier",
          amount: session.amount_total / 100,
          currency: session.currency,

          status: "paid",
          payment_status: session.payment_status,

          metadata: session.metadata,
        })
        .select()
        .single();

      if (createError) throw createError;
      return { success: true, donation: newDonation };
    }

    // 2. Update existing donation
    const { data: updatedDonation, error: updateError } = await supabase
      .from("supporter_donations")
      .update({
        status: "paid",
        payment_status: session.payment_status,
        stripe_payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donation.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return { success: true, donation: updatedDonation };
  } catch (error) {
    console.error("updateDonationPaymentStatus failed:", error);
    return { success: false, error: error.message };
  }
}
