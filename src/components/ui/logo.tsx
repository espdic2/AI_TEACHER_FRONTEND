import Link from "next/link"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]}`}>
          Class<span className="bg-blue-600 dark:bg-blue-500 text-white font-bold px-1 rounded">Matrix</span>
        </span>
      )}
    </Link>
  )
} 