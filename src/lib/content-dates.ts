export function getPublishedDate(content: { publishedAt?: string | Date | null; createdAt: string | Date }) {
  return content.publishedAt || content.createdAt
}
