'use client'

import { forwardRef } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | string
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const buttonVariants = (variant: ButtonProps['variant'] = 'default') => {
  const variants: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-50'
  }
  return variants[variant] || variants.default
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  
  const sizes = {
    icon: 'h-9 w-9',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${buttonVariants(variant)} ${sizes[size]} ${className}`}
      {...props}
    />
  )
})

Button.displayName = 'Button'
