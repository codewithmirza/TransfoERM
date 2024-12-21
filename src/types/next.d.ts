declare module 'next/navigation' {
  export { useRouter, usePathname, useSearchParams } from 'next/navigation'
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
} 