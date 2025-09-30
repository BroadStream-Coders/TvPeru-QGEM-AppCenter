import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

import { FileItem, FolderItem } from '@/types'

interface RouteParams {
  params: Promise<{
    bucket: string
  }>
}

interface SupabaseStorageItem {
  name: string
  id?: string
  updated_at?: string
  metadata?: {
    size?: number
    mimetype?: string
    [key: string]: unknown
  } | null
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const { bucket } = await params

    const path = searchParams.get('path') || ''
    const limit = parseInt(searchParams.get('limit') || '100')
    const sortBy = searchParams.get('sortBy') || 'updated_at'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    console.log('📂 Listando archivos del storage...')
    console.log(`📁 Path: ${bucket} ${path || '/'}`)

    // Listar archivos del bucket especificado
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(path, {
        limit: limit,
        offset: 0,
        sortBy: { column: sortBy, order: sortOrder }
      })

    if (error) {
      console.error('❌ Error al listar archivos:', error)
      return NextResponse.json({
        ok: false,
        error: error.message,
        bucket: bucket,
        path: path
      }, { status: 500 })
    }

    // Separar archivos y carpetas
    const folders: FolderItem[] = []
    const files: FileItem[] = []

    data.forEach((item: SupabaseStorageItem) => {
      if (!item.name) return // Skip items without name

      if (item.name.endsWith('/') || !item.metadata) {
        // Es una carpeta
        folders.push({
          ...item,
          type: 'folder',
          fullPath: path ? `${path}/${item.name}` : item.name
        })
      } else {
        // Es un archivo
        const fileExtension = item.name.split('.').pop()?.toLowerCase()
        const fileType = getFileType(fileExtension)

        files.push({
          ...item,
          metadata: item.metadata,
          type: 'file',
          fileType: fileType,
          extension: fileExtension,
          fullPath: path ? `${path}/${item.name}` : item.name,
          url: `https://qtxtgtqffqvcoowlakoo.supabase.co/storage/v1/object/public/${bucket}/${path ? `${path}/` : ''}${item.name}`
        })
      }
    })

    console.log(`✅ ${folders.length} carpetas y ${files.length} archivos encontrados`)

    return NextResponse.json({
      ok: true,
      bucket: bucket,
      path: path,
      folders: folders,
      files: files,
      totalFolders: folders.length,
      totalFiles: files.length,
      timestamp: new Date().toISOString()
    })

  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Error inesperado:', err)
    return NextResponse.json({
      ok: false,
      error: err.message
    }, { status: 500 })
  }
}

// Función helper para determinar el tipo de archivo
function getFileType(extension: string | undefined): string {
  if (!extension) return 'unknown'

  const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pngd']
  const documentTypes = ['json', 'txt', 'pdf', 'doc', 'docx']
  const videoTypes = ['mp4', 'avi', 'mov', 'mkv', 'webm']
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac']

  if (imageTypes.includes(extension)) return 'image'
  if (documentTypes.includes(extension)) return 'document'
  if (videoTypes.includes(extension)) return 'video'
  if (audioTypes.includes(extension)) return 'audio'

  return 'other'
}