import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-white/10 p-4 bg-transparent">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        <Link href="/" className="group flex items-center space-x-3 text-white transition-all">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">TV</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all">
              Que Gane El Mejor
            </h1>
            <p className="text-white/60 text-xs font-medium">App Center</p>
          </div>
        </Link>

        <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
          </div>
          <span className="text-white font-semibold">Sistema Operativo</span>
          <span className="text-white/60">|</span>
          <span className="text-white/80">v1.0.0</span>
        </div>

      </div>
    </header>
  )
}