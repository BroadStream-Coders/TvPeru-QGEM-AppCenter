'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { FolderOpen, File, Image, Check, Maximize, Send } from 'lucide-react'

declare global {
  interface Window {
    createUnityInstance: (canvas: HTMLCanvasElement, config: unknown) => Promise<unknown>
  }
}

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

interface SelectedResource {
  name: string
  bucket: string
  type: 'file' | 'folder'
  fullPath: string
}

export default function UnityPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const params = useParams()
  const game = params.game as string

  // Estado para Unity Instance
  const [unityInstance, setUnityInstance] = useState<any>(null)
  const [unityLoaded, setUnityLoaded] = useState(false)

  // Estados para el selector de recursos
  const [sampleDataFiles, setSampleDataFiles] = useState<StorageResponse | null>(null)
  const [currentDataFiles, setCurrentDataFiles] = useState<StorageResponse | null>(null)
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>([])
  const [loadingResources, setLoadingResources] = useState(true)
  const [showResourceSelector, setShowResourceSelector] = useState(false)

  // Cargar Unity
  useEffect(() => {
    if (!canvasRef.current) return

    const loadUnity = async () => {
      const script = document.createElement('script')
      script.src = `/unity/${game}/Build/${game}.loader.js`

      script.onload = async () => {
        const config = {
          arguments: [],
          dataUrl: `/unity/${game}/Build/${game}.data`,
          frameworkUrl: `/unity/${game}/Build/${game}.framework.js`,
          codeUrl: `/unity/${game}/Build/${game}.wasm`,
          streamingAssetsUrl: `/unity/${game}/StreamingAssets`,
          companyName: "BroadStream-Coders",
          productName: game,
          productVersion: "v1.0.0"
        }

        try {
          const instance = await window.createUnityInstance(canvasRef.current!, config)
          setUnityInstance(instance)
          setUnityLoaded(true)
          console.log('✅ Unity instance cargada correctamente')
        } catch (message) {
          alert(message)
        }
      }

      document.head.appendChild(script)
    }

    loadUnity()
  }, [game])

  // Cargar recursos de ambos buckets
  useEffect(() => {
    const loadBucketResources = async () => {
      try {
        setLoadingResources(true)

        // Cargar sample-data
        const sampleResponse = await fetch('/api/sample-data')
        const sampleData: StorageResponse = await sampleResponse.json()
        setSampleDataFiles(sampleData)

        // Cargar current-data
        const currentResponse = await fetch('/api/current-data')
        const currentData: StorageResponse = await currentResponse.json()
        setCurrentDataFiles(currentData)

      } catch (error) {
        console.error('Error loading bucket resources:', error)
      } finally {
        setLoadingResources(false)
      }
    }

    loadBucketResources()
  }, [])

  // Función para activar fullscreen
  const handleFullscreen = () => {
    if (unityInstance) {
      unityInstance.SetFullscreen(1)
      console.log('🔄 Activando fullscreen en Unity')
    } else {
      console.warn('⚠️ Unity instance no está disponible')
    }
  }

  // Función para enviar recursos seleccionados a Unity
  const sendResourcesToUnity = () => {
    if (!unityInstance) {
      console.warn('⚠️ Unity instance no está disponible')
      return
    }

    if (selectedResources.length === 0) {
      console.warn('⚠️ No hay recursos seleccionados')
      return
    }

    // Crear JSON con los recursos seleccionados
    const resourcesConfig = {
      games: selectedResources.map(resource => ({
        name: resource.name,
        type: resource.type,
        bucket: resource.bucket,
        jsonUrl: `https://qtxtgtqffqvcoowlakoo.supabase.co/storage/v1/object/public/${resource.bucket}/${resource.fullPath}`
      }))
    }

    const jsonString = JSON.stringify(resourcesConfig, null, 2)

    console.log('📡 Enviando recursos a Unity:', jsonString)

    // Enviar a Unity (ajusta el GameObject y método según tu implementación)
    unityInstance.SendMessage("GameLoader", "LoadGamesFromConfig", jsonString)
  }

  // Función para manejar selección de recursos
  const toggleResourceSelection = (resource: SelectedResource) => {
    setSelectedResources(prev => {
      const exists = prev.find(r =>
        r.name === resource.name &&
        r.bucket === resource.bucket &&
        r.type === resource.type
      )

      if (exists) {
        return prev.filter(r => !(
          r.name === resource.name &&
          r.bucket === resource.bucket &&
          r.type === resource.type
        ))
      } else {
        return [...prev, resource]
      }
    })
  }

  // Función para verificar si un recurso está seleccionado
  const isResourceSelected = (resource: SelectedResource) => {
    return selectedResources.some(r =>
      r.name === resource.name &&
      r.bucket === resource.bucket &&
      r.type === resource.type
    )
  }

  // Función para obtener icono según tipo
  const getResourceIcon = (item: FileItem | FolderItem) => {
    if (item.type === 'folder') {
      return <FolderOpen className="w-4 h-4 text-yellow-400" />
    }

    const fileItem = item as FileItem
    switch (fileItem.fileType) {
      case 'document':
        return <File className="w-4 h-4 text-blue-400" />
      case 'image':
        return <Image className="w-4 h-4 text-green-400" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  // Función para hacer log de recursos seleccionados
  const logSelectedResources = () => {
    console.log('🎯 Recursos seleccionados:')
    console.table(selectedResources)

    // Log más detallado
    selectedResources.forEach((resource, index) => {
      console.log(`📄 Recurso ${index + 1}:`, {
        nombre: resource.name,
        bucket: resource.bucket,
        tipo: resource.type,
        rutaCompleta: resource.fullPath,
        urlPotencial: `https://qtxtgtqffqvcoowlakoo.supabase.co/storage/v1/object/public/${resource.bucket}/${resource.fullPath}`
      })
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

        {/* Canvas de Unity - Posición central */}
        <canvas
          id="unity-canvas"
          ref={canvasRef}
          width={960}
          height={600}
          tabIndex={-1}
          className="w-[960px] h-[600px]"
        />

        {/* Controles de Unity - Posición superior derecha */}
        <div className="flex justify-end items-center py-[10px] space-x-2">

          <button
            onClick={handleFullscreen}
            disabled={!unityLoaded}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            title="Activar Fullscreen"
          >
            {unityLoaded ? (
              <>
                <Maximize className="w-4 h-4" />
                <span>Fullscreen</span>
              </>
            ) : '⏳ Loading...'}
          </button>

        </div>
      </div>

      {/* Panel de Selección de Recursos */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px'
      }}>
        {/* Botón para mostrar/ocultar selector */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowResourceSelector(!showResourceSelector)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <FolderOpen className="w-5 h-5" />
            <span>{showResourceSelector ? 'Ocultar' : 'Mostrar'} Selector de Recursos</span>
            {selectedResources.length > 0 && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {selectedResources.length}
              </span>
            )}
          </button>
        </div>

        {/* Panel del selector */}
        {showResourceSelector && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">

            {/* Header con botones de acción */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Selector de Recursos</h3>
              <div className="flex items-center space-x-3">

                <span className="text-purple-200 text-sm">
                  {selectedResources.length} seleccionado{selectedResources.length !== 1 ? 's' : ''}
                </span>

                <button
                  // onClick={sendResourcesToUnity}
                  onClick={logSelectedResources}
                  disabled={!unityLoaded || selectedResources.length === 0}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  title="Enviar recursos seleccionados a Unity"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar a Unity</span>
                  {selectedResources.length > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {selectedResources.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setSelectedResources([])}
                  disabled={selectedResources.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  🗑️ Limpiar
                </button>
              </div>
            </div>

            {loadingResources ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-purple-200">Cargando recursos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Bucket: sample-data */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-white">sample-data</h4>
                    <span className="text-blue-200 text-sm">
                      {sampleDataFiles ? `${sampleDataFiles.totalFolders + sampleDataFiles.totalFiles} items` : '0 items'}
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {sampleDataFiles?.folders.map((folder) => {
                      const resource: SelectedResource = {
                        name: folder.name.replace('/', ''),
                        bucket: 'sample-data',
                        type: 'folder',
                        fullPath: folder.fullPath
                      }
                      const isSelected = isResourceSelected(resource)

                      return (
                        <div
                          key={folder.name}
                          onClick={() => toggleResourceSelection(resource)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${isSelected
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                            }`}
                        >
                          {getResourceIcon(folder)}
                          <span className="text-white flex-1">{resource.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-400" />}
                        </div>
                      )
                    })}

                    {sampleDataFiles?.files.map((file) => {
                      const resource: SelectedResource = {
                        name: file.name,
                        bucket: 'sample-data',
                        type: 'file',
                        fullPath: file.fullPath
                      }
                      const isSelected = isResourceSelected(resource)

                      return (
                        <div
                          key={file.name}
                          onClick={() => toggleResourceSelection(resource)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${isSelected
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                            }`}
                        >
                          {getResourceIcon(file)}
                          <div className="flex-1">
                            <span className="text-white block">{file.name}</span>
                            <span className="text-gray-400 text-xs">{file.extension?.toUpperCase()}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-green-400" />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Bucket: current-data */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-white">current-data</h4>
                    <span className="text-green-200 text-sm">
                      {currentDataFiles ? `${currentDataFiles.totalFolders + currentDataFiles.totalFiles} items` : '0 items'}
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {currentDataFiles?.folders.map((folder) => {
                      const resource: SelectedResource = {
                        name: folder.name.replace('/', ''),
                        bucket: 'current-data',
                        type: 'folder',
                        fullPath: folder.fullPath
                      }
                      const isSelected = isResourceSelected(resource)

                      return (
                        <div
                          key={folder.name}
                          onClick={() => toggleResourceSelection(resource)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${isSelected
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                            }`}
                        >
                          {getResourceIcon(folder)}
                          <span className="text-white flex-1">{resource.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-400" />}
                        </div>
                      )
                    })}

                    {currentDataFiles?.files.map((file) => {
                      const resource: SelectedResource = {
                        name: file.name,
                        bucket: 'current-data',
                        type: 'file',
                        fullPath: file.fullPath
                      }
                      const isSelected = isResourceSelected(resource)

                      return (
                        <div
                          key={file.name}
                          onClick={() => toggleResourceSelection(resource)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${isSelected
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                            }`}
                        >
                          {getResourceIcon(file)}
                          <div className="flex-1">
                            <span className="text-white block">{file.name}</span>
                            <span className="text-gray-400 text-xs">{file.extension?.toUpperCase()}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-green-400" />}
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}