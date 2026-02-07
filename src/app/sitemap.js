import { getBaseUrl } from "@/app/lib/services/base";

export default async function sitemap() {
  const base = getBaseUrl();

  const routes = ["", "/support-us", "/partnerships", "/result"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}
