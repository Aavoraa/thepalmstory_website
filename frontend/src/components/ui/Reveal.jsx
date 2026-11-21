import { motion } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

export function Reveal({ children, delay = 0, y = 28, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Masked line-by-line text reveal for display headings */
export function TextReveal({ lines, className = '', lineClassName = '', delay = 0, as = 'h2', animateNow = false }) {
  const Tag = motion[as] || motion.h2
  const arr = Array.isArray(lines) ? lines : [lines]
  // Trigger on the (unclipped) heading itself; lines inherit via variants.
  const trigger = animateNow
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '-40px' } }
  return (
    <Tag className={className} initial="hide" {...trigger}>
      {arr.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            variants={{ hide: { y: '110%' }, show: { y: '0%' } }}
            transition={{ duration: 1.05, delay: delay + i * 0.12, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
