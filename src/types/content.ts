// Centralized Content Types to prevent interface cycling issues

export interface BaseAuthor {
  id?: string;
  name: string;
  email?: string;
}

export interface AuthorWithRole extends BaseAuthor {
  role: string;
}

export interface AuthorWithOrg extends BaseAuthor {
  organization?: string;
}

export interface AuthorFull extends AuthorWithRole {
  organization?: string;
}

export interface BaseContent {
  id: string;
  title: string;
  description?: string;
  content?: string;
  type: string;
  category?: string;
  tags?: string;
  status: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ContentWithBasicAuthor extends BaseContent {
  author: BaseAuthor;
}

export interface ContentWithRoleAuthor extends BaseContent {
  author: AuthorWithRole;
}

export interface ContentWithOrgAuthor extends BaseContent {
  author: AuthorWithOrg;
}

export interface ContentWithFullAuthor extends BaseContent {
  author: AuthorFull;
}

// File-related properties
export interface ContentWithFiles extends BaseContent {
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
}

// For admin operations - includes all possible fields
export interface AdminContent extends ContentWithFiles {
  author: AuthorWithRole;
  titleEn?: string;
}

// For content forms - all fields optional for editing
export interface ContentFormData extends Partial<ContentWithFiles> {
  id: string;
  title: string;
  type: string;
  status: string;
  author?: AuthorWithRole;
}

// For public content display
export interface PublicContent extends ContentWithFiles {
  author: AuthorWithOrg;
}

// Type guards to help with type safety
export const hasRole = (author: BaseAuthor): author is AuthorWithRole => {
  return 'role' in author;
};

export const hasOrganization = (author: BaseAuthor): author is AuthorWithOrg => {
  return 'organization' in author;
};