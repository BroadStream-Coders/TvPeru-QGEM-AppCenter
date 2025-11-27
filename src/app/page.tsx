export default function Home() {
  return (
    <div className="relative z-10 min-h-[80vh] flex items-center justify-center px-6">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-1/4 w-32 h-64 bg-cyan-400/20 blur-xl" />
        <div className="absolute left-8 top-1/3 w-24 h-48 bg-purple-500/20 blur-lg" />
        <div className="absolute left-16 top-1/2 w-20 h-40 bg-pink-400/20 blur-lg" />
        <div className="absolute left-4 top-2/3 w-28 h-56 bg-yellow-400/20 blur-xl" />

        <div className="absolute right-0 top-1/4 w-32 h-64 bg-pink-400/20 blur-xl" />
        <div className="absolute right-8 top-1/3 w-24 h-48 bg-cyan-400/20 blur-lg" />
        <div className="absolute right-16 top-1/2 w-20 h-40 bg-green-400/20 blur-lg" />
        <div className="absolute right-4 top-2/3 w-28 h-56 bg-blue-400/20 blur-xl" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">

        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
          <span className="block bg-gradient-to-r from-white via-cyan-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
            APP CENTER
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium tracking-wide">
          Sistema Centralizado de Gestión Interactiva
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-cyan-500/90 to-blue-600/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 transform group-hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-2">Juegos</h3>
              <p className="text-white/80">Experiencias interactivas en tiempo real</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-pink-500/90 to-purple-600/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 transform group-hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2">Datos</h3>
              <p className="text-white/80">Gestión centralizada de información</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-yellow-500/90 to-orange-600/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 transform group-hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-2">En Vivo</h3>
              <p className="text-white/80">Transmisión en directo TV Perú</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}