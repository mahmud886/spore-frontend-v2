import { createClient } from "@/lib/supabase-server";
import { readFile } from "fs/promises";
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

    if (!id) {
      return NextResponse.json({ error: "Poll ID is required" }, { status: 400 });
    }

    const pollId = id;

    // Fetch poll data
    const { data: poll, error: pollError } = await supabase.from("polls").select("*").eq("id", pollId).single();

    if (pollError || !poll) {
      return NextResponse.json({ error: "Poll not found", details: pollError?.message }, { status: 404 });
    }

    // Fetch poll options
    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", pollId)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (optionsError) {
      return NextResponse.json({ error: "Failed to fetch options", details: optionsError.message }, { status: 500 });
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
      whatsapp: { width: 800, height: 800 }, // Optimized for mobile messaging
      default: { width: 1200, height: 630 },
    };

    const dimensions = sizes[size] || sizes.default;
    const width = dimensions.width;
    const height = dimensions.height;

    // Layout settings with margins
    const horizontalMargin = width * 0.1; // 10% left and right
    const verticalMargin = height * 0.1; // 10% top and bottom
    const contentWidth = width - horizontalMargin * 2;
    const contentHeight = height - verticalMargin * 2;

    // Calculate positions
    const questionY = verticalMargin + 60;
    const logoY = verticalMargin + contentHeight * 0.25 + 40; // Logo at 25% of content area
    const firstOptionY = verticalMargin + contentHeight * 0.45; // Options at 45% of content area
    const barHeight = 70;
    const columnSpacing = 40; // Space between columns
    const barWidth = (contentWidth - columnSpacing) / 2; // Half width for 2 columns

    // Get poll question and options text
    const pollQuestion = poll.title || poll.question || "THE CITY STANDS DIVIDED";
    const option1Name = (option1.name || option1.text || option1.option_text || "EVOLVE").toUpperCase();
    const option2Name = (option2.name || option2.text || option2.option_text || "RESIST").toUpperCase();

    // Truncate question if too long
    const maxQuestionLength = 60;
    const displayQuestion =
      pollQuestion.length > maxQuestionLength ? pollQuestion.substring(0, maxQuestionLength) + "..." : pollQuestion;

    // Read the font file and convert it to a data URI
    let fontDataUri = "";
    try {
      const publicPath = join(process.cwd(), "public");
      const fontPath = join(publicPath, "assets/fonts/mokoto/mokoto.ttf");

      // Try to read the font file
      const fontBuffer = await readFile(fontPath);

      // For file size optimization, we'll only embed the font if it's small enough
      // Limit the font to 50KB to help keep total size under 300KB
      if (fontBuffer.length <= 50000) {
        // Convert buffer to base64
        const base64Font = fontBuffer.toString("base64");

        fontDataUri = `data:font/ttf;base64,${base64Font}`;
      }
    } catch (error) {
      console.error("Mokoto font not found or could not be read:", error.message);
      // Font won't be embedded if not found
      fontDataUri = "";
    }

    // Create SVG for options
    const optionBars = [];

    // First option (left - RESIST)
    optionBars.push(`
      <g>
        <!-- Tool label on top of bar -->
        <text x="${horizontalMargin + barWidth / 2}" y="${firstOptionY - 15}" font-size="26" font-weight="700" fill="#C2FF02" text-anchor="middle" dominant-baseline="middle" font-family="Mokoto, Arial, sans-serif">${option1Name}</text>

        <!-- Background bar (semi-transparent dark) -->
        <rect x="${horizontalMargin}" y="${firstOptionY}" width="${barWidth}" height="${barHeight}" rx="12" fill="rgba(26, 26, 46, 0.8)"/>

        <!-- Colored bar showing percentage -->
        <rect x="${horizontalMargin}" y="${firstOptionY}" width="${(barWidth * percentage1) / 100}" height="${barHeight}" rx="12" fill="#C2FF02"/>

        <!-- Percentage and votes (below the bar) -->
        <text x="${horizontalMargin + barWidth / 2}" y="${firstOptionY + barHeight + 25}" font-size="24" font-weight="600" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" font-family="Mokoto, Arial, sans-serif">${percentage1}% · ${votes1} ${votes1 === 1 ? "vote" : "votes"}</text>
      </g>
    `);

    // Second option (right - EVOLVE)
    optionBars.push(`
      <g>
        <!-- Tool label on top of bar -->
        <text x="${horizontalMargin + barWidth + columnSpacing + barWidth / 2}" y="${firstOptionY - 15}" font-size="26" font-weight="700" fill="#00BFFF" text-anchor="middle" dominant-baseline="middle" font-family="Mokoto, Arial, sans-serif">${option2Name}</text>

        <!-- Background bar (semi-transparent dark) -->
        <rect x="${horizontalMargin + barWidth + columnSpacing}" y="${firstOptionY}" width="${barWidth}" height="${barHeight}" rx="12" fill="rgba(26, 26, 46, 0.8)"/>

        <!-- Colored bar showing percentage -->
        <rect x="${horizontalMargin + barWidth + columnSpacing}" y="${firstOptionY}" width="${(barWidth * percentage2) / 100}" height="${barHeight}" rx="12" fill="#00BFFF"/>

        <!-- Percentage and votes (below the bar) -->
        <text x="${horizontalMargin + barWidth + columnSpacing + barWidth / 2}" y="${firstOptionY + barHeight + 25}" font-size="24" font-weight="600" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" font-family="Mokoto, Arial, sans-serif">${percentage2}% · ${votes2} ${votes2 === 1 ? "vote" : "votes"}</text>
      </g>
    `);

    // Read and resize the background image to reduce file size
    let backgroundImageDataUri = "";
    try {
      const publicPath = join(process.cwd(), "public");
      const imagePath = join(publicPath, "og-image-bg.png");

      // Read the image file
      const imageBuffer = await readFile(imagePath);

      // Resize and heavily compress the image using sharp
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(Math.floor(width / 3), Math.floor(height / 3), { fit: "cover", withoutEnlargement: true }) // Further reduce size
        .png({
          quality: 15, // Even lower quality to reduce file size
          compressionLevel: 9, // Maximum compression
          palette: true, // Use palette mode for smaller file size
          effort: 10, // Maximum compression effort
        })
        .toBuffer();

      // Convert to base64
      const base64Image = resizedImageBuffer.toString("base64");

      backgroundImageDataUri = `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.error("Background image not found or could not be processed:", error.message);
      // Fallback to a solid background if image is not available
      backgroundImageDataUri = "";
    }

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${
          backgroundImageDataUri
            ? `
        <!-- Background Image -->
        <defs>
          <pattern id="bgPattern" x="0" y="0" width="${width}" height="${height}" patternUnits="userSpaceOnUse">
            <image href="${backgroundImageDataUri}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgPattern)"/>
        `
            : `
        <!-- Fallback Background Gradient -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
        `
        }

        ${
          fontDataUri
            ? `
        <!-- Font Definition -->
        <style type="text/css"><![CDATA[
          @font-face {
            font-family: 'Mokoto';
            src: url('${fontDataUri}') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        ]]></style>
        `
            : ""
        }

        <!-- Overlay gradient for better text readability -->
        <defs>
          <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#000000;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0.5" />
          </linearGradient>
        </defs>

        <!-- Overlay for better contrast -->
        <rect width="${width}" height="${height}" fill="url(#overlayGradient)"/>

        <!-- Question at top (center aligned) -->
        <text x="${width / 2}" y="${questionY}" font-size="38" font-weight="700" fill="#C2FF02" text-anchor="middle" font-family="Mokoto, Arial, sans-serif">
          ${displayQuestion}
        </text>

        <!-- Logo in middle (center aligned) -->
        <text x="${width / 2}" y="${logoY}" font-size="72" text-anchor="middle" font-family="Mokoto, Arial, sans-serif" fill="#C2FF02">
          📊
        </text>

        <!-- Option bars (center aligned) -->
        <g font-family="Mokoto, Arial, sans-serif">
          ${optionBars.join("")}
        </g>

        <!-- Total Votes -->
        <text x="${width / 2}" y="${height - verticalMargin - 110}" font-size="32" font-weight="700" fill="#FFFFFF" text-anchor="middle" font-family="Mokoto, Arial, sans-serif">Total Votes: ${totalVotes}</text>

        <!-- Vote text -->
        <text x="${width / 2}" y="${height - verticalMargin - 60}" font-size="34" font-weight="700" fill="#FFFFFF" text-anchor="middle" font-family="Mokoto, Arial, sans-serif">#RESISTOREVOLVE</text>

        <!-- Poll Application -->
        <text x="${width / 2}" y="${height - verticalMargin - 10}" font-size="30" font-weight="600" fill="#E5E7EB" text-anchor="middle" font-family="Mokoto, Arial, sans-serif">SPOREFALL.COM</text>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("Error generating poll image:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return new Response(
      `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
         <rect width="1200" height="630" fill="#000"/>
         <text x="600" y="315" font-size="32" font-family="Arial" fill="#C2FF02" text-anchor="middle" alignment-baseline="middle">
           Error: ${error.message}
         </text>
       </svg>`,
      {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  }
}
