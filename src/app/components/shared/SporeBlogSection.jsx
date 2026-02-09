"use client";

import BlogCard from "./BlogCard";
import Carousel from "./Carousel";
import { SectionTitle } from "./SectionTitle";

export default function SporeBlogSection({
  posts = [],
  title = "VAULT 7",
  className = "mb-24",
  sectionClassName = "",
}) {
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
