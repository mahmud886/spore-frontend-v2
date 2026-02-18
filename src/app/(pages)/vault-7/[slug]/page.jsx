import { Wrapper } from "@/app/components/shared/Wrapper";
import { getBlogBySlug } from "@/app/lib/services/supabase-blogs";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShare from "./BlogShare";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: "Not Found | SPORE FALL" };

  const title = `${blog.title} | Vault 7`;
  const description = blog.excerpt || blog.title;
  const url = `/vault-7/${slug}`;
  const images = blog.cover_image
    ? [
        {
          url: blog.cover_image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ]
    : ["/api/og"];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: blog.published_at,
      authors: [blog.author || "SPORE FALL"],
      tags: blog.tags || [],
      images,
      siteName: "SPORE FALL",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return notFound();

  return (
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      </div>

      <Wrapper>
        {/* Back Button */}
        <Link
          href="/vault-7"
          className="inline-flex items-center gap-2 text-primary/80 hover:text-primary transition-colors mb-8 font-mono text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO VAULT 7</span>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 border-b border-white/10 pb-12 relative">
            <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/40 mb-6 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {new Date(blog.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="flex items-center gap-2 text-primary">
                <User size={14} />
                {blog.author || "SPORE FALL"}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading mb-8 leading-tight glitch-text">
              {blog.title}
            </h1>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono uppercase tracking-widest text-white/60 hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {blog.cover_image && (
            <div className="mb-12 relative rounded-2xl overflow-hidden border border-white/10 group">
              <div className="aspect-[21/9] relative">
                <Image
                  src={blog.cover_image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-primary/50" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-primary/50" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {/*
              Render content with line breaks preserved.
              Since the content is plain text with newlines, we can split by newline
              and render paragraphs, or use whitespace-pre-wrap style.
            */}
            <div className="font-body text-white/80 leading-relaxed whitespace-pre-wrap space-y-6">{blog.content}</div>
          </div>

          {/* Footer / Share / Navigation */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <h3 className="text-xl font-heading mb-4 text-primary">Join the Discussion</h3>
              <p className="text-white/60 mb-6 font-body">
                Share your thoughts on the Spore protocol and connect with other survivors.
              </p>
              <div className="flex justify-center gap-4">
                <BlogShare title={blog.title} slug={blog.slug} coverImage={blog.cover_image} />
              </div>
            </div>
          </div>
        </article>
      </Wrapper>
    </main>
  );
}
