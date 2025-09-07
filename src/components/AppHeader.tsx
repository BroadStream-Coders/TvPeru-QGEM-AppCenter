import Link from 'next/link'

export default function AppHeader() {
  return (
    <header className="border-b border-white/10 p-4 bg-transparent">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-3 text-white hover:text-red-200 transition-colors">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-red-600 font-bold text-lg">TV</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Que Gane El Mejor</h1>
            <p className="text-red-200 text-xs">App Center</p>
          </div>
        </Link>

        <div className="flex items-center space-x-6 text-white">
          <span className="text-red-200">TV Perú</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">En Vivo</span>
          </div>
        </div>
      </div>
    </header>
  )
}