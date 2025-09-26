import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonLinkProps {
  href: string
  children: React.ReactNode
  icon?: LucideIcon
  iconRight?: LucideIcon
  className?: string
}

export default function ButtonLink({
  href,
  children,
  icon: Icon,
  iconRight: IconRight,
  className
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Base glassmorphism button styles
        'bg-white/10 backdrop-blur-sm border border-white/20',
        'hover:bg-white/15 hover:border-white/30',
        'text-white font-semibold py-3 px-6 rounded-lg',
        'transition-all duration-200',
        'flex items-center justify-center space-x-2',
        'text-center',

        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      {IconRight && <IconRight className="w-4 h-4" />}
    </Link>
  )
}