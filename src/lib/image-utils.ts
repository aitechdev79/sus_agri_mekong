/**
 * Utility functions for handling image URLs in Next.js
 */

/**
 * Normalizes image URLs for Next.js Image component
 * Converts relative paths like "./uploads/..." to "/uploads/..."
 * Ensures URLs start with "/" for relative paths or are absolute URLs
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return null;
  }

  // If it's already an absolute URL (http:// or https://), return as is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // If it starts with "./uploads", convert to "/uploads"
  if (trimmedUrl.startsWith('./uploads')) {
    return trimmedUrl.replace('./uploads', '/uploads');
  }

  // If it starts with "uploads", add leading slash
  if (trimmedUrl.startsWith('uploads')) {
    return `/${trimmedUrl}`;
  }

  // If it already starts with "/", return as is
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl;
  }

  // For any other relative path, add leading slash
  return `/${trimmedUrl}`;
}

/**
 * Gets the best available image URL from multiple sources
 * Prioritizes thumbnailUrl over imageUrl and applies normalization
 */
export function getBestImageUrl(
  thumbnailUrl?: string | null,
  imageUrl?: string | null,
  fallback?: string | null
): string | null {
  return (
    normalizeImageUrl(thumbnailUrl) ||
    normalizeImageUrl(imageUrl) ||
    normalizeImageUrl(fallback)
  );
}

/**
 * Checks if an image URL is valid for Next.js Image component
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return false;
  }

  // Must be absolute URL or start with "/"
  return (
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('/')
  );
}