// 🎯 SINGLE SOURCE OF TRUTH - Content Type Definitions
// This file prevents interface cycling by providing centralized types
// for all Content/ContentItem interfaces across the codebase

// ===== BASE AUTHOR INTERFACES =====
export interface BaseAuthor {
  id?: string;
  name: string;
  email?: string;
}

export interface AuthorWithRole extends BaseAuthor {
  role: string;
}

export interface AuthorWithOrganization extends BaseAuthor {
  organization?: string;
}

export interface AuthorComplete extends AuthorWithRole, AuthorWithOrganization {}

// ===== CORE CONTENT INTERFACE =====
// This matches what Prisma returns from the database
export interface BaseContent {
  id: string;
  title: string;
  description: string;
  content: string;
  type: ContentType;
  category: string;
  tags: string;
  status: ContentStatus;
  isPublic: boolean;
  isFeatured: boolean;
  viewCount: number;
  downloadCount: number;
  createdAt: string; // API returns ISO string, not Date
  updatedAt: string;
  authorId: string;
}

// ===== CONTENT WITH AUTHOR VARIANTS =====
export interface ContentWithBasicAuthor extends Omit<BaseContent, 'authorId'> {
  author: BaseAuthor;
}

export interface ContentWithRoleAuthor extends Omit<BaseContent, 'authorId'> {
  author: AuthorWithRole;
}

export interface ContentWithOrgAuthor extends Omit<BaseContent, 'authorId'> {
  author: AuthorWithOrganization;
}

export interface ContentWithCompleteAuthor extends Omit<BaseContent, 'authorId'> {
  author: AuthorComplete;
}

// ===== MEDIA/FILE EXTENSIONS =====
export interface MediaFields {
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
}

export interface ContentWithMedia extends ContentWithRoleAuthor, MediaFields {}

// ===== BILINGUAL SUPPORT =====
export interface BilingualFields {
  titleEn?: string;
  descriptionEn?: string;
  contentEn?: string;
}

export interface ContentWithBilingual extends ContentWithRoleAuthor, BilingualFields {}

// ===== PRISMA RELATION COUNTS =====
export interface ContentCounts {
  _count: {
    comments: number;
    bookmarks: number;
  };
}

export interface ContentWithCounts extends ContentWithRoleAuthor, ContentCounts {}

// ===== SPECIALIZED INTERFACES FOR DIFFERENT USE CASES =====

// 1. ADMIN INTERFACE - Full data for admin operations
export interface AdminContent extends ContentWithMedia {
  titleEn?: string;
  updatedAt: string;
}

// 2. PUBLIC INTERFACE - For public-facing displays
export interface PublicContent extends ContentWithCompleteAuthor, MediaFields {}

// 3. LIBRARY INTERFACE - For library/search displays with counts
export interface LibraryContent extends ContentWithRoleAuthor, BilingualFields, ContentCounts {
  downloadCount: number;
}

// 4. CARD INTERFACE - For content cards with counts
export interface CardContent extends ContentWithRoleAuthor, MediaFields, ContentCounts {}

// 5. FORM INTERFACE - For editing forms (most fields optional)
export interface FormContent {
  id: string;
  title: string;
  description?: string;
  content?: string;
  type: ContentType;
  category?: string;
  tags?: string;
  status: ContentStatus;
  isPublic?: boolean;
  isFeatured?: boolean;
  author?: AuthorWithRole;
  viewCount?: number;
  createdAt?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
}

// 6. MINIMAL INTERFACE - For simple displays
export interface MinimalContent {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  viewCount: number;
  createdAt: string;
}

// 7. NEWS INTERFACE - Specialized for news content
export interface NewsContent extends ContentWithCompleteAuthor, MediaFields {
  titleEn?: string;
  descriptionEn?: string;
}

// ===== ENUMS FOR CONSISTENCY =====
export type ContentType =
  | 'ARTICLE'
  | 'VIDEO'
  | 'INFOGRAPHIC'
  | 'DOCUMENT'
  | 'STORY'
  | 'GUIDE'
  | 'POLICY'
  | 'NEWS';

export type ContentStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type UserRole =
  | 'USER'
  | 'MODERATOR'
  | 'ADMIN';

// ===== TYPE GUARDS =====
export const hasRole = (author: BaseAuthor): author is AuthorWithRole => {
  return 'role' in author && typeof author.role === 'string';
};

export const hasOrganization = (author: BaseAuthor): author is AuthorWithOrganization => {
  return 'organization' in author;
};

export const hasMedia = (content: BaseContent): content is BaseContent & MediaFields => {
  return 'thumbnailUrl' in content || 'imageUrl' in content || 'videoUrl' in content;
};

export const hasCounts = (content: any): content is ContentWithCounts => {
  return content && '_count' in content;
};

// ===== API RESPONSE TYPES =====
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ContentListResponse<T = AdminContent> {
  contents: T[];
  pagination: PaginationData;
}

// Specific typed responses
export interface AdminContentListResponse extends ContentListResponse<AdminContent> {}
export interface MinimalContentListResponse extends ContentListResponse<MinimalContent> {}

export interface ContentResponse {
  content: AdminContent;
}

// ===== COMPONENT PROP TYPES =====
export interface ContentTableProps {
  contents: AdminContent[];
  onEdit: (content: AdminContent) => void;
  onDelete: (content: AdminContent) => void;
  onBulkAction?: (action: string, ids: string[]) => void;
  userRole: UserRole;
}

export interface ContentFormProps {
  content?: FormContent | null;
  onClose: () => void;
  userRole: UserRole;
}

export interface ContentCardProps {
  content: CardContent;
  onEdit?: (content: CardContent) => void;
  onDelete?: (content: CardContent) => void;
}

// ===== UTILITY TYPES =====
export type PartialContent<T extends BaseContent> = Partial<T> & Pick<T, 'id' | 'title' | 'type'>;

export type CreateContentData = Omit<BaseContent, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'>;

export type UpdateContentData = Partial<CreateContentData & MediaFields>;

// ===== LEGACY ALIASES (for gradual migration) =====
/** @deprecated Use AdminContent instead */
export type ContentItem = AdminContent;

/** @deprecated Use AdminContent instead */
export type Content = AdminContent;

// ===== MIGRATION NOTES =====
/*
MIGRATION GUIDE:

1. Replace existing interfaces:
   - ContentItem → AdminContent (admin pages)
   - Content → AdminContent (admin components)
   - NewsContent → NewsContent (news pages)
   - MinimalContent → MinimalContent (simple displays)

2. Update imports:
   import { AdminContent, ContentTableProps } from '@/types/content';

3. Update function signatures:
   const handleEdit = (content: AdminContent) => { ... }

4. Remove local interface definitions and import from here

5. Use type guards for runtime safety:
   if (hasRole(content.author)) {
     console.log(content.author.role);
   }
*/