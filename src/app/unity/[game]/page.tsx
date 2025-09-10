'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'

declare global {
  interface Window {
    createUnityInstance: (canvas: HTMLCanvasElement, config: unknown) => Promise<unknown>
  }
}

export default function UnityPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const params = useParams()
  const game = params.game as string

  useEffect(() => {
    if (!canvasRef.current) return

    const loadUnity = async () => {
      // Cargar el script de Unity
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
          await window.createUnityInstance(canvasRef.current!, config)
        } catch (message) {
          alert(message)
        }
      }

      document.head.appendChild(script)
    }

    loadUnity()
  }, [game])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <canvas
          id="unity-canvas"
          ref={canvasRef}
          width={960}
          height={600}
          tabIndex={-1}
          className="w-[960px] h-[600px]"
        />
      </div>
    </div>
  )
}