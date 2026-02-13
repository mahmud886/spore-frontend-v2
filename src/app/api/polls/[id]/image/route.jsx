import { createClient } from "@/app/lib/supabase-server";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { join } from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const size = searchParams.get("size") || "facebook";
    const format = (searchParams.get("format") || "jpg").toLowerCase();

    if (!id) {
      return NextResponse.json({ error: "Poll ID is required" }, { status: 400 });
    }

    const pollId = id;

    // Fetch poll data
    let { data: poll, error: pollError } = await supabase.from("polls").select("*").eq("id", pollId).single();

    // Handle "default" or not found polls gracefully
    if ((pollError || !poll) && pollId === "default") {
      poll = {
        title: "SPORE FALL",
        question: "JOIN THE RESISTANCE",
      };
    } else if (pollError || !poll) {
      return NextResponse.json({ error: "Poll not found", details: pollError?.message }, { status: 404 });
    }

    // Fetch poll options
    let { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", pollId)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (optionsError && pollId !== "default") {
      return NextResponse.json({ error: "Failed to fetch options", details: optionsError.message }, { status: 500 });
    }

    // Default options if none found or "default" id
    if (!options || options.length === 0) {
      options = [
        { name: "EVOLVE", vote_count: 50 },
        { name: "RESIST", vote_count: 50 },
      ];
    }

    // Calculate percentages
    const totalVotes = (options || []).reduce((sum, opt) => sum + (opt.vote_count || 0), 0);
    const option1 = options?.[0] || { name: "EVOLVE", vote_count: 0 };
    const option2 = options?.[1] || { name: "RESIST", vote_count: 0 };
    const votes1 = option1.vote_count || 0;
    const votes2 = option2.vote_count || 0;
    const percentage1 = totalVotes > 0 ? Math.round((votes1 / totalVotes) * 100) : 50;
    const percentage2 = totalVotes > 0 ? Math.round((votes2 / totalVotes) * 100) : 50;

    // Define sizes for different platforms
    const sizes = {
      facebook: { width: 1200, height: 630 },
      twitter: { width: 1200, height: 675 },
      instagram: { width: 1080, height: 1080 },
      tiktok: { width: 1080, height: 1920 },
      linkedin: { width: 1200, height: 627 },
      pinterest: { width: 1000, height: 1500 },
      whatsapp: { width: 800, height: 800 },
      default: { width: 1200, height: 630 },
    };

    const dimensions = sizes[size] || sizes.default;
    const width = dimensions.width;
    const height = dimensions.height;

    // Get poll question and options text
    const pollQuestion = (poll.title || poll.question || "THE CITY STANDS DIVIDED").toUpperCase();
    const option1Name = (option1.name || option1.text || option1.option_text || "EVOLVE").toUpperCase();
    const option2Name = (option2.name || option2.text || option2.option_text || "RESIST").toUpperCase();

    // Read the font file
    const publicPath = join(process.cwd(), "public");
    const fontPath = join(publicPath, "assets/fonts/mokoto/mokoto.ttf");
    const fontData = await readFile(fontPath);

    // Read background image and convert to base64
    const bgPath = join(publicPath, "og-image-bg.jpg");
    const bgBuffer = await readFile(bgPath);
    const bgBase64 = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

    const imageResponse = new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
          backgroundImage: `url(${bgBase64})`,
          backgroundSize: `${width}px ${height}px`,
          backgroundPosition: "center",
          position: "relative",
          fontFamily: "Mokoto, sans-serif",
          padding: "40px 20%",
        }}
      >
        {/* Dark overlay gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))",
            display: "flex",
          }}
        />

        {/* Question */}
        <h2
          style={{
            fontSize: 38,
            fontWeight: "bold",
            color: "#C2FF02",
            textAlign: "center",
            marginBottom: 60,
            zIndex: 10,
            maxWidth: "100%",
            letterSpacing: "0.05em",
          }}
        >
          {pollQuestion}
        </h2>

        {/* Options Container */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            gap: 40,
            zIndex: 10,
            marginBottom: 40,
          }}
        >
          {/* Option 1 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <span style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "bold", marginBottom: 15 }}>{option1Name}</span>
            <div
              style={{
                width: "100%",
                height: 70,
                backgroundColor: "rgba(26, 26, 46, 0.8)",
                borderRadius: 12,
                display: "flex",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percentage1}%`,
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                }}
              />
            </div>
            <span style={{ color: "white", fontSize: 24, fontWeight: "bold", marginTop: 15 }}>
              {percentage1}% · {votes1} {votes1 === 1 ? "vote" : "votes"}
            </span>
          </div>

          {/* Option 2 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <span style={{ color: "#C2FF02", fontSize: 26, fontWeight: "bold", marginBottom: 15 }}>{option2Name}</span>
            <div
              style={{
                width: "100%",
                height: 70,
                backgroundColor: "rgba(26, 26, 46, 0.8)",
                borderRadius: 12,
                display: "flex",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percentage2}%`,
                  height: "100%",
                  backgroundColor: "#C2FF02",
                  borderRadius: 12,
                }}
              />
            </div>
            <span style={{ color: "white", fontSize: 24, fontWeight: "bold", marginTop: 15 }}>
              {percentage2}% · {votes2} {votes2 === 1 ? "vote" : "votes"}
            </span>
          </div>
        </div>

        {/* Bottom Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
            marginTop: "auto",
          }}
        >
          <span style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>
            Total Votes: {totalVotes}
          </span>
          <span style={{ color: "white", fontSize: 34, fontWeight: "bold", marginBottom: 15 }}>#RESISTOREVOLVE</span>
          <span style={{ color: "#E5E7EB", fontSize: 30, fontWeight: "bold" }}>SPOREFALL.COM</span>
        </div>
      </div>,
      {
        width,
        height,
        fonts: [
          {
            name: "Mokoto",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );

    const pngBuffer = await imageResponse.arrayBuffer();

    if (format === "png") {
      return new Response(pngBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    // Default to JPEG for weight optimization
    const jpegBuffer = await sharp(Buffer.from(pngBuffer))
      .jpeg({
        quality: 80,
        mozjpeg: true,
      })
      .toBuffer();

    return new Response(jpegBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error generating poll image:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
