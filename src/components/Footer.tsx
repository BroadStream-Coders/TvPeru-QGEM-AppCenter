import { Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 p-4 bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="mb-2 md:mb-0">
          <p className="text-red-200 text-sm">&copy; 2025 Esteban Abanto. Todos los derechos reservados.</p>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://www.linkedin.com/in/esteban-abanto/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            aria-label="LinkedIn"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 hover:border-blue-400/50 transition-all group-hover:bg-white/15">
              <Linkedin className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
            </div>
          </a>

          <a
            href="https://github.com/esteban-abanto-2709"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            aria-label="GitHub"
          >
            <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 hover:border-purple-400/50 transition-all group-hover:bg-white/15">
              <Github className="w-5 h-5 text-white group-hover:text-purple-400 transition-colors" />
            </div>
          </a>
        </div>
      </div>
    </footer>
  )
}