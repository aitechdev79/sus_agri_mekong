import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { saveFile } from '@/lib/file-upload'
import { prisma } from '@/lib/prisma'
import { ContentType } from '@/types/content'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Cần đăng nhập để tải file' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Không có file được tải lên' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    // Process files sequentially to avoid overwhelming the system
    for (const file of files) {
      try {
        const result = await saveFile(file)

        if (!result.success) {
          errors.push({ fileName: file.name, error: result.error })
          continue
        }

        // Save file metadata to database
        const fileRecord = await prisma.content.create({
          data: {
            title: result.originalName || 'Untitled',
            description: `File uploaded: ${result.originalName}`,
            content: `File: ${result.originalName}`,
            type: getContentType(file.type),
            category: 'file_upload',
            tags: '', // Add required tags field
            fileUrl: result.url,
            fileType: result.type,
            fileSize: result.size,
            thumbnailUrl: file.type.startsWith('image/') ? result.url?.replace(result.fileName!, `thumb_${result.fileName}`) : undefined,
            status: 'DRAFT',
            authorId: user.id
          }
        })

        // Track upload analytics
        await prisma.analytics.create({
          data: {
            event: 'file_upload',
            contentId: fileRecord.id,
            userId: user.id,
            metadata: {
              fileName: result.originalName,
              fileSize: result.size,
              fileType: result.type
            }
          }
        })

        results.push({
          id: fileRecord.id,
          url: result.url,
          fileName: result.fileName,
          originalName: result.originalName,
          size: result.size,
          type: result.type
        })

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        errors.push({ fileName: file.name, error: 'Lỗi xử lý file' })
      }
    }

    return NextResponse.json({
      success: results.length > 0,
      files: results,
      errors,
      summary: {
        total: files.length,
        successful: results.length,
        failed: errors.length
      }
    })

  } catch (error) {
    console.error('Multiple upload error:', error)
    return NextResponse.json(
      { error: 'Lỗi khi tải nhiều file' },
      { status: 500 }
    )
  }
}

function getContentType(mimeType: string): ContentType {
  if (mimeType.startsWith('image/')) return 'INFOGRAPHIC'
  if (mimeType.startsWith('video/')) return 'VIDEO'
  if (mimeType === 'application/pdf') return 'DOCUMENT'
  if (mimeType.includes('word')) return 'DOCUMENT'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'DOCUMENT'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'DOCUMENT'
  return 'DOCUMENT'
}