import { renderRichTextContent } from '@/lib/rich-text';

interface LocalizedContentProps {
  title?: string;
  description?: string;
  content?: string;
}

export function LocalizedContent({
  title,
  description,
  content
}: LocalizedContentProps) {

  // Simple display for Vietnamese-only content
  if (title) return <span>{title}</span>;
  if (description) return <span>{description}</span>;
  if (content) return <span dangerouslySetInnerHTML={{ __html: renderRichTextContent(content) }} />;
  return null;
}
