export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 p-4 bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="mb-2 md:mb-0">
          <p className="text-red-200 text-sm">&copy; 2025 Esteban Abanto. Todos los derechos reservados.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-red-200 text-sm">Versión del Sistema: v1.0.0</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white">Operativo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}