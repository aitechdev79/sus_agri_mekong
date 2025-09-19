import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { saveFile } from '@/lib/file-upload'

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

    // Just save the file, don't create database records
    const result = await saveFile(file)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Return file information for use in forms
    return NextResponse.json({
      success: true,
      file: {
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        type: result.type,
        thumbnailUrl: file.type.startsWith('image/') ? result.url?.replace(`/${result.fileName}`, `/thumb_${result.fileName}`) : undefined
      }
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Lỗi khi tải file' },
      { status: 500 }
    )
  }
}