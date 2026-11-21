import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import ProductCard from '../ui/ProductCard'
import { featuredProducts, PRODUCTS } from '../../data/products'

const TABS = [
  ['all', 'All', () => true],
  ['coveted', 'Most coveted', (p) => ['Bestseller', 'Signature'].includes(p.badge)],
  ['karupatti', 'Pure Karupatti', (p) => p.category === 'sweets' && p.ingredients.some((i) => i.includes('Karupatti'))],
  ['tins', 'Festive tins', (p) => p.gift],
]

const SPEED = 48 // px per second — steady drift (eases to a stop on hover)
const RESUME_AFTER = 3000 // ms of no interaction before auto-scroll resumes
const GAP = 20

export default function FeaturedCarousel({
  products,
  eyebrow = 'Royal pantry reserves',
  title = 'A Collection of Sweet Moments',
  text = 'Thoughtfully crafted treats that bring tradition and taste together.',
  tabs = true,
  className = '',
  viewAll = { label: 'View all confections', to: '/shop' },
  autoScroll = true,
}) {
  const track = useRef(null)
  const pos = useRef(0)
  const hovering = useRef(false)
  const focused = useRef(false) // keyboard focus inside the track
  const vel = useRef(0) // current drift speed, eased toward SPEED or 0
  const written = useRef(-1) // scrollLeft as last set by the drift (browsers round it to device pixels)
  const idleUntil = useRef(0)
  const visible = useRef(true)
  const [tab, setTab] = useState('all')
  const bar = useRef(null)
  // progress bar is updated directly (no re-render every frame)
  const setProgress = (v) => {
    if (bar.current) bar.current.style.width = `${12 + Math.min(1, Math.max(0, v)) * 88}%`
  }
  const [loop, setLoop] = useState(false)

  const list = useMemo(() => {
    if (products) return products
    const f = TABS.find((t) => t[0] === tab)[2]
    return tab === 'all' ? featuredProducts() : PRODUCTS.filter(f)
  }, [products, tab])

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // only loop when the cards overflow the track
  useEffect(() => {
    const check = () => {
      const el = track.current
      if (!el) return
      const cardW = el.querySelector('[data-card]')?.offsetWidth || 260
      setLoop(autoScroll && !reduced && list.length * (cardW + GAP) > el.clientWidth + 40)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [list, autoScroll, reduced])

  // width of one full copy of the list (distance to the first duplicated card)
  const period = useCallback(() => {
    const el = track.current
    if (!el) return 0
    const cards = el.querySelectorAll('[data-card]')
    return loop && cards[list.length] ? cards[list.length].offsetLeft - cards[0].offsetLeft : el.scrollWidth - el.clientWidth
  }, [loop, list.length])

  const sync = useCallback(() => {
    const el = track.current
    if (!el) return
    const p = period()
    if (loop && p > 0) {
      if (el.scrollLeft >= p) el.scrollLeft -= p
      setProgress((el.scrollLeft % p) / p)
    } else {
      setProgress(p > 0 ? el.scrollLeft / p : 0)
    }
    // keep the fractional drift position unless the user actually moved the track
    if (Math.abs(el.scrollLeft - written.current) > 1.5) pos.current = el.scrollLeft
  }, [loop, period])

  useEffect(() => {
    if (track.current) track.current.scrollLeft = 0
    pos.current = 0
    setProgress(0)
  }, [list])

  // pause while off-screen
  useEffect(() => {
    const el = track.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // continuous drift
  useEffect(() => {
    if (!loop) return
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(64, now - last) / 1000
      last = now
      const el = track.current
      const run = visible.current && !hovering.current && !focused.current && now > idleUntil.current && !document.hidden
      // ease in/out so hovering glides to a stop and leaving glides back up to speed
      vel.current += ((run ? SPEED : 0) - vel.current) * Math.min(1, dt * (run ? 2.5 : 9))
      if (vel.current < 0.5 && !run) vel.current = 0
      if (el && vel.current > 0) {
        const p = period()
        pos.current += vel.current * dt
        if (p > 0 && pos.current >= p) pos.current -= p
        el.scrollLeft = pos.current
        written.current = el.scrollLeft
        if (p > 0) setProgress(pos.current / p)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [loop, period])

  const interact = () => {
    idleUntil.current = performance.now() + RESUME_AFTER
  }

  const scroll = (d) => {
    interact()
    const el = track.current
    const card = el.querySelector('[data-card]')
    const step = card ? card.offsetWidth + GAP : 280
    const p = period()
    if (loop && d < 0 && el.scrollLeft < step && p > 0) el.scrollLeft += p // wrap backwards seamlessly
    el.scrollBy({ left: d * step, behavior: 'smooth' })
  }

  const arrow = 'grid h-9 w-9 place-items-center rounded-full bg-white text-espresso shadow-sm ring-1 ring-beige transition-colors hover:bg-cocoa hover:text-ivory'
  const items = loop ? [...list.map((p) => [p, 0]), ...list.map((p) => [p, 1])] : list.map((p) => [p, 0])

  return (
    <section className={`overflow-hidden py-20 lg:py-8 ${className}`}>
      <div className="container-site flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading align="left" eyebrow={eyebrow} title={title} text={text} />
        <div className="flex flex-wrap items-center gap-3">
          {tabs && !products ? (
            <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-md bg-peach p-1" role="tablist" aria-label="Filter products">
              {TABS.map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`relative shrink-0 rounded px-3.5 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${tab === id ? 'text-espresso' : 'text-cocoa-70 hover:text-espresso'}`}
                >
                  {tab === id && <motion.span layoutId="feat-tab" className="absolute inset-0 rounded bg-white shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
          ) : (
            <Link to={viewAll.to} className="link-lux mr-2 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-gold uppercase">
              {viewAll.label} <ArrowRight size={13} />
            </Link>
          )}
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className={arrow}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className={arrow}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={track}
        onScroll={sync}
        onPointerEnter={(e) => e.pointerType === 'mouse' && (hovering.current = true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && (hovering.current = false)}
        onFocus={(e) => (focused.current = e.target.matches(':focus-visible'))}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && (focused.current = false)}
        onPointerDown={interact}
        onTouchStart={interact}
        onWheel={interact}
        aria-label={`${title} — products`}
        className={`no-scrollbar mt-10 flex gap-5 overflow-x-auto px-4 pb-6 sm:px-8 lg:mt-6 lg:px-[max(3.5rem,calc((100vw_-_1440px)/2_+_3.5rem))] lg:pb-4 ${
          loop ? '' : 'snap-x snap-mandatory scroll-pl-4 scroll-smooth sm:scroll-pl-8 lg:scroll-pl-[max(3.5rem,calc((100vw_-_1440px)/2_+_3.5rem))]'
        }`}
      >
        {items.map(([p, copy], i) => (
          <motion.div
            key={`${p.slug}-${copy}`}
            data-card
            aria-hidden={copy ? true : undefined}
            inert={copy ? true : undefined}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: Math.min(i, 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="w-[68vw] max-w-[262px] shrink-0 snap-start sm:w-[262px] lg:w-[248px]"
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>

      <div className="container-site mt-4">
        <div className="relative h-[2px] rounded bg-beige">
          <div ref={bar} className="absolute top-0 left-0 h-[2px] w-[12%] rounded bg-gold" />
        </div>
      </div>
    </section>
  )
}
