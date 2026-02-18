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

    // Read card background image
    const cardBgPath = join(publicPath, "assets/images/result-background.png");
    const cardBgBuffer = await readFile(cardBgPath);
    const cardBgBase64 = `data:image/png;base64,${cardBgBuffer.toString("base64")}`;

    const imageResponse = new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Mokoto, sans-serif",
          position: "relative",
          backgroundColor: "black",
        }}
      >
        {/* Background Image */}
        <img
          src={bgBase64}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        />

        {/* Top Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20,
            color: "#C2FF02",
            fontSize: 22,
            lineHeight: 1.5,
            letterSpacing: "0.05em",
            textShadow: "0 0 10px rgba(0,0,0,0.8)",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          <div>A DEADLY PATHOGEN THREATENS TO OVERRUN THE</div>
          <div>NATION CITY OF LIONARA. JOIN THE RESISTANCE</div>
          <div>OR EMBRACE THE EVOLUTION.</div>
        </div>

        {/* Central Card */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 800,
            height: 400,
            marginBottom: 30,
            overflow: "hidden",
          }}
        >
          {/* Dark Overlay for Text Readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: "20px 0",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", color: "white", fontSize: 20, letterSpacing: "0.05em" }}>
              TOTAL VOTES: {totalVotes.toLocaleString()}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#C2FF02",
                fontSize: 60,
                lineHeight: 0.85,
                textShadow: "0 0 30px rgba(194,255,2,0.5)",
              }}
            >
              <span>SPORE</span>
              <span>FALL</span>
            </div>
            <div style={{ display: "flex", color: "white", fontSize: 20, letterSpacing: "0.05em" }}>
              #RESISTOREVOLVE
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ width: 800, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
            <span style={{ color: "white", fontSize: 24, letterSpacing: "0.05em" }}>{option1Name}</span>
            <span style={{ color: "#C2FF02", fontSize: 24, letterSpacing: "0.05em" }}>{option2Name}</span>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 40,
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                width: `${percentage1}%`,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {percentage1}%
            </div>
            <div
              style={{
                width: `${percentage2}%`,
                background: "#C2FF02",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {percentage2}%
            </div>
          </div>
        </div>
      </div>,
      {
        width: width,
        height: height,
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
