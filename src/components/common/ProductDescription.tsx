import { useMemo } from 'react'

interface ProductDescriptionProps {
  html: string
  className?: string
}

export function ProductDescription({ html, className = '' }: ProductDescriptionProps) {
  const processedHtml = useMemo(() => {
    if (!html) return ''

    let processed = html

    // Remove IE conditional comments and script tags inside them
    processed = processed.replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '')
    processed = processed.replace(/<br\s*\/?>/gi, '') // Remove stray <br> near videos

    // Make wp-video divs responsive by removing fixed width
    processed = processed.replace(
      /<div[^>]*style="[^"]*width:\s*\d+px[^"]*"[^>]*class="wp-video"[^>]*>/gi,
      '<div class="video-container">'
    )

    // Also handle class before style
    processed = processed.replace(
      /<div[^>]*class="wp-video"[^>]*style="[^"]*width:\s*\d+px[^"]*"[^>]*>/gi,
      '<div class="video-container">'
    )

    // Add muted attribute to videos for autoplay to work
    processed = processed.replace(
      /<video([^>]*)>/gi,
      (match, attrs) => {
        if (!attrs.includes('muted')) {
          return `<video${attrs} muted playsinline>`
        }
        return match
      }
    )

    // Remove empty sections
    processed = processed.replace(/<section[^>]*>\s*<\/section>/gi, '')

    return processed
  }, [html])

  return (
    <div
      className={`product-description ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}
