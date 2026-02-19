import { createClient } from "@/app/lib/supabase-server";

export async function getBlogs() {
  const supabase = await createClient();

  const { data: blogs, error } = await supabase.from("blogs").select("*").order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }

  return blogs.map((blog) => {
    const date = blog.published_at || blog.created_at;
    return {
      ...blog,
      // Map fields for compatibility with UI components
      description: blog.excerpt,
      image: blog.cover_image,
      imageAlt: blog.title,
      timestamp: date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Unknown Date",
      link: `/vault-7/${blog.slug}`,
      // Ensure id is a string
      id: blog.id.toString(),
    };
  });
}

export async function getBlogBySlug(slug) {
  const supabase = await createClient();

  const { data: blog, error } = await supabase.from("blogs").select("*").eq("slug", slug).single();

  if (error) {
    // Don't log error if it's just not found (PGRST116)
    if (error.code !== "PGRST116") {
      console.error(`Error fetching blog with slug ${slug}:`, error);
    }
    return null;
  }

  const date = blog.published_at || blog.created_at;

  return {
    ...blog,
    content: blog.content,
    description: blog.excerpt,
    image: blog.cover_image,
    imageAlt: blog.title,
    timestamp: date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown Date",
    link: `/vault-7/${blog.slug}`,
  };
}
