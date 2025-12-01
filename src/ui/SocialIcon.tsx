import { type FC } from "react";

interface SocialIconProps {
  href: string;
  ariaLabel: string;
  Icon: FC<{ className?: string }>;
  glowClass: string;
  hoverClass: string;
}

export default function SocialIcon({
  href,
  ariaLabel,
  Icon,
  glowClass,
  hoverClass,
}: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative"
      aria-label={ariaLabel}
    >
      <div
        className={`absolute inset-0 ${glowClass} rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <div
        className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg 
        flex items-center justify-center border border-white/20 
        transition-all group-hover:bg-white/15"
      >
        <Icon
          className={`w-5 h-5 text-white ${hoverClass} transition-colors`}
        />
      </div>
    </a>
  );
}
