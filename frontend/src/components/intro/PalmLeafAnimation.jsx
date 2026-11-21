import { motion } from 'framer-motion'

const LEAFLETS = 13
const GREEN = ['#6E7A3E', '#7D8A45', '#8E9A52'] // muted palm greens
const EASE = [0.22, 1, 0.36, 1]

/**
 * A single palmyra frond whose leaflets unfold one by one from a closed
 * bundle into a fan, with a few drifting gold motes. Pure SVG + transforms.
 */
export default function PalmLeafAnimation({ start = 0, className = '' }) {
  const spread = 150 // degrees covered by the open fan
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="-160 -170 320 260" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="leaflet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5F6B34" />
            <stop offset="0.6" stopColor="#8E9A52" />
            <stop offset="1" stopColor="#B7B272" />
          </linearGradient>
        </defs>

        {/* stem grows first */}
        <motion.path
          d="M0 90 C 2 60, 0 30, 0 0"
          stroke="#A87935"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: start, ease: EASE }}
        />

        {/* leaflets: each one is placed at its fan angle (static SVG transform)
            and unfurls outward from the hub, centre leaflets first */}
        {Array.from({ length: LEAFLETS }, (_, i) => {
          const t = i / (LEAFLETS - 1)
          const angle = -90 - spread / 2 + t * spread
          const len = 120 + Math.sin(t * Math.PI) * 40
          const delay = start + 0.25 + Math.abs(t - 0.5) * 0.8
          return (
            <g key={i} transform={`rotate(${angle})`}>
              <motion.g
                initial={{ scaleX: 0.05, scaleY: 0.4, opacity: 0 }}
                animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.85, delay, ease: EASE }}
                style={{ originX: 0, originY: 0.5 }}
              >
                <path
                  d={`M0 0 C ${len * 0.35} -7, ${len * 0.75} -5, ${len} 0 C ${len * 0.75} 5, ${len * 0.35} 7, 0 0 Z`}
                  fill={i % 3 === 0 ? 'url(#leaflet)' : GREEN[i % 3]}
                  opacity="0.95"
                />
                <path d={`M4 0 L ${len - 6} 0`} stroke="#E8D9A8" strokeWidth="0.6" opacity="0.5" />
              </motion.g>
            </g>
          )
        })}
        {/* hub */}
        <motion.circle r="5" fill="#A87935" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: start + 0.3, duration: 0.4 }} />
      </svg>

      {/* gold motes */}
      {Array.from({ length: 7 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold-soft shadow-[0_0_8px_2px_rgba(217,183,126,0.7)]"
          style={{ left: `${20 + ((i * 41) % 60)}%`, top: `${25 + ((i * 29) % 45)}%` }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -40 }}
          transition={{ duration: 1.8, delay: start + 0.4 + i * 0.12, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
