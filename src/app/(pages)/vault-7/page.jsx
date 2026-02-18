import BlogCard from "@/app/components/shared/BlogCard";
import { Wrapper } from "@/app/components/shared/Wrapper";
import { getBlogs } from "@/app/lib/services/supabase-blogs";

export const metadata = {
  title: "Vault 7 | SPORE FALL",
  description: "Access classified logs and character unveils from the Spore universe.",
};

export default async function Vault7Page() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen pt-32 pb-20">
      <Wrapper>
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-heading text-primary mb-4 tracking-wider uppercase glitch-text">
            Vault 7
          </h1>
          <p className="text-white/60 font-mono max-w-2xl mx-auto">
            Classified Archive: Access restricted files, character dossiers, and creator logs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} post={blog} />
          ))}
        </div>
      </Wrapper>
    </main>
  );
}
