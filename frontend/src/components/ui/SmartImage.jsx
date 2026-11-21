import { useState } from 'react'
import Art from '../art/Art'

/**
 * Shows real photography when the file exists; otherwise falls back to the
 * illustrated, clearly-labelled placeholder (Art). The photo fades in over
 * the artwork, so swapping assets in later needs no code changes.
 */
export default function SmartImage({ src, alt, art, className = '', imgClassName = '', artClassName = '', label = true, eager = false, position }) {
  const [state, setState] = useState(src ? 'loading' : 'missing')
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {state !== 'loaded' && <Art {...art} title={alt} className={`absolute inset-0 ${imgClassName} ${artClassName}`} />}
      {src && state !== 'missing' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('missing')}
          style={position ? { objectPosition: position } : undefined}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
      {label && state === 'missing' && (
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 z-[1] rounded-full border border-gold/50 bg-cream/80 px-2 py-0.5 text-[9px] tracking-[0.18em] text-cocoa/70 uppercase backdrop-blur-sm">
          Placeholder
        </span>
      )}
    </div>
  )
}
