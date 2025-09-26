'use client'

import { useEffect, useRef, useState } from 'react'
import { FolderOpen, File, Image, Check, Maximize, Send, X, BrushCleaning } from 'lucide-react'
import Button from '@/components/ui/Button'

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
      script.src = `/unity/managed-games/Build/managed-games.loader.js`

      script.onload = async () => {
        const config = {
          arguments: [],
          dataUrl: `/unity/managed-games/Build/managed-games.data`,
          frameworkUrl: `/unity/managed-games/Build/managed-games.framework.js`,
          codeUrl: `/unity/managed-games/Build/managed-games.wasm`,
          streamingAssetsUrl: `/unity/managed-games/StreamingAssets`,
          companyName: "BroadStream-Coders",
          productName: "managed-games",
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
  }, [])

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
    // No me gusta tener que usar el h-[867px], el div, deberia de expandice en height al tamaño de su padre
    <div className="h-[867px] flex flex-col">

      <div className="flex flex-col items-center justify-center flex-1">

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
        <div className="w-[960px] flex justify-between items-center py-[10px] space-x-2">

          <Button onClick={() => setShowResourceSelector(true)} icon={FolderOpen}>
            Seleccionar Recursos
          </Button>

          <Button
            onClick={handleFullscreen}
            disabled={!unityLoaded}
            icon={Maximize}
            title="Activar Fullscreen"
          >
            {unityLoaded ? 'Fullscreen' : 'Loading...'}
          </Button>

        </div>
      </div>

      {/* Panel de Selección de Recursos */}
      <div style={{
        position: 'absolute',
        bottom: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px'
      }}>

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

                <Button
                  onClick={logSelectedResources}
                  disabled={!unityLoaded || selectedResources.length === 0}
                  icon={Send}>
                  Enviar a Unity
                </Button>

                <Button
                  onClick={() => setSelectedResources([])}
                  disabled={selectedResources.length === 0}
                  icon={BrushCleaning}>
                  Limpiar
                </Button>

                <Button onClick={() => setShowResourceSelector(false)} icon={X}>
                  Cerrar
                </Button>

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