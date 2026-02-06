"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Carousel from "./Carousel";
import { SectionTitle } from "./SectionTitle";
import ShimmerCard from "./ShimmerCard";

const defaultBlogPosts = [
  {
    image: "/assets/images/blogs/blog-1.png",
    imageAlt: "Mountain path",
    id: "XYZ_#3255AD",
    timestamp: "2 hour ago",
    title: "Patient Zero Identified",
    excerpt:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    link: "#",
  },
  {
    image: "/assets/images/blogs/blog-2.png",
    imageAlt: "Abstract wood rings",
    id: "XYZ_#3255AD",
    timestamp: "2 hour ago",
    title: "Wall Construction",
    excerpt:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    link: "#",
  },
  {
    image: "/assets/images/blogs/blog-3.png",
    imageAlt: "Field landscape",
    id: "CONTAINMENT",
    timestamp: "2 hour ago",
    title: "Multiation Rate",
    excerpt:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    link: "#",
  },
  {
    image: "/assets/images/blogs/blog-1.png",
    imageAlt: "Mutation analysis",
    id: "MUTATION_001",
    timestamp: "4 min ago",
    title: "Mutation Rate",
    excerpt:
      "Surveillance drones have captured footage of the initial contagion site. Containment protocols were... delayed.",
    link: "#",
  },
];

export default function SporeBlogSection({
  posts: propPosts,
  title = "VAULT 7",
  className = "mb-24",
  sectionClassName = "",
  fetchFromAPI = true,
}) {
  const [posts, setPosts] = useState(propPosts || defaultBlogPosts);
  const [loading, setLoading] = useState(fetchFromAPI && !propPosts);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If posts are provided via props, use them
    if (propPosts && propPosts.length > 0) {
      setPosts(propPosts);
      setLoading(false);
      return;
    }

    // If fetchFromAPI is false, use default posts
    if (!fetchFromAPI) {
      setPosts(defaultBlogPosts);
      setLoading(false);
      return;
    }

    // Fetch blog data from scraping API
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/scrape/sporelog");

        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.posts && data.posts.length > 0) {
          // Map scraped data to BlogCard format
          const mappedPosts = data.posts.map((post) => ({
            id: post.id || post.slug || `POST_${post.title?.substring(0, 10).toUpperCase().replace(/\s+/g, "_")}`,
            title: post.title || "Untitled Post",
            excerpt: post.excerpt || post.description || "",
            description: post.description || post.excerpt || "",
            link: post.link || "#",
            image: post.image || "/assets/images/blogs/blog-1.png", // Fallback image
            imageAlt: post.imageAlt || post.title || "Blog post image",
            timestamp: post.timestamp || post.date || "Unknown",
            date: post.date,
            author: post.author,
            categories: post.categories || [],
            tags: post.tags || [],
          }));

          setPosts(mappedPosts);
        } else {
          // If no posts found, use default
          setPosts(defaultBlogPosts);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(err.message);
        // Fallback to default posts on error
        setPosts(defaultBlogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [propPosts, fetchFromAPI]);

  // Show loading state
  if (loading) {
    return (
      <section className={`${className} ${sectionClassName}`}>
        <SectionTitle>{title}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  // Show error state (but still render posts)
  if (error) {
    console.warn("Blog fetch error:", error);
  }

  return (
    <section className={`${className} ${sectionClassName}`}>
      <Carousel
        items={posts}
        renderItem={(post, index) => <BlogCard key={post.id || index} post={post} />}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        titleComponent={<SectionTitle>{title}</SectionTitle>}
      />
    </section>
  );
}
