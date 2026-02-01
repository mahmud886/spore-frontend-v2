import { createClient } from "@/app/lib/supabase-server";

export async function GET(request) {
  try {
    const supabase = await createClient();

    // Get all secret drops submissions
    const { data, error } = await supabase.from("secret_drops").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch secret drops",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return new Response(
        JSON.stringify({
          error: "Name and email are required fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "Please provide a valid email address",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existingData, error: checkError } = await supabase
      .from("secret_drops")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Supabase check error:", checkError);
      return new Response(
        JSON.stringify({
          error: "Failed to check email availability",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (existingData) {
      return new Response(
        JSON.stringify({
          error: "This email has already been submitted",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Insert the secret drop submission
    const { data, error } = await supabase
      .from("secret_drops")
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message ? message.trim() : null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to submit your information. Please try again.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you for your submission!",
        data: data[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
