import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: LucideIcon
  iconRight?: LucideIcon
  className?: string
  title?: string
}

export default function Button({
  children,
  onClick,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  title,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        // Base glassmorphism button styles
        'bg-white/10 backdrop-blur-sm border border-white/20',
        'hover:bg-white/15 hover:border-white/30',
        'text-white font-semibold py-2 px-5 rounded-lg',
        'transition-all duration-200',
        'flex items-center justify-center space-x-2',

        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white/10 hover:border-white/20',

        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      {IconRight && <IconRight className="w-4 h-4" />}
    </button>
  )
}