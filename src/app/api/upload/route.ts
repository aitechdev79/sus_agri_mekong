import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { saveFile } from '@/lib/file-upload'
import { prisma } from '@/lib/prisma'

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
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Không có file được tải lên' },
        { status: 400 }
      )
    }

    // Save file
    const result = await saveFile(file)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
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

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        type: result.type
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Lỗi khi tải file' },
      { status: 500 }
    )
  }
}

function getContentType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'INFOGRAPHIC'
  if (mimeType.startsWith('video/')) return 'VIDEO'
  if (mimeType === 'application/pdf') return 'DOCUMENT'
  if (mimeType.includes('word')) return 'DOCUMENT'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'DOCUMENT'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'DOCUMENT'
  return 'DOCUMENT'
}