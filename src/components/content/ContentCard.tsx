import Link from 'next/link'
import { Eye, Download, MessageCircle, Bookmark, Clock, User } from 'lucide-react'
import { MediaContent } from './MediaContent'
import { LocalizedContent } from '../LocalizedContent'

interface ContentCardProps {
  content: {
    id: string
    title: string
    description?: string
    type: string
    category: string
    viewCount: number
    downloadCount: number
    isFeatured: boolean
    imageUrl?: string
    videoUrl?: string
    author: {
      name: string
      role: string
    }
    createdAt: string
    _count: {
      comments: number
      bookmarks: number
    }
  }
}

export function ContentCard({ content }: ContentCardProps) {
  const getTypeBadge = (type: string) => {
    const typeMap = {
      ARTICLE: { color: 'bg-blue-100 text-blue-800', text: 'Bài viết' },
      VIDEO: { color: 'bg-red-100 text-red-800', text: 'Video' },
      DOCUMENT: { color: 'bg-purple-100 text-purple-800', text: 'Tài liệu' },
      STORY: { color: 'bg-orange-100 text-orange-800', text: 'Câu chuyện' },
      GUIDE: { color: 'bg-indigo-100 text-indigo-800', text: 'Hướng dẫn' },
      POLICY: { color: 'bg-pink-100 text-pink-800', text: 'Chính sách' },
      INFOGRAPHIC: { color: 'bg-teal-100 text-teal-800', text: 'Infographic' }
    }

    const typeStyle = typeMap[type as keyof typeof typeMap] || typeMap.ARTICLE

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${typeStyle.color}`}>
        {typeStyle.text}
      </span>
    )
  }

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      shrimp_farming: 'Nuôi tôm',
      shrimp_processing: 'Chế biến tôm',
      shrimp_export: 'Xuất khẩu tôm',
      rice_cultivation: 'Trồng lúa',
      rice_processing: 'Chế biến lúa',
      rice_marketing: 'Tiếp thị lúa',
      sustainable_practices: 'Thực hành bền vững',
      technology_innovation: 'Công nghệ và đổi mới',
      financial_support: 'Hỗ trợ tài chính',
      market_access: 'Tiếp cận thị trường',
      policy_guidelines: 'Chính sách và hướng dẫn',
      success_stories: 'Câu chuyện thành công'
    }

    return categoryMap[category] || category
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Use consistent server-side format to avoid hydration mismatch
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
      content.isFeatured ? 'ring-2 ring-yellow-200' : ''
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {getTypeBadge(content.type)}
          {content.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
              Nổi bật
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/content/${content.id}`} className="hover:text-green-600">
            <LocalizedContent
              title={content.title}
            />
          </Link>
        </h3>

        {/* Description */}
        {content.description && (
          <div className="text-gray-600 text-sm mb-4 line-clamp-3">
            <LocalizedContent
              description={content.description}
            />
          </div>
        )}

        {/* Media Content */}
        {(content.imageUrl || content.videoUrl) && (
          <div className="mb-4">
            <MediaContent
              imageUrl={content.imageUrl}
              videoUrl={content.videoUrl}
              title={content.title}
            />
          </div>
        )}

        {/* Category */}
        <div className="mb-4">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {getCategoryName(content.category)}
          </span>
        </div>

        {/* Author and Date */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="w-4 h-4 mr-1" />
          <span className="mr-3">{content.author.name}</span>
          <Clock className="w-4 h-4 mr-1" />
          <span>{formatDate(content.createdAt)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{content.viewCount.toLocaleString('vi-VN')}</span>
            </div>
            {content.downloadCount > 0 && (
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-1" />
                <span>{content.downloadCount.toLocaleString('vi-VN')}</span>
              </div>
            )}
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>{content._count.comments}</span>
            </div>
          </div>

          <div className="flex items-center">
            <Bookmark className="w-4 h-4 mr-1" />
            <span>{content._count.bookmarks}</span>
          </div>
        </div>
      </div>
    </div>
  )
}