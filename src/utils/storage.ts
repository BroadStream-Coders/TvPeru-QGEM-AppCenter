import { StorageResponse } from '@/types'

export async function getInfo(bucket: string, path: string = ''): Promise<StorageResponse> {
  try {
    const query = path ? `?path=${encodeURIComponent(path)}` : ''
    const url = `/api/${bucket}${query}`

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