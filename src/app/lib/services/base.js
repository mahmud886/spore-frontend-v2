export function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.VERCEL_URL;
  if (envUrl) {
    const hasProtocol = envUrl.startsWith("http://") || envUrl.startsWith("https://");
    return hasProtocol ? envUrl : `https://${envUrl}`;
  }
  return "http://localhost:3000";
}
