import Link from 'next/link'
import { Eye, Download, MessageCircle, Bookmark, Clock, User } from 'lucide-react'
import { MediaContent } from './MediaContent'
import { LocalizedContent } from '../LocalizedContent'
import { ContentCardProps } from '@/types/content'

export function ContentCard({ content, categoryLabels = {} }: ContentCardProps) {
  const getTypeBadge = (type: string) => {
    const typeMap = {
      ARTICLE: { color: 'bg-blue-100 text-blue-800', text: 'Bài viết' },
      VIDEO: { color: 'bg-red-100 text-red-800', text: 'Video' },
      DOCUMENT: { color: 'bg-purple-100 text-purple-800', text: 'Tài liệu' },
      STORY: { color: 'bg-orange-100 text-orange-800', text: 'Điển hình' },
      PROJECT_ACTIVITY: { color: 'bg-amber-100 text-amber-800', text: 'Hoạt động dự án' },
      GUIDE: { color: 'bg-indigo-100 text-indigo-800', text: 'Hướng dẫn' },
      POLICY: { color: 'bg-pink-100 text-pink-800', text: 'Chính sách' },
      INFOGRAPHIC: { color: 'bg-teal-100 text-teal-800', text: 'Infographic' }
    }

    const typeStyle = typeMap[type as keyof typeof typeMap] || typeMap.ARTICLE

    return (
      <span className={`rounded px-2.5 py-0.5 text-xs font-medium ${typeStyle.color}`}>
        {typeStyle.text}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div
      className={`rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md ${
        content.isFeatured ? 'ring-2 ring-yellow-200' : ''
      }`}
    >
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          {getTypeBadge(content.type)}
          {content.isFeatured && (
            <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">Nổi bật</span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
          <Link href={`/content/${content.id}`} className="hover:text-green-600">
            <LocalizedContent title={content.title} />
          </Link>
        </h3>

        {content.description && (
          <div className="mb-4 line-clamp-3 text-sm text-gray-600">
            <LocalizedContent description={content.description} />
          </div>
        )}

        <div className="mb-4">
          <MediaContent
            imageUrl={content.thumbnailUrl || content.imageUrl}
            videoUrl={content.videoUrl}
            title={content.title}
          />
        </div>

        <div className="mb-4">
          <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {categoryLabels[content.category] || content.category}
          </span>
        </div>

        <div className="mb-4 flex items-center text-sm text-gray-500">
          <User className="mr-1 h-4 w-4" />
          <span className="mr-3">{content.author.name}</span>
          <Clock className="mr-1 h-4 w-4" />
          <span>{formatDate(content.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              <span>{content.viewCount.toLocaleString('vi-VN')}</span>
            </div>
            {content.downloadCount > 0 && (
              <div className="flex items-center">
                <Download className="mr-1 h-4 w-4" />
                <span>{content.downloadCount.toLocaleString('vi-VN')}</span>
              </div>
            )}
            <div className="flex items-center">
              <MessageCircle className="mr-1 h-4 w-4" />
              <span>{content._count.comments}</span>
            </div>
          </div>

          <div className="flex items-center">
            <Bookmark className="mr-1 h-4 w-4" />
            <span>{content._count.bookmarks}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
