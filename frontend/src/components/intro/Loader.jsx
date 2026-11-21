import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '../ui/Reveal'

/**
 * Minimal first-load screen.
 * The palm mark fills up from the bottom like warm syrup while a hairline and
 * counter run to 100. When the page is ready, a gold ring pulses, the content
 * drifts up, and the ivory panel lifts away with a curved edge.
 *
 * Shows for at least MIN_MS (so it never flashes) and at most MAX_MS (never blocks a slow network).
 */
const MIN_MS = 1800
const MAX_MS = 4500
const WORD = 'THE PALM STORY'

export default function Loader({ onExitStart, onDone }) {
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState('load') // load → done (100%) → exit
  const ready = useRef(false)
  const start = useRef(performance.now())

  // page ready = window load (images, fonts) — capped so a slow asset never blocks
  useEffect(() => {
    const mark = () => (ready.current = true)
    if (document.readyState === 'complete') mark()
    else window.addEventListener('load', mark, { once: true })
    const cap = setTimeout(mark, MAX_MS)
    return () => {
      window.removeEventListener('load', mark)
      clearTimeout(cap)
    }
  }, [])

  // counter: eases toward 90 while loading, then runs to 100 once ready + minimum time passed
  useEffect(() => {
    let raf
    let shown = 0
    const tick = () => {
      const t = performance.now() - start.current
      const canFinish = ready.current && t >= MIN_MS
      const target = canFinish ? 100 : Math.min(90, (t / MIN_MS) * 90)
      shown += (target - shown) * (canFinish ? 0.14 : 0.08)
      if (canFinish && shown > 99.5) shown = 100
      setPct(shown)
      if (shown >= 100) {
        setPhase('done')
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // 100% → short pause for the ring pulse → lift away
  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => {
      setPhase('exit')
      onExitStart?.()
    }, 520)
    return () => clearTimeout(t)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const fill = `inset(${100 - pct}% 0% 0% 0%)`
  const exiting = phase === 'exit'

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!exiting && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading The Palm Story, ${Math.round(pct)} percent`}
          initial={{ clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0% round 0% 0% 50% 50%)' }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[500] grid place-items-center bg-[#F7F3EA]"
        >
          {/* faint palm shadow */}
          <motion.img
            src="/images/brand/palm-shadow-right.jpg"
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 0.35, x: 0 }}
            transition={{ duration: 2.4, ease: EASE }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right mix-blend-multiply [mask-image:linear-gradient(90deg,transparent_5%,#000_60%)]"
          />

          <motion.div
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative flex flex-col items-center"
          >
            {/* the mark: faint outline + a copy that fills from the bottom */}
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: phase === 'done' ? 1.06 : 1 }}
              transition={{ duration: phase === 'done' ? 0.45 : 0.9, ease: EASE }}
              className="relative h-24 w-[76px] sm:h-28 sm:w-[88px]"
            >
              <img src="/images/logo/mark.png" alt="" className="absolute inset-0 h-full w-full object-contain opacity-[0.13] grayscale" />
              <img src="/images/logo/mark.png" alt="" style={{ clipPath: fill }} className="absolute inset-0 h-full w-full object-contain" />
              {/* syrup line riding the fill edge */}
              <span
                aria-hidden="true"
                style={{ bottom: `${pct}%`, opacity: pct > 2 && pct < 99 ? 1 : 0 }}
                className="absolute inset-x-1 h-px bg-[linear-gradient(90deg,transparent,#C9A15E,transparent)] transition-opacity duration-300"
              />
              {/* gold ring pulse at 100% */}
              <AnimatePresence>
                {phase === 'done' && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ opacity: 0.7, scale: 0.6 }}
                    animate={{ opacity: 0, scale: 2.1 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* wordmark, letter by letter */}
            <p className="mt-6 flex font-serif text-[13px] tracking-[0.42em] text-cocoa sm:text-[15px]" aria-hidden="true">
              {WORD.split('').map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.045, ease: EASE }}
                  className="inline-block"
                >
                  {c === ' ' ? ' ' : c}
                </motion.span>
              ))}
            </p>

            {/* hairline + counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-7 flex w-[200px] items-center gap-3 sm:w-[240px]"
            >
              <span className="relative h-px flex-1 overflow-hidden bg-cocoa/15">
                <span className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#8E5F25,#C9A15E)]" style={{ width: `${pct}%` }} />
              </span>
              <span className="w-9 text-right font-serif text-sm text-cocoa tabular-nums">{String(Math.round(pct)).padStart(2, '0')}</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-3 text-[10px] tracking-[0.3em] text-cocoa-70 uppercase"
            >
              {phase === 'load' ? 'Simmering something sweet' : 'Ready'}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
