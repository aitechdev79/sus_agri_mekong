import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get categories with content counts
    const categories = await prisma.content.groupBy({
      by: ['category'],
      where: {
        status: 'PUBLISHED',
        isPublic: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    // Predefined categories for shrimp and rice value chains
    const predefinedCategories = [
      { name: 'shrimp_farming', nameVi: 'Nuôi tôm', nameEn: 'Shrimp Farming' },
      { name: 'shrimp_processing', nameVi: 'Chế biến tôm', nameEn: 'Shrimp Processing' },
      { name: 'shrimp_export', nameVi: 'Xuất khẩu tôm', nameEn: 'Shrimp Export' },
      { name: 'rice_cultivation', nameVi: 'Trồng lúa', nameEn: 'Rice Cultivation' },
      { name: 'rice_processing', nameVi: 'Chế biến lúa', nameEn: 'Rice Processing' },
      { name: 'rice_marketing', nameVi: 'Tiếp thị lúa', nameEn: 'Rice Marketing' },
      { name: 'sustainable_practices', nameVi: 'Thực hành bền vững', nameEn: 'Sustainable Practices' },
      { name: 'technology_innovation', nameVi: 'Công nghệ và đổi mới', nameEn: 'Technology & Innovation' },
      { name: 'financial_support', nameVi: 'Hỗ trợ tài chính', nameEn: 'Financial Support' },
      { name: 'market_access', nameVi: 'Tiếp cận thị trường', nameEn: 'Market Access' },
      { name: 'policy_guidelines', nameVi: 'Chính sách và hướng dẫn', nameEn: 'Policy & Guidelines' },
      { name: 'success_stories', nameVi: 'Câu chuyện thành công', nameEn: 'Success Stories' }
    ]

    const categoriesWithDetails = predefinedCategories.map(predefined => {
      const found = categories.find(cat => cat.category === predefined.name)
      return {
        ...predefined,
        count: found?._count.id || 0
      }
    })

    return NextResponse.json({
      categories: categoriesWithDetails,
      total: categories.reduce((sum, cat) => sum + cat._count.id, 0)
    })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh mục' },
      { status: 500 }
    )
  }
}