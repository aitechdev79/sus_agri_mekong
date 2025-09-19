export interface Content {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  type: 'ARTICLE' | 'VIDEO' | 'INFOGRAPHIC' | 'DOCUMENT' | 'STORY' | 'GUIDE' | 'POLICY' | 'NEWS';
  authorId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  tags: string;
  isPublic: boolean;
  isFeatured: boolean;
  viewCount: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}