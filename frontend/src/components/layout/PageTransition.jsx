import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const COVER = 0.4 // s — ivory sheet sweeps up over the old page
const DROP = 0.45 // s — the wax seal falls and stamps
const HOLD = 0.25 // s — beat after the stamp
const REVEAL = 0.6 // s — sheet lifts away to show the new page
const TOTAL = COVER + DROP + HOLD + REVEAL

/**
 * Page entry animation for every route change (the first load already has
 * the curtains + loader). An ivory sheet sweeps over the page, The Palm Story
 * wax seal drops from above and stamps in the centre — gold ripple, wax
 * flecks — then the sheet lifts away to reveal the new page.
 */
export default function PageTransition() {
  const { pathname } = useLocation()
  const prev = useRef(pathname) // only react to real route changes (StrictMode-safe)
  const [run, setRun] = useState(0) // bumps per navigation (animation key)
  const [active, setActive] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prev.current === pathname) return
    prev.current = pathname
    if (reduced) return
    setRun((n) => n + 1)
    setActive(true)
    const t = setTimeout(() => setActive(false), TOTAL * 1000 + 100)
    return () => clearTimeout(t)
  }, [pathname, reduced])

  const stampAt = COVER + DROP

  return (
    <AnimatePresence>
      {active && (
        <motion.div key={run} className="pointer-events-auto fixed inset-0 z-[300]" aria-hidden="true">
          {/* the sheet */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#FDF8F0,#F7EDE0_55%,#EFE0CB)]"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'] }}
            transition={{ duration: TOTAL, times: [0, COVER / TOTAL, (COVER + DROP + HOLD) / TOTAL, 1], ease: [0.76, 0, 0.24, 1] }}
          >
            {/* gold edge riding the sheet */}
            <motion.span
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ top: '100%', opacity: 1 }}
              animate={{ top: ['100%', '0%', '0%', '0%'], opacity: [1, 1, 0, 0] }}
              transition={{ duration: TOTAL, times: [0, COVER / TOTAL, (COVER + 0.1) / TOTAL, 1] }}
            />
          </motion.div>

          {/* centre stage: shadow, seal, impact */}
          <div className="absolute top-1/2 left-1/2 w-28 -translate-x-1/2 -translate-y-1/2 sm:w-36">
            {/* shadow sharpening as the seal falls */}
            <motion.span
              className="absolute inset-0 translate-y-3 rounded-full bg-espresso"
              initial={{ scale: 1.8, opacity: 0, filter: 'blur(22px)' }}
              animate={{
                scale: [1.8, 1.8, 1, 1, 1],
                opacity: [0, 0.08, 0.4, 0.4, 0],
                filter: ['blur(22px)', 'blur(22px)', 'blur(6px)', 'blur(6px)', 'blur(6px)'],
              }}
              transition={{ duration: TOTAL, times: [0, COVER / TOTAL, stampAt / TOTAL, (stampAt + HOLD) / TOTAL, 1] }}
            />
            {/* the seal */}
            <motion.img
              src="/images/heritage/wax-seal.png"
              alt=""
              className="relative w-full drop-shadow-[0_12px_14px_rgba(43,18,13,0.45)]"
              initial={{ y: -380, rotate: -50, scale: 1.9, opacity: 0 }}
              animate={{
                y: [-380, -380, 0, 0, -40],
                rotate: [-50, -50, 0, 0, 0],
                scale: [1.9, 1.9, 1, 1, 0.9],
                scaleY: [1, 1, 0.86, 1, 1],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: TOTAL,
                times: [0, COVER / TOTAL, stampAt / TOTAL, (stampAt + 0.12) / TOTAL, 1],
                ease: [[0, 0, 1, 1], [0.5, 0, 0.9, 0.6], [0.2, 0.8, 0.4, 1], [0.5, 0, 0.75, 0]],
              }}
            />
            {/* gold ripple */}
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-gold/80"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 0.6, 2.3], opacity: [0, 0.9, 0] }}
              transition={{ duration: stampAt + 0.7, times: [0, stampAt / (stampAt + 0.7), 1], ease: 'easeOut' }}
            />
            {/* wax flecks */}
            {Array.from({ length: 10 }, (_, k) => {
              const a = (k / 10) * Math.PI * 2
              return (
                <motion.span
                  key={k}
                  className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-[#9A3A22]"
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x: [0, 0, Math.cos(a) * 90], y: [0, 0, Math.sin(a) * 90], opacity: [0, 1, 0] }}
                  transition={{ duration: stampAt + 0.6, times: [0, stampAt / (stampAt + 0.6), 1], ease: 'easeOut' }}
                />
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
