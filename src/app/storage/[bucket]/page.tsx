'use client'

import {
  FolderOpen,
  File,
  Image,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  Download,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import IconBox from '@/components/ui/IconBox'

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
  const getFileIconComponent = (fileType: string) => {
    switch (fileType) {
      case 'document':
        return File
      case 'image':
        return Image
      default:
        return File
    }
  }

  useEffect(() => {
    if (bucket) {
      loadBucketContent()
    }
  }, [bucket])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Estado de carga inicial */}
      {loading && !refreshing && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <IconBox icon={Loader2} size="lg" className="mx-auto mb-4 animate-spin" />
            <p className="text-white/70">Cargando bucket {bucket}...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <IconBox icon={AlertCircle} size="md" />
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
          {/* Header del bucket */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-3">
                <IconBox icon={FolderOpen} size="md" />
                <div>
                  <h2 className="text-xl font-bold text-white">Bucket: {bucket}</h2>
                  <div className="flex items-center space-x-2 text-sm">
                    <FolderOpen className="w-4 h-4 text-white/60" />
                    <span className="text-white/70">/{bucket}</span>
                    {currentPath && (
                      <>
                        {currentPath.split('/').map((folder, index, array) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className={index === array.length - 1 ? "text-white font-medium" : "text-white/70"}>
                              /{folder}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-white/70">
                  {storageData.totalFolders} carpeta{storageData.totalFolders !== 1 ? 's' : ''} • {' '}
                  {storageData.totalFiles} archivo{storageData.totalFiles !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {currentPath && (
                  <button
                    onClick={navigateBack}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Atrás</span>
                  </button>
                )}

                <button
                  onClick={() => loadBucketContent(currentPath)}
                  disabled={refreshing}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <RotateCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Lista de contenido */}
          {storageData.totalFolders === 0 && storageData.totalFiles === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
              <IconBox icon={FolderOpen} size="xl" className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-white">Carpeta vacía</h3>
              <p className="text-white/60">No hay contenido en esta ubicación del bucket {bucket}</p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10 border-b border-white/20">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-white">Nombre</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Tipo</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Tamaño</th>
                      <th className="text-left py-4 px-6 font-semibold text-white">Modificado</th>
                      <th className="text-center py-4 px-6 font-semibold text-white">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {/* Carpetas primero */}
                    {storageData.folders.map((folder) => (
                      <tr key={folder.name} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <IconBox icon={FolderOpen} size="sm" />
                            <div>
                              <p className="font-medium text-white">{folder.name.replace('/', '')}</p>
                              <p className="text-sm text-white/60">Carpeta</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                            Carpeta
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white/60">—</td>
                        <td className="py-4 px-6 text-white/60">
                          {formatDate(folder.updated_at)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => navigateToFolder(folder.name)}
                              className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 hover:border-white/30 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                            >
                              <ChevronRight className="w-3 h-3" />
                              <span>Abrir</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Archivos después */}
                    {storageData.files.map((file) => {
                      const FileIcon = getFileIconComponent(file.fileType)

                      return (
                        <tr key={file.name} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <IconBox icon={FileIcon} size="sm" />
                              <div>
                                <p className="font-medium text-white">{file.name}</p>
                                <p className="text-sm text-white/60">
                                  {file.metadata?.mimetype || `Archivo .${file.extension}`}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                              {file.extension?.toUpperCase() || 'Archivo'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-white/60">
                            {formatFileSize(file.metadata?.size)}
                          </td>
                          <td className="py-4 px-6 text-white/60">
                            {formatDate(file.updated_at)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => downloadFile(file.name)}
                                disabled={downloadingFile === file.name}
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                              >
                                {downloadingFile === file.name ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Descargando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3 h-3" />
                                    <span>Descargar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}