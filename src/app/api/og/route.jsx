import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "SPORE FALL").toUpperCase();
  const subtitle =
    searchParams.get("subtitle") ||
    "A deadly pathogen threatens to overrun the nation city of Lionara. Join the resistance or embrace the evolution.";

  try {
    const publicPath = join(process.cwd(), "public");

    // Read font
    const fontPath = join(publicPath, "assets/fonts/mokoto/mokoto.ttf");
    const fontData = await readFile(fontPath);

    // Read background image and convert to base64 for ImageResponse
    const bgPath = join(publicPath, "og-image-bg.jpg");
    const bgBuffer = await readFile(bgPath);
    const bgBase64 = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

    const width = 1200;
    const height = 630;

    // Use ImageResponse to generate the SVG/PNG with correct fonts
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
          backgroundSize: "1200px 630px",
          backgroundPosition: "center",
          position: "relative",
          fontFamily: "Mokoto, sans-serif",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(5, 5, 5, 0.6)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "white",
              marginBottom: 20,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 34,
              color: "#d4ff00",
              lineHeight: 1.4,
              maxWidth: "900px",
              fontFamily: "sans-serif", // Subtitle in sans-serif for better readability
            }}
          >
            {subtitle}
          </p>

          <div
            style={{
              marginTop: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 28,
                color: "white",
                opacity: 0.9,
                marginBottom: 20,
                fontFamily: "sans-serif",
              }}
            >
              SPOREFALL.COM
            </span>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 160, height: 8, backgroundColor: "#d4ff00" }} />
              <div style={{ width: 48, height: 8, backgroundColor: "white" }} />
            </div>
          </div>
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

    // Get the PNG buffer from ImageResponse
    const pngBuffer = await imageResponse.arrayBuffer();

    // Convert to optimized JPEG using sharp
    const optimizedJpeg = await sharp(Buffer.from(pngBuffer))
      .jpeg({
        quality: 85,
        mozjpeg: true,
      })
      .toBuffer();

    return new Response(optimizedJpeg, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("OG generation error:", error);
    return new Response(`Error generating image: ${error.message}`, { status: 500 });
  }
}
