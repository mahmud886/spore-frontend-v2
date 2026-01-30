import { getBlogs } from "@/lib/services/blogs";
import { getEpisodes } from "@/lib/services/episodes";
import HomePage from "./components/home/HomePage";

export const revalidate = 60;

export default async function Home() {
  const [episodes, blogPosts] = await Promise.all([getEpisodes({ limit: 100, offset: 0 }), getBlogs()]);
  return <HomePage episodes={episodes} blogPosts={blogPosts} />;
}
