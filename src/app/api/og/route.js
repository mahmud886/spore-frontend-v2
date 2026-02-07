import { readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "SPORE FALL").toUpperCase();
  const subtitle =
    searchParams.get("subtitle") || "The city of Lionara is quarantined. A spore is rewriting human fate.";

  try {
    const publicPath = join(process.cwd(), "public");
    const bgPath = join(publicPath, "og-image-bg.jpg");

    const bgBuffer = await readFile(bgPath);

    // Create SVG overlay for text
    const width = 1200;
    const height = 630;

    // Simple word wrap for subtitle
    const words = subtitle.split(" ");
    let line1 = "";
    let line2 = "";
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + word).length < 50) {
        currentLine += word + " ";
      } else if (!line1) {
        line1 = currentLine.trim();
        currentLine = word + " ";
      } else {
        line2 = currentLine.trim();
        currentLine = word + " ";
      }
    }
    if (!line1) line1 = currentLine.trim();
    else if (!line2) line2 = currentLine.trim();

    const svgOverlay = Buffer.from(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <style>
          .title { fill: white; font-size: 80px; font-weight: bold; font-family: sans-serif; text-transform: uppercase; }
          .subtitle { fill: #d4ff00; font-size: 34px; font-family: sans-serif; }
          .domain { fill: white; font-size: 28px; font-family: sans-serif; opacity: 0.9; }
        </style>

        <rect width="100%" height="100%" fill="rgba(5, 5, 5, 0.6)" />

        <text x="50%" y="280" text-anchor="middle" class="title">${title}</text>
        <text x="50%" y="340" text-anchor="middle" class="subtitle">${line1}</text>
        ${line2 ? `<text x="50%" y="385" text-anchor="middle" class="subtitle">${line2}</text>` : ""}

        <text x="50%" y="480" text-anchor="middle" class="domain">sporefall.com</text>

        <!-- Decorative bars -->
        <rect x="420" y="510" width="160" height="8" fill="#d4ff00" />
        <rect x="590" y="510" width="48" height="8" fill="white" />
      </svg>
    `);

    const image = await sharp(bgBuffer)
      .resize(width, height)
      .composite([{ input: svgOverlay, top: 0, left: 0 }])
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    return new Response(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("OG generation error:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
