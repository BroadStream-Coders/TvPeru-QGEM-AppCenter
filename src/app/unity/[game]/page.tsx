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
    <div style={{
      textAlign: 'center',
      padding: 0,
      border: 0,
      margin: 0,
      width: '100vw',
      height: '100vh'
    }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <canvas
          id="unity-canvas"
          ref={canvasRef}
          width={960}
          height={600}
          tabIndex={-1}
          style={{
            width: '960px',
            height: '600px',
            background: '#231F20'
          }}
        />
      </div>
    </div>
  )
}