import { getBlogs } from "@/app/lib/services/blogs";
import { Suspense } from "react";
import { SectionTitle } from "../shared/SectionTitle";
import ShimmerCard from "../shared/ShimmerCard";
import SporeBlogSection from "../shared/SporeBlogSection";

async function BlogPostsList() {
  const posts = await getBlogs();
  return <SporeBlogSection title="VAULT 7" className="" sectionClassName="" posts={posts} />;
}

function BlogLoading() {
  return (
    <section className="mb-24">
      <SectionTitle>VAULT 7</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[1, 2, 3, 4].map((i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    </section>
  );
}

// This is a Server Component.
// Do not use this inside a Client Component without passing it as a prop/child.
export const BlogSection = () => {
  return (
    <div id="spore-log">
      <Suspense fallback={<BlogLoading />}>
        <BlogPostsList />
      </Suspense>
    </div>
  );
};
