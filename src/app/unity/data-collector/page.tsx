'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize } from 'lucide-react'

declare global {
  interface Window {
    createUnityInstance: (canvas: HTMLCanvasElement, config: unknown) => Promise<unknown>
  }
}

export default function UnityPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Estado para Unity Instance
  const [unityInstance, setUnityInstance] = useState<any>(null)
  const [unityLoaded, setUnityLoaded] = useState(false)

  // Cargar Unity
  useEffect(() => {
    if (!canvasRef.current) return

    const loadUnity = async () => {
      const script = document.createElement('script')
      script.src = `/unity/data-collector/Build/data-collector.loader.js`

      script.onload = async () => {
        const config = {
          arguments: [],
          dataUrl: `/unity/data-collector/Build/data-collector.data`,
          frameworkUrl: `/unity/data-collector/Build/data-collector.framework.js`,
          codeUrl: `/unity/data-collector/Build/data-collector.wasm`,
          streamingAssetsUrl: `/unity/data-collector/StreamingAssets`,
          companyName: "BroadStream-Coders",
          productName: "data-collector",
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

  // Función para activar fullscreen
  const handleFullscreen = () => {
    if (unityInstance) {
      unityInstance.SetFullscreen(1)
      console.log('🔄 Activando fullscreen en Unity')
    } else {
      console.warn('⚠️ Unity instance no está disponible')
    }
  }

  return (

    // No me gusta tener que usar el h-[867px], el div, deberia de expandice en height al tamaño de su padre
    <div className="h-[867px] flex flex-col bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">

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
        <div className="w-[960px] flex justify-end items-center py-[10px] space-x-2">

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
    </div>
  )
}