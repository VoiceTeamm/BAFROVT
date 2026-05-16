import { cn } from '../../lib/utils'

type Size = 'sm' | 'md' | 'lg'

interface LoaderProps {
  size?: Size
  fullPage?: boolean
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
}

export function Loader({ size = 'md', fullPage = false, className }: LoaderProps) {
  const spinner = (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-primary border-t-transparent animate-spin',
        sizeClasses[size],
        className,
      )}
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background-light/80 z-50">
        <Loader size="lg" />
      </div>
    )
  }

  return spinner
}
