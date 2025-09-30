export interface FileItem {
  name: string
  id?: string
  updated_at?: string
  metadata?: {
    size?: number
    mimetype?: string
  }
  type: 'file'
  fileType: string
  extension?: string
  fullPath: string
  url: string
}

export interface FolderItem {
  name: string
  id?: string
  updated_at?: string
  type: 'folder'
  fullPath: string
}

export interface StorageResponse {
  ok: boolean
  bucket: string
  path: string
  folders: FolderItem[]
  files: FileItem[]
  totalFolders: number
  totalFiles: number
  error?: string
}

export async function getInfo(bucket: string, path: string = ''): Promise<StorageResponse> {
  try {
    const url = `/api/${bucket}${path ? `?path=${encodeURIComponent(path)}` : ''}`

    console.log(url);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || `Error ${res.status}`)
    }

    const data: StorageResponse = await res.json()
    return data
  } catch (err) {
    return {
      ok: false,
      bucket,
      path,
      folders: [],
      files: [],
      totalFolders: 0,
      totalFiles: 0,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}