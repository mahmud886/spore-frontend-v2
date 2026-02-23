export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og/", "/api/polls/"],
      disallow: ["/api/", "/dashboard/", "/payment/"],
    },
    sitemap: "https://sporefall.com/sitemap.xml",
  };
}
