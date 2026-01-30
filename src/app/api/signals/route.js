import { createClient } from "@/lib/supabase-server";

export async function GET(request) {
  try {
    const supabase = await createClient();

    // Get the latest signal count
    const { data: latestSignal, error: fetchError } = await supabase
      .from("signals_broadcast")
      .select("signal_count, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Supabase fetch error:", fetchError);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch signal data",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Calculate current signal count
    let currentCount;
    if (latestSignal) {
      // Calculate time difference in hours
      const lastUpdate = new Date(latestSignal.created_at);
      const now = new Date();
      const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);

      // Increase by 57 every 2 hours
      const increments = Math.floor(hoursDiff / 2);
      currentCount = latestSignal.signal_count + increments * 57;
    } else {
      // Start with initial count
      currentCount = 10984;
    }

    // If enough time has passed, create new record
    if (!latestSignal || new Date() - new Date(latestSignal.created_at) >= 2 * 60 * 60 * 1000) {
      const { error: insertError } = await supabase.from("signals_broadcast").insert([
        {
          signal_count: currentCount,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        // Don't fail the request if insert fails, just return current count
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        signal_count: currentCount,
        last_updated: latestSignal?.created_at || new Date().toISOString(),
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
    const { signal_count } = await request.json();

    const supabase = await createClient();

    // Insert new signal count
    const { data, error } = await supabase
      .from("signals_broadcast")
      .insert([
        {
          signal_count: signal_count,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to broadcast signals",
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
        message: "Signals broadcasted successfully",
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
