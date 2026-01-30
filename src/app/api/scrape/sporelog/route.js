import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const url = "https://edenstone.group/sporelog";

    // console.log("🔍 Fetching blog data from:", url);

    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    // console.log("✅ HTML fetched, length:", html.length);

    // Load HTML into cheerio
    const $ = cheerio.load(html);
    const blogPosts = [];

    // Based on the fetched content, the blog posts appear to be in a specific structure
    // Look for blog post entries - they seem to have links to /sporelog/[slug]
    const postLinks = $('a[href*="/sporelog/"]').filter((i, elem) => {
      const href = $(elem).attr("href");
      // Filter out category/tag/author/comment links and only get actual post links
      return (
        href &&
        !href.includes("/category/") &&
        !href.includes("/tag/") &&
        !href.includes("?author=") &&
        !href.includes("#comments-") &&
        !href.includes("#") &&
        href !== "/sporelog" &&
        href !== "/sporelog/" &&
        // Only include links that look like post slugs (not comment anchors)
        /^\/sporelog\/[^#\?]+$/.test(href)
      );
    });

    // console.log(`📝 Found ${postLinks.length} potential blog post links...`);

    // Group links by their base URL (without hash) to avoid duplicates
    // Each post should have one main entry
    const postContainers = new Map();

    postLinks.each((i, elem) => {
      const $link = $(elem);
      const href = $link.attr("href");
      const linkText = $link.text().trim();

      // Skip if link text is "Comment", "Read More", or other non-title text
      if (linkText.match(/^(Comment|Read More|by)$/i) || linkText.length < 10) {
        return; // Skip this link
      }

      // Get base URL without hash
      const baseHref = href.split("#")[0];

      // Find the closest container that likely holds all post data
      let $parent = $link.closest("div, article, section, li, p");

      // If parent is too small, go up more levels
      if ($parent.length > 0 && $parent.text().trim().length < 100) {
        $parent = $parent.parent();
      }

      // Only process if we have a meaningful title (not "Comment", "Read More", etc.)
      if (linkText && linkText.length > 10 && !linkText.match(/^(Comment|Read More|by|spore)$/i)) {
        // If we already have this post, check if this link has a better title
        if (postContainers.has(baseHref)) {
          const existing = postContainers.get(baseHref);
          // If existing title is short or looks like metadata, replace it
          if (existing.title.length < linkText.length && !existing.title.match(/^(Comment|Read More|by|spore)$/i)) {
            // Keep existing if it's better
            return;
          }
        }

        postContainers.set(baseHref, {
          link: baseHref, // Store base href without hash
          $container: $parent.length > 0 ? $parent : $link.parent(),
          $link: $link,
          title: linkText,
        });
      }
    });

    // console.log(`📄 Processing ${postContainers.size} unique blog posts...`);

    // Extract data from each post container
    postContainers.forEach((postInfo, baseHref) => {
      const $container = postInfo.$container;
      const $link = postInfo.$link;

      // Extract title - prioritize the link we identified as the main title link
      let title = $link.text().trim();

      // If link text is too short or looks like metadata, try other sources
      if (!title || title.length < 10 || title.match(/^(Comment|Read More|by|spore)$/i)) {
        // Try to find the actual post title link (usually the longest/most substantial link)
        let bestTitle = "";
        let bestTitleLength = 0;

        $container.find('a[href*="/sporelog/"]').each((i, linkElem) => {
          const linkText = $(linkElem).text().trim();
          const linkHref = $(linkElem).attr("href") || "";

          // Skip comment links and metadata links
          if (
            linkText &&
            linkText.length > bestTitleLength &&
            !linkText.match(/^(Comment|Read More|by|spore)$/i) &&
            !linkHref.includes("#comments-")
          ) {
            bestTitle = linkText;
            bestTitleLength = linkText.length;
          }
        });

        if (bestTitle) {
          title = bestTitle;
        } else {
          // If still no good title, try headings
          title = $container.find("h1, h2, h3, h4, h5, h6").first().text().trim();
        }

        // Fallback to postInfo.title
        if (!title || title.length < 10) {
          title = postInfo.title;
        }
      }

      // Clean title - remove extra whitespace and HTML entities
      if (title) {
        title = title.replace(/\s+/g, " ").trim();
        // Decode HTML entities
        title = title
          .replace(/&mdash;/g, "—")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&");
      }

      // Extract link/URL - use baseHref (already cleaned)
      const fullLink = baseHref.startsWith("http") ? baseHref : `https://edenstone.group${baseHref}`;

      // Extract excerpt/description - look for paragraph after title
      let excerpt = "";
      // Find the first substantial paragraph (not metadata)
      $container.find("p").each((i, p) => {
        const text = $(p).text().trim();
        // Skip if it's too short, looks like metadata, or is "Read More"
        if (
          text.length > 50 &&
          !text.match(
            /^(Read More|Comment|spore|by|September|October|November|December|January|February|March|April|May|June|July|August)/i,
          ) &&
          !text.match(/^\d{4}/) &&
          !text.includes("Read More") &&
          !text.match(/^[a-z]+\s+[A-Z]/) && // Skip author names like "Joel September"
          !text.match(/^[a-z]+$/i)
        ) {
          // Skip single words
          excerpt = text;
          return false; // break
        }
      });

      // If no excerpt found, try other selectors
      if (!excerpt) {
        excerpt =
          $container.find("[class*='excerpt']").text().trim() ||
          $container.find("[class*='description']").text().trim() ||
          "";
      }

      // Clean excerpt - decode HTML entities
      excerpt = excerpt
        .replace(/\s+/g, " ")
        .replace(/&mdash;/g, "—")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&hellip;/g, "...")
        .trim()
        .substring(0, 300);

      // Extract date - look for date patterns in the container
      const containerText = $container.text();
      const dateMatch =
        containerText.match(
          /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i,
        ) ||
        containerText.match(/\d{4}-\d{2}-\d{2}/) ||
        containerText.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
      const date = dateMatch ? dateMatch[0] : null;

      // Extract author - look for author links or text
      let author =
        $container.find('a[href*="?author="]').text().trim() ||
        $container.find("[class*='author']").text().trim() ||
        null;

      if (author) {
        author = author.replace(/^by\s+/i, "").trim();
      }

      // Extract image - look for images in the container
      let image = $container.find("img").first().attr("src") || $container.find("img").first().attr("data-src") || null;

      const fullImage = image
        ? image.startsWith("http")
          ? image
          : `https://edenstone.group${image.startsWith("/") ? image : `/${image}`}`
        : null;

      // Extract categories/tags
      const categories = [];
      const tags = [];

      // Get categories
      $container.find('a[href*="/category/"]').each((i, elem) => {
        const category = $(elem).text().trim();
        if (category && !categories.includes(category)) {
          categories.push(category);
        }
      });

      // Get tags
      $container.find('a[href*="/tag/"]').each((i, elem) => {
        const tag = $(elem).text().trim();
        if (tag && !tags.includes(tag)) {
          tags.push(tag);
        }
      });

      // Extract ID or slug from link - baseHref is already clean
      const slug = baseHref.split("/").filter(Boolean).pop() || `post-${blogPosts.length + 1}`;

      // Only add if we have a valid title (not "Comment", "Read More", etc.)
      // Also ensure we have either a title or excerpt (at least some content)
      if (
        title &&
        title.length > 10 &&
        !title.match(/^(Comment|Read More|by|spore)$/i) &&
        !baseHref.includes("#comments-") &&
        (excerpt.length > 20 || title.length > 15)
      ) {
        // Must have substantial content
        // Clean the link to remove hash fragments
        const cleanLink = fullLink.split("#")[0];

        const blogPost = {
          id: slug,
          title: title,
          link: cleanLink, // Use clean link without hash
          excerpt: excerpt,
          description: excerpt, // Alias for compatibility
          date: date,
          author: author,
          image: fullImage,
          imageAlt: title, // Use title as alt text
          categories: categories,
          tags: tags,
          timestamp: date || "Unknown",
          // Additional metadata
          slug: slug,
          source: "edenstone.group",
          scrapedAt: new Date().toISOString(),
        };

        blogPosts.push(blogPost);

        // console.log(`\n📄 Post ${blogPosts.length}:`);
        // console.log("  ID:", blogPost.id);
        // console.log("  Title:", blogPost.title);
        // console.log("  Link:", blogPost.link);
        // console.log("  Date:", blogPost.date);
        // console.log("  Author:", blogPost.author);
        // console.log("  Categories:", blogPost.categories);
        // console.log("  Tags:", blogPost.tags);
        // console.log("  Image:", blogPost.image);
        // console.log("  Excerpt:", blogPost.excerpt.substring(0, 100) + (blogPost.excerpt.length > 100 ? "..." : ""));
      }
    });

    // console.log("\n📊 Scraping Summary:");
    // console.log("Total posts found:", blogPosts.length);
    // console.log("\n📋 Full Posts Data (JSON):");
    // console.log(JSON.stringify(blogPosts, null, 2));

    // Also log individual post details
    // console.log("\n📝 Individual Post Details:");
    // blogPosts.forEach((post, index) => {
    // console.log(`\n--- Post ${index + 1} ---`);
    // console.log("ID:", post.id);
    // console.log("Slug:", post.slug);
    // console.log("Title:", post.title);
    // console.log("Link:", post.link);
    // console.log("Date:", post.date);
    // console.log("Author:", post.author);
    // console.log("Categories:", post.categories);
    // console.log("Tags:", post.tags);
    // console.log("Image:", post.image);
    // console.log("Excerpt:", post.excerpt);
    // });

    return NextResponse.json({
      success: true,
      url: url,
      totalPosts: blogPosts.length,
      posts: blogPosts,
      scrapedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error scraping blog data:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
