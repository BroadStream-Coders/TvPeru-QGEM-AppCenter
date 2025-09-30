
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

export interface SelectedResource {
  name: string
  bucket: string
  type: 'file' | 'folder'
  fullPath: string
}