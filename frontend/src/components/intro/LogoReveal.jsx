import { useId } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Draws the official D-shaped emblem with SVG stroke animation.
 * The visible artwork is the exact logo file (assets/logo/emblem.png) — the
 * animated strokes are a MASK that reveals it, so proportions are never
 * redrawn or approximated. Order: D outline → gold arc → palm frond,
 * then an antique-gold light sweep clipped to the emblem's shape.
 */
export default function LogoReveal({ start = 0, className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const src = '/images/logo/emblem.png'
  const W = 470
  const H = 600

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-label="The Palm Story emblem" role="img">
        <defs>
          <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect width={W} height={H} fill="black" />
            {/* D: left stem → base → tall right side → top hook */}
            <motion.path
              d="M82 330 L82 560 Q82 588 130 588 L300 588 Q428 588 428 430 L428 150 Q428 22 262 18"
              stroke="white"
              strokeWidth="96"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.95, delay: start, ease: [0.65, 0, 0.35, 1] }}
            />
            {/* thin gold arc around the frond */}
            <motion.path
              d="M16 182 A 168 168 0 1 1 186 404"
              stroke="white"
              strokeWidth="34"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: start + 0.45, ease: EASE }}
            />
            {/* the frond blooms from its stem */}
            <motion.circle
              cx="80"
              cy="330"
              fill="white"
              initial={{ r: 0 }}
              animate={{ r: 330 }}
              transition={{ duration: 0.8, delay: start + 0.75, ease: EASE }}
            />
          </mask>
        </defs>
        <image href={src} width={W} height={H} mask={`url(#m${id})`} />
      </svg>

      {/* antique-gold light sweep, clipped to the emblem's exact shape */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          backgroundImage: 'linear-gradient(105deg, transparent 35%, rgba(255,236,190,0.95) 48%, rgba(217,183,126,0.6) 52%, transparent 65%)',
          backgroundSize: '250% 100%',
        }}
        initial={{ backgroundPositionX: '120%' }}
        animate={{ backgroundPositionX: '-20%' }}
        transition={{ duration: 1.1, delay: start + 1.35, ease: 'easeInOut' }}
      />
    </div>
  )
}
