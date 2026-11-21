import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { HERO_BANNERS, BRAND_VIDEO } from '../../data/site'
import { EASE } from '../ui/Reveal'

const INTERVAL = 8000

/**
 * Full-width banner slideshow. The artwork carries its own headline and CTA,
 * so each slide is one link. Auto-advances right-to-left every 8s, pauses on
 * hover/focus, supports arrows, dots, keyboard and swipe.
 */
export default function Hero() {
  const [[index, dir], setState] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const touch = useRef(null)
  const n = HERO_BANNERS.length
  const go = useCallback((d) => setState(([i]) => [(i + d + n) % n, d]), [n])
  const to = (i) => setState(([cur]) => [i, i > cur ? 1 : -1])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go(1), INTERVAL)
    return () => clearTimeout(t)
  }, [index, paused, go])

  // preload the other banners so transitions never flash
  useEffect(() => {
    HERO_BANNERS.forEach((b) => {
      const img = new Image()
      img.src = window.innerWidth < 640 ? b.imageSm : b.image
    })
  }, [])

  const slide = HERO_BANNERS[index]

  return (
    <section aria-label="Featured" className="container-site pt-4 pb-12 sm:pt-5 lg:pb-16">
      {/* columns sized by aspect ratio (9:16 video + 1672:941 banner) so both share one height */}
      <div
        style={{ maxWidth: 'min(1440px, calc((100svh - 200px) * (9 / 16 + 1672 / 941) + 20px))' }}
        className="mx-auto grid w-full gap-4 lg:grid-cols-[0.5625fr_1.7768fr] lg:gap-5"
      >
      <BrandVideo />
      <div
        className="group relative aspect-[1672/941] w-full overflow-hidden rounded-md bg-peach shadow-[0_30px_60px_-40px_rgba(43,18,13,0.5)] lg:order-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1)
          if (e.key === 'ArrowRight') go(1)
        }}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - (touch.current ?? 0)
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        }}
        aria-roledescription="carousel"
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            variants={{
              enter: (d) => ({ x: d > 0 ? '100%' : '-100%' }),
              center: { x: '0%' },
              exit: (d) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0.5 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute inset-0"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${n}`}
          >
            <Link to={slide.to} aria-label={slide.label} className="block h-full w-full">
              <motion.picture
                className="block h-full w-full"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: INTERVAL / 1000 + 1, ease: 'linear' }}
              >
                <source media="(max-width: 640px)" srcSet={slide.imageSm} />
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="h-full w-full object-cover"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  draggable="false"
                />
              </motion.picture>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* arrows (phones use swipe) */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous banner"
          className="absolute top-1/2 left-2 z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-espresso shadow-md backdrop-blur transition-all hover:bg-cocoa hover:text-ivory sm:left-4 sm:grid sm:h-11 sm:w-11 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
        >
          <ChevronLeft size={18} strokeWidth={1.6} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next banner"
          className="absolute top-1/2 right-2 z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-espresso shadow-md backdrop-blur transition-all hover:bg-cocoa hover:text-ivory sm:right-4 sm:grid sm:h-11 sm:w-11 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
        >
          <ChevronRight size={18} strokeWidth={1.6} />
        </button>

        {/* pagination with timing bar */}
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-espresso/35 px-2.5 py-1.5 backdrop-blur sm:bottom-4 sm:gap-2" role="tablist" aria-label="Choose banner">
          {HERO_BANNERS.map((b, i) => (
            <button key={b.id} role="tab" aria-selected={i === index} aria-label={`Banner ${i + 1}: ${b.label}`} onClick={() => to(i)} className="relative grid h-3 place-items-center">
              <span className={`block h-[3px] rounded-full bg-white/45 transition-all duration-500 ${i === index ? 'w-7 sm:w-10' : 'w-[6px]'}`} />
              {i === index && (
                <motion.span
                  key={`${index}-${paused}`}
                  className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-white"
                  initial={{ width: paused ? '100%' : '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}

/** 9:16 brand film beside the banners: autoplay, muted, looped, inline, with a sound toggle. */
function BrandVideo() {
  const ref = useRef(null)
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // pause while off-screen to save data and battery
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted) v.play().catch(() => {})
  }

  if (failed) return null

  return (
    <div className="relative order-2 mx-auto aspect-[9/16] w-full max-w-[280px] sm:max-w-[340px] overflow-hidden rounded-md bg-espresso shadow-[0_30px_60px_-40px_rgba(43,18,13,0.5)] lg:order-1 lg:max-w-none">
      <motion.video
        ref={ref}
        src={BRAND_VIDEO.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        aria-label="The Palm Story brand film"
        onCanPlay={() => setReady(true)}
        onError={() => setFailed(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-espresso/55 text-ivory ring-1 ring-ivory/25 backdrop-blur transition-colors hover:bg-ivory hover:text-cocoa"
      >
        {muted ? <VolumeX size={15} strokeWidth={1.6} /> : <Volume2 size={15} strokeWidth={1.6} />}
      </button>
    </div>
  )
}
