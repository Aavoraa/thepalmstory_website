import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * Pill CTA that leans toward the cursor, sweeps a gold shimmer on hover,
 * slides its arrow and ripples on click. Keyboard focus gets the same glow.
 */
export default function MagneticButton({ to, children, className = '', variant = 'solid', icon: Icon }) {
  const outline = variant === 'outline'
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const [ripples, setRipples] = useState([])

  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.38)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  const ripple = (e) => {
    const r = ref.current.getBoundingClientRect()
    const id = Date.now()
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    setTimeout(() => setRipples((rs) => rs.filter((p) => p.id !== id)), 700)
  }

  return (
    <motion.span style={{ x, y }} className="inline-block" onMouseMove={move} onMouseLeave={reset}>
      <Link
        ref={ref}
        to={to}
        onClick={ripple}
        className={`group/cta relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-[12px] font-semibold tracking-[0.2em] uppercase ring-1 transition-[color,box-shadow] duration-500 focus-visible:shadow-[0_0_0_4px_rgba(168,121,53,0.35)] ${
          outline
            ? 'bg-white/60 text-cocoa ring-cocoa/50 hover:text-ivory hover:shadow-[0_14px_30px_-12px_rgba(93,23,19,0.7)]'
            : 'bg-gradient-to-b from-cocoa to-espresso text-ivory shadow-[0_10px_24px_-10px_rgba(93,23,19,0.75)] ring-gold/60 hover:shadow-[0_16px_34px_-10px_rgba(93,23,19,0.9),0_0_0_4px_rgba(168,121,53,0.18)]'
        } ${className}`}
      >
        {/* outline variant: maroon fill rises from the bottom on hover */}
        {outline && (
          <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 rounded-full bg-gradient-to-b from-cocoa to-espresso transition-transform duration-500 ease-[var(--ease-lux)] group-hover/cta:scale-y-100" />
        )}
        {/* shimmer sweep */}
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-gold-soft/40 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-[320%]" />
        {Icon && <Icon size={17} strokeWidth={1.6} className="relative transition-transform duration-500 group-hover/cta:-rotate-12 group-hover/cta:scale-110" />}
        <span className="relative">{children}</span>
        <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-full">
          <ArrowRight size={15} strokeWidth={1.8} className="absolute transition-transform duration-300 group-hover/cta:translate-x-6" />
          <ArrowRight size={15} strokeWidth={1.8} className="absolute -translate-x-6 transition-transform duration-300 group-hover/cta:translate-x-0" />
        </span>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute h-10 w-10 rounded-full bg-gold-soft/50"
            style={{ left: r.x - 20, top: r.y - 20 }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        ))}
      </Link>
    </motion.span>
  )
}
