import { serverUrl } from "../main";

/**
 * Rewrite broken localhost image URLs saved during local dev
 * so they load from the real API host in production.
 */
export function mediaUrl(url) {
  if (!url || typeof url !== "string") return url;

  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  // Absolute Cloudinary / CDN / already-correct URLs
  if (
    trimmed.startsWith("https://") &&
    !trimmed.includes("localhost") &&
    !trimmed.includes("127.0.0.1")
  ) {
    return trimmed;
  }

  // http://localhost:8000/public/foo.jpg  →  {serverUrl}/public/foo.jpg
  const localMatch = trimmed.match(
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i
  );
  if (localMatch) {
    const pathPart = localMatch[3] || "";
    const base = serverUrl || (typeof window !== "undefined" ? window.location.origin : "");
    return `${base.replace(/\/$/, "")}${pathPart}`;
  }

  // Relative /public/... path
  if (trimmed.startsWith("/")) {
    const base = serverUrl || "";
    return `${base.replace(/\/$/, "")}${trimmed}`;
  }

  return trimmed;
}
