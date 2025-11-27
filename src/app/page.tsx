import {
  Check,
  Database,
  Zap,
  FileText,
} from 'lucide-react'

import IconBox from '@/components/ui/IconBox'
import ButtonLink from "@/components/ui/ButtonLink";

export default function Home() {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
          App Center
        </h2>
        <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
          Sistema centralizado para el programa {'"Que Gane El Mejor"'} - Gestión unificada de datos educativos para concursos entre colegios
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <IconBox icon={Check} size="md" className="mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Sistema Activo</h3>
            <p className="text-red-200 text-sm">Todos los servicios funcionando correctamente</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <IconBox icon={Database} size="md" className="mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Supabase Storage</h3>
            <p className="text-red-200 text-sm">3 buckets especializados para gestión de datos</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <IconBox icon={Zap} size="md" className="mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Pre-Producción</h3>
            <p className="text-red-200 text-sm">Listo para transmisiones en 3 semanas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center mb-6">
            <IconBox icon={FileText} size="lg" className="mr-4" />
            <div>
              <h3 className="text-2xl font-bold mb-1">Data Collector</h3>
              <p className="text-red-200">Procesamiento de datos Unity WebGL</p>
            </div>
          </div>
          <p className="text-red-100 mb-6">
            Herramienta Unity para procesar datos educativos filtrados por analistas.
            Genera archivos JSON estructurados (uno por juego) listos para transmisión.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonLink href="/unity/data-collector" className="flex-1">
              Abrir Aplicación →
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}