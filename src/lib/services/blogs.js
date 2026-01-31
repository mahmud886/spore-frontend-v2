import { getBaseUrl } from "./base";

export async function getBlogs() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/scrape/sporelog`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const json = await res.json();
  const posts = json.posts || [];
  return posts.map((post) => ({
    id: post.id || post.slug || `POST_${post.title?.substring(0, 10)?.toUpperCase()?.replace(/\s+/g, "_")}`,
    title: post.title || "Untitled Post",
    excerpt: post.excerpt || post.description || "",
    description: post.description || post.excerpt || "",
    link: post.link || "#",
    image: post.image || "/assets/images/blogs/blog-1.png",
    imageAlt: post.imageAlt || post.title || "Blog post image",
    timestamp: post.timestamp || post.date || "Unknown",
    date: post.date,
    author: post.author,
    categories: post.categories || [],
    tags: post.tags || [],
  }));
}
