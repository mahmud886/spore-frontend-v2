"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedCard } from "./AnimatedWrapper";

export default function BlogCard({ post }) {
  const { image, imageAlt, id, timestamp, title, excerpt, description, link } = post;
  const content = excerpt || description;

  return (
    <AnimatedCard hoverGlow={true} hoverFloat={true} className="h-full">
      <Link href={link || "#"} target="_blank" className="block h-full">
        <article
          className="bg-black/50 border border-primary/10 hover:border-primary/50 transition-all overflow-hidden h-full cyber-energy-wave"
          style={{
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        >
          {image && image !== "#" ? (
            <Image
              alt={imageAlt || title}
              className="w-full h-48 object-cover grayscale hover:grayscale-0 transition duration-500"
              src={image}
              width={400}
              height={192}
              unoptimized
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
              <span className="text-primary/50 text-xs uppercase font-mono">No Image</span>
            </div>
          )}
          <div className="p-6">
            <div className="flex justify-between text-[9px] text-white/40 uppercase font-mono mb-3">
              <span>{id}</span>
              <span>{timestamp}</span>
            </div>
            <h3 className="text-lg font-bold uppercase mb-3 h-14 line-clamp-2">{title}</h3>
            <p className="text-xs text-white/50 leading-relaxed mb-6 h-28 line-clamp-5">{content}</p>
            <button className="text-[10px] cursor-pointer text-primary font-bold uppercase hover:underline">
              Read Log
            </button>
          </div>
        </article>
      </Link>
    </AnimatedCard>
  );
}
