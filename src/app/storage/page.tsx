'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FileData {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string | null
  metadata: {
    size?: number
    mimetype?: string
    cacheControl?: string
  }
}

interface FileContent {
  ok: boolean
  filename: string
  data: undefined
  timestamp: string
  error?: string
}

export default function StorageExplorer() {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Cargar lista de archivos
  const loadFiles = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/current-data')
      const result = await response.json()

      if (result.ok) {
        setFiles(result.files || [])
        setError(null)
      } else {
        setError(result.error || 'Error al cargar archivos')
      }
    } catch (err) {
      setError('Error de conexión al cargar archivos')
      console.error('Error loading files:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Descargar archivo
  const downloadFile = async (filename: string) => {
    try {
      setDownloadingFile(filename)
      const response = await fetch(`/api/current-data/${filename}`)
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

  // Formatear fecha
  const formatDate = (dateString: string) => {
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

  useEffect(() => {
    loadFiles()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white">
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                ← Volver al App Center
              </Link>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Explorador de Storage</h1>
                  <p className="text-purple-200 text-sm">Gestión de archivos JSON</p>
                </div>
              </div>
            </div>

            <button
              onClick={loadFiles}
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
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Estado de carga inicial */}
        {loading && !refreshing && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-200">Cargando archivos...</p>
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

        {/* Lista de archivos */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Archivos en Storage</h2>
                  <p className="text-purple-200">
                    {files.length} archivo{files.length !== 1 ? 's' : ''} encontrado{files.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-300">Storage Conectado</span>
                </div>
              </div>
            </div>

            {/* Tabla de archivos */}
            {files.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
                <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No hay archivos</h3>
                <p className="text-gray-400">No se encontraron archivos JSON en el storage</p>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold">Archivo</th>
                        <th className="text-left py-4 px-6 font-semibold">Tamaño</th>
                        <th className="text-left py-4 px-6 font-semibold">Creado</th>
                        <th className="text-left py-4 px-6 font-semibold">Modificado</th>
                        <th className="text-center py-4 px-6 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {files.map((file) => (
                        <tr key={file.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-400">{file.metadata.mimetype || 'application/json'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-300">
                            {formatFileSize(file.metadata.size)}
                          </td>
                          <td className="py-4 px-6 text-gray-300">
                            {formatDate(file.created_at)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-300">
                              {formatDate(file.updated_at)}
                              {file.last_accessed_at && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Último acceso: {formatDate(file.last_accessed_at)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center space-x-2">
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

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-purple-200 text-sm">Storage Explorer - TV Perú App Center</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-purple-200 text-sm">Sistema de archivos JSON</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}