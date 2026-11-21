import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Site-wide inertia ("buttery") scrolling via Lenis.
 * - Scrolls the real window, so Framer Motion's useScroll / whileInView keep working.
 * - Skipped when the visitor prefers reduced motion.
 * - Elements marked `data-lenis-prevent` (drawers, menus, overlays) scroll natively.
 */
let lenis = null

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out expo
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.4,
    anchors: { offset: -90 },
    autoRaf: true,
  })
  return lenis
}

export function stopSmoothScroll() {
  lenis?.destroy()
  lenis = null
}

/** Jump/scroll that works with or without Lenis */
export function scrollToTop({ immediate = true } = {}) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' })
}

/** Pause page scrolling while a modal/drawer is open */
export function lockScroll(locked) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}
