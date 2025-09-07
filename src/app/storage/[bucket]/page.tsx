'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface FileItem {
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
}

interface FolderItem {
  name: string
  id?: string
  updated_at?: string
  type: 'folder'
  fullPath: string
}

interface StorageResponse {
  ok: boolean
  bucket: string
  path: string
  folders: FolderItem[]
  files: FileItem[]
  totalFolders: number
  totalFiles: number
  error?: string
}

interface FileContent {
  ok: boolean
  filename: string
  data: unknown
  timestamp: string
  error?: string
}

export default function StorageBucketExplorer() {
  const params = useParams()
  const bucket = params.bucket as string

  const [storageData, setStorageData] = useState<StorageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  // Cargar contenido del bucket
  const loadBucketContent = async (path: string = '') => {
    try {
      setRefreshing(true)
      const queryParams = new URLSearchParams({
        path,
        limit: '100',
        sortBy: 'updated_at',
        sortOrder: 'desc'
      })

      const response = await fetch(`/api/${bucket}?${queryParams}`)
      const result: StorageResponse = await response.json()

      if (result.ok) {
        setStorageData(result)
        setCurrentPath(path)
        setError(null)
      } else {
        setError(result.error || `Error al cargar contenido del bucket: ${bucket}`)
      }
    } catch (err) {
      setError('Error de conexión al cargar el bucket')
      console.error('Error loading bucket:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Descargar archivo
  const downloadFile = async (filename: string) => {
    try {
      setDownloadingFile(filename)
      const filePath = currentPath ? `${currentPath}/${filename}` : filename
      const response = await fetch(`/api/${bucket}/${filePath}`)
      const result: FileContent = await response.json()

      if (result.ok) {
        // Crear blob para descarga
        const jsonString = JSON.stringify(result.data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)

        // Crear link de descarga
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()

        // Limpiar
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        alert(`Error al descargar: ${result.error}`)
      }
    } catch (err) {
      console.error('Error downloading file:', err)
      alert('Error al descargar el archivo')
    } finally {
      setDownloadingFile(null)
    }
  }

  // Navegar a carpeta
  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName
    loadBucketContent(newPath)
  }

  // Navegar hacia atrás
  const navigateBack = () => {
    const pathParts = currentPath.split('/')
    pathParts.pop()
    const newPath = pathParts.join('/')
    loadBucketContent(newPath)
  }

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
  }

  // Obtener icono según tipo de archivo
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'document':
        return (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  useEffect(() => {
    if (bucket) {
      loadBucketContent()
    }
  }, [bucket])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white">
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Bucket: {bucket}</h1>
                  <p className="text-purple-200 text-sm">
                    {currentPath ? `Carpeta: ${currentPath}` : 'Raíz del bucket'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {currentPath && (
                <button
                  onClick={navigateBack}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Atrás</span>
                </button>
              )}

              <button
                onClick={() => loadBucketContent(currentPath)}
                disabled={refreshing}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Estado de carga inicial */}
        {loading && !refreshing && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-200">Cargando bucket {bucket}...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-100">Error</h3>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contenido del bucket */}
        {!loading && !error && storageData && (
          <>
            {/* Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Contenido del Bucket</h2>
                  <p className="text-purple-200">
                    {storageData.totalFolders} carpeta{storageData.totalFolders !== 1 ? 's' : ''} • {' '}
                    {storageData.totalFiles} archivo{storageData.totalFiles !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-300">Bucket Conectado</span>
                </div>
              </div>
            </div>

            {/* Navegación de path */}
            {currentPath && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-purple-300">/{bucket}</span>
                  {currentPath.split('/').map((folder, index, array) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-400">/</span>
                      <span className={index === array.length - 1 ? "text-white font-medium" : "text-gray-300"}>
                        {folder}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de contenido */}
            {storageData.totalFolders === 0 && storageData.totalFiles === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
                <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Carpeta vacía</h3>
                <p className="text-gray-400">No hay contenido en esta ubicación del bucket {bucket}</p>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold">Nombre</th>
                        <th className="text-left py-4 px-6 font-semibold">Tipo</th>
                        <th className="text-left py-4 px-6 font-semibold">Tamaño</th>
                        <th className="text-left py-4 px-6 font-semibold">Modificado</th>
                        <th className="text-center py-4 px-6 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {/* Carpetas primero */}
                      {storageData.folders.map((folder) => (
                        <tr key={folder.name} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">{folder.name.replace('/', '')}</p>
                                <p className="text-sm text-gray-400">Carpeta</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-medium">
                              Carpeta
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-300">—</td>
                          <td className="py-4 px-6 text-gray-300">
                            {formatDate(folder.updated_at)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => navigateToFolder(folder.name)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span>Abrir</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Archivos después */}
                      {storageData.files.map((file) => (
                        <tr key={file.name} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center ${file.fileType === 'document' ? 'bg-blue-500' :
                                file.fileType === 'image' ? 'bg-green-500' :
                                  'bg-gray-500'
                                }`}>
                                {getFileIcon(file.fileType)}
                              </div>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-400">
                                  {file.metadata?.mimetype || `Archivo .${file.extension}`}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${file.fileType === 'document' ? 'bg-blue-500/20 text-blue-300' :
                              file.fileType === 'image' ? 'bg-green-500/20 text-green-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                              {file.extension?.toUpperCase() || 'Archivo'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-300">
                            {formatFileSize(file.metadata?.size)}
                          </td>
                          <td className="py-4 px-6 text-gray-300">
                            {formatDate(file.updated_at)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => downloadFile(file.name)}
                                disabled={downloadingFile === file.name}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                {downloadingFile === file.name ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Descargando...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Descargar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}