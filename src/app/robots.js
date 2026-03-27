export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/payment/"],
    },
    sitemap: "https://sporefall.com/sitemap.xml",
  };
}
