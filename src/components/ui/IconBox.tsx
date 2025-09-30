import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconBoxProps {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const roundedSize = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl'
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
}

const iconSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
}

export default function IconBox({
  icon: Icon,
  size = 'md',
  className,
  onClick,
  disabled = false
}: IconBoxProps) {
  return (
    <div
      className={cn(
        // Base glassmorphism styles
        'bg-white/10 backdrop-blur-sm border border-white/20',
        'flex items-center justify-center',

        // Size
        sizeMap[size],
        roundedSize[size],

        // Interactive states
        onClick && !disabled && 'cursor-pointer hover:bg-white/15 hover:border-white/30 transition-all duration-200',
        disabled && 'opacity-50 cursor-not-allowed',

        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <Icon className={cn(
        'text-white',
        iconSizeMap[size]
      )} />
    </div>
  )
}