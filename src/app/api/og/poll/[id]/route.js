import { createClient } from "@/app/lib/supabase-server";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

export const runtime = "nodejs";
export const revalidate = 300;

const SIZE_MAP = {
  facebook: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 675 },
  linkedin: { width: 1200, height: 627 },
  pinterest: { width: 1000, height: 1500 },
  whatsapp: { width: 800, height: 800 },
  instagram: { width: 1080, height: 1080 },
  tiktok: { width: 1080, height: 1920 },
  default: { width: 1200, height: 630 },
};

async function getPollData(id) {
  try {
    const supabase = await createClient();

    // Fetch poll data
    const { data: poll, error: pollError } = await supabase.from("polls").select("*").eq("id", id).single();

    if (pollError || !poll) return null;

    // Fetch poll options
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", id)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (optionsError) return { ...poll, options: [] };

    return { ...poll, options: options || [] };
  } catch (error) {
    console.error("Error fetching poll:", error);
    return null;
  }
}

export async function GET(req, { params: paramsPromise }) {
  const params = await paramsPromise;
  const { id } = params || {};
  const url = new URL(req.url);
  const size = url.searchParams.get("size") || "facebook";
  const dims = SIZE_MAP[size] || SIZE_MAP.default;

  let poll = null;
  if (id) {
    poll = await getPollData(id);
  }

  // Fallback data if poll not found or minimal
  const options = Array.isArray(poll?.options) ? poll.options : [];
  const totalVotes = options.reduce((s, o) => s + (o.vote_count || o.votes || 0), 0) || 5061;
  const left = options[0] || { name: "EVOLVE", vote_count: 0 };
  const right = options[1] || { name: "RESIST", vote_count: 0 };
  const lVotes = left.vote_count || left.votes || 0;
  const rVotes = right.vote_count || right.votes || 0;
  // If totalVotes is 0, default to 50/50 for display
  const lPct = totalVotes > 0 ? Math.round((lVotes / totalVotes) * 100) : 50;
  const rPct = totalVotes > 0 ? Math.round((rVotes / totalVotes) * 100) : 50;

  // Load assets
  const publicPath = join(process.cwd(), "public");

  const fontPath = join(publicPath, "assets/fonts/mokoto/mokoto.ttf");
  const fontData = await readFile(fontPath);

  const bgPath = join(publicPath, "og-image-bg.jpg");
  const bgBuffer = await readFile(bgPath);
  const bgData = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

  const cardBgPath = join(publicPath, "assets/images/result-background.png");
  const cardBgBuffer = await readFile(cardBgPath);
  const cardBgData = `data:image/png;base64,${cardBgBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Mokoto",
        position: "relative",
        backgroundColor: "black",
      }}
    >
      {/* Background Image */}
      <img
        src={bgData}
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
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          overflow: "hidden",
          backgroundColor: "black",
        }}
      >
        <img
          src={cardBgData}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
          }}
        />
        {/* Dark Overlay for Text Readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
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
          <div style={{ display: "flex", color: "white", fontSize: 20, letterSpacing: "0.05em" }}>#RESISTOREVOLVE</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ width: 800, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
          <span style={{ color: "white", fontSize: 24, letterSpacing: "0.05em" }}>
            {(left.name || "EVOLVE").toUpperCase()}
          </span>
          <span style={{ color: "#C2FF02", fontSize: 24, letterSpacing: "0.05em" }}>
            {(right.name || "RESIST").toUpperCase()}
          </span>
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
              width: `${lPct}%`,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {lPct}%
          </div>
          <div
            style={{
              width: `${rPct}%`,
              background: "#C2FF02",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {rPct}%
          </div>
        </div>
      </div>
    </div>,
    {
      width: dims.width,
      height: dims.height,
      fonts: [
        {
          name: "Mokoto",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
