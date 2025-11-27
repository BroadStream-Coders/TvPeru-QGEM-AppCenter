import {
  Check,
  Database,
  Zap,
  FolderOpen,
  FileText,
  Lock,
  Filter,
  RotateCcw,
  CloudDownload
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

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

        {/* Current Data */}
        <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center mb-6">
            <IconBox icon={FolderOpen} size="lg" className="mr-4" />
            <div>
              <h3 className="text-2xl font-bold mb-1">Datos Actuales</h3>
              <p className="text-red-200">current-data bucket</p>
            </div>
          </div>
          <p className="text-red-100 mb-6">
            Datos del programa del día actual. Información de concursos que será utilizada
            durante la transmisión en vivo entre los dos colegios competidores.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonLink href="/storage/current-data" className="flex-1">
              Explorar Storage →
            </ButtonLink>
          </div>
        </div>

        {/* Sample Data */}
        <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center mb-6">
            <IconBox icon={FolderOpen} size="lg" className="mr-4" />
            <div>
              <h3 className="text-2xl font-bold mb-1">Datos de Muestra</h3>
              <p className="text-red-200">sample-data bucket</p>
            </div>
          </div>
          <p className="text-red-100 mb-6">
            Datos de ejemplo para ensayos y pruebas. Permite a la producción practicar
            la dinámica de los juegos con los concursantes usando datos placeholder.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonLink href="/storage/sample-data" className="flex-1">
              Explorar Storage →
            </ButtonLink>
          </div>
        </div>

        {/* Data Collector */}
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

      {/* Features Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-16">
        <h3 className="text-3xl font-bold text-center mb-8">Características Principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <IconBox icon={Lock} size="md" className="mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Sin USB Físicos</h4>
            <p className="text-red-200 text-sm">Eliminación total de dispositivos físicos</p>
          </div>

          <div className="text-center">
            <IconBox icon={Filter} size="md" className="mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Gestión Centralizada</h4>
            <p className="text-red-200 text-sm">3 buckets especializados en Supabase</p>
          </div>

          <div className="text-center">
            <IconBox icon={RotateCcw} size="md" className="mx-auto mb-4" />
            <h4 className="font-semibold mb-2">API REST Integrada</h4>
            <p className="text-red-200 text-sm">Consumo interno y Google Apps Script</p>
          </div>

          <div className="text-center">
            <IconBox icon={CloudDownload} size="md" className="mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Backup Automático</h4>
            <p className="text-red-200 text-sm">Protección de datos en Supabase Storage</p>
          </div>
        </div>
      </div>

      {/* API Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <IconBox icon={Zap} size="xl" className="mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Sistema de Storage Especializado</h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            API REST integrada con Supabase Storage. Gestión inteligente de 3 buckets especializados:
            current-data (programa actual), sample-data (ensayos), config-data (configuraciones).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
              Ver Documentación API
            </button>
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
              Estado del Sistema
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}