import { Github, Linkedin, Globe } from "lucide-react";
import SocialIcon from "@/ui/SocialIcon";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 p-4 bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="mb-2 md:mb-0 text-sm text-gray-400">
          <p>Hecho con ❤️ y dedicación.</p>
          <p >&copy; 2025 Esteban Abanto.</p>
        </div>

        <div className="flex items-center space-x-4">
          <SocialIcon
            href="https://www.linkedin.com/in/esteban-abanto/"
            ariaLabel="LinkedIn"
            Icon={Linkedin}
            glowClass="bg-blue-500/20"
            hoverClass="group-hover:text-blue-400"
          />

          <SocialIcon
            href="https://github.com/esteban-abanto-2709"
            ariaLabel="GitHub"
            Icon={Github}
            glowClass="bg-green-500/20"
            hoverClass="group-hover:text-green-400"
          />

          <SocialIcon
            href="https://esteban-abanto.vercel.app"
            ariaLabel="Esteban Abanto Website"
            Icon={Globe}
            glowClass="bg-yellow-500/20"
            hoverClass="group-hover:text-yellow-400"
          />
        </div>
      </div>
    </footer>
  )
}