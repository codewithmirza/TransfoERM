import NextImage from 'next/image'
import { ImageProps } from 'next/image'

export function Image(props: ImageProps) {
  return <NextImage {...props} loading="lazy" priority={false} />
}
