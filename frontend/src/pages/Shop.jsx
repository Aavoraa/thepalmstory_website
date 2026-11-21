import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams, Navigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Search, X, ChevronDown, Plus, Heart } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import { useStore } from '../context/StoreContext'
import { CATEGORIES, PRODUCTS, getCategory, fromPrice, formatPrice, productImage } from '../data/products'
import useDocumentTitle from '../hooks/useDocumentTitle'

const EASE = [0.22, 1, 0.36, 1]
const SORTS = [
  ['featured', 'Featured'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['name', 'Name A–Z'],
]
const TABS = [['all', 'All', '/shop'], ...CATEGORIES.map((c) => [c.slug, c.name, c.slug === 'gifting' ? '/gifting' : `/collections/${c.slug}`])]

/*
 * Shop — minimal and scroll-led.
 *   • a large title that settles away as you scroll
 *   • one slim sticky bar: categories · search · sort
 *   • a calm grid whose columns drift at slightly different speeds,
 *     over a faint word sliding in the background
 */
export default function Shop() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const sort = params.get('sort') || 'featured'
  const sub = params.get('sub') || 'all'
  const cat = category ? getCategory(category) : null
  const filter = category || 'all'
  useDocumentTitle(cat ? cat.title : 'Shop All', cat?.tagline)

  const base = useMemo(() => PRODUCTS.filter((p) => filter === 'all' || p.category === filter), [filter])
  const list = useMemo(() => {
    let l = base
    if (sub !== 'all') l = l.filter((p) => p.sub === sub)
    if (q) {
      const s = q.toLowerCase()
      l = l.filter((p) => [p.name, p.short, p.category, p.kicker, ...p.ingredients].join(' ').toLowerCase().includes(s))
    }
    const sorted = [...l]
    if (sort === 'price-asc') sorted.sort((a, b) => fromPrice(a) - fromPrice(b))
    if (sort === 'price-desc') sorted.sort((a, b) => fromPrice(b) - fromPrice(a))
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured') sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return sorted
  }, [base, sub, q, sort])

  if (category && (!cat || category === 'gifting')) return <Navigate to={category === 'gifting' ? '/gifting' : '/shop'} replace />

  const set = (k, v) => {
    const next = new URLSearchParams(params)
    if (v && v !== 'all' && !(k === 'sort' && v === 'featured')) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const title = cat ? cat.name : 'The Collection'
  const word = cat ? cat.name : 'Sweets · Cakes · Savories · Gifts'

  return (
    <>
      <Title title={title} tagline={cat ? cat.tagline : 'Traditional sweets, palm jaggery cakes, heritage savories and keepsake gifts — made by hand in small batches.'} count={base.length} />

      {/* sticky bar */}
      <div className="sticky top-[67px] z-30 border-y border-gold/20 bg-[#FDF9F3]/90 backdrop-blur-md">
        <div className="container-site flex flex-col gap-2 py-2.5 md:flex-row md:items-center md:justify-between md:gap-6 md:py-3">
          <nav aria-label="Categories" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            {TABS.map(([slug, name, to]) => {
              const on = filter === slug
              return (
                <Link key={slug} to={to + (q ? `?q=${encodeURIComponent(q)}` : '')} aria-current={on ? 'page' : undefined} className={`relative shrink-0 rounded-full px-4 py-2 text-[12px] font-medium tracking-wide transition-colors ${on ? 'text-ivory' : 'text-espresso/70 hover:text-espresso'}`}>
                  {on && <motion.span layoutId="shop-tab" className="absolute inset-0 rounded-full bg-cocoa" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className="relative">{name}</span>
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-3">
            <label className="relative flex flex-1 items-center md:w-56 md:flex-none">
              <Search size={15} strokeWidth={1.6} className="absolute left-3 text-gold" />
              <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search sweets…" aria-label="Search products" className="h-9 w-full rounded-full bg-white/80 pr-8 pl-9 text-[13px] ring-1 ring-gold/25 focus:ring-gold focus:outline-none" />
              {q && (
                <button aria-label="Clear search" onClick={() => set('q', '')} className="absolute right-3 text-cocoa-70 hover:text-cocoa">
                  <X size={14} />
                </button>
              )}
            </label>
            <label className="relative shrink-0">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => set('sort', e.target.value)} className="h-9 cursor-pointer appearance-none rounded-full bg-white/80 pr-8 pl-4 text-[12px] text-espresso ring-1 ring-gold/25 focus:ring-gold focus:outline-none">
                {SORTS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gold" />
            </label>
          </div>
        </div>
        {cat?.subs && (
          <div className="container-site no-scrollbar flex gap-5 overflow-x-auto pb-2.5 text-[11px] tracking-[0.18em] uppercase">
            {[['all', 'All'], ...cat.subs].map(([id, label]) => (
              <button key={id} onClick={() => set('sub', id)} aria-pressed={sub === id} className={`shrink-0 border-b pb-1 transition-colors ${sub === id ? 'border-gold text-cocoa' : 'border-transparent text-cocoa-70 hover:text-cocoa'}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Grid list={list} word={word} q={q} resetTo={cat ? `/collections/${cat.slug}` : '/shop'} />
    </>
  )
}

/* ───────── title that settles away on scroll ───────── */
function Title({ title, tagline, count }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(p, [0, 1], [1, 0.82])
  const y = useTransform(p, [0, 1], [0, 60])
  const opacity = useTransform(p, [0.2, 0.9], [1, 0])
  const vScale = useTransform(p, [0, 1], [1, 1.12])
  const videoRef = useRef(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <section ref={ref} className="bg-[linear-gradient(180deg,#FDF9F3,#FBF2E6)] pt-4 pb-6 sm:pt-6 sm:pb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE }}
        className="container-site"
      >
        <div className="relative isolate flex h-[46vh] min-h-[320px] max-h-[520px] items-end overflow-hidden rounded-[24px] bg-espresso sm:h-[52vh] sm:rounded-[28px]">
          <motion.video
            ref={videoRef}
            style={{ scale: vScale }}
            src="/videos/our-story-palm.mp4"
            poster="/images/journey/step-1.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(43,18,13,0.15)_0%,rgba(43,18,13,0.35)_45%,rgba(43,18,13,0.85)_100%)]" />
          <motion.div style={{ scale, y, opacity }} className="origin-bottom-left px-6 pb-7 sm:px-10 sm:pb-10">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-gold-soft uppercase">
          Shop <span className="h-px w-10 bg-gold-soft/60" /> {String(count).padStart(2, '0')} creations
        </motion.p>
        <h1 className="mt-3 overflow-hidden pb-[0.06em]">
          <motion.span
            key={title}
            className="block font-serif text-[15vw] leading-[0.95] font-semibold text-ivory sm:text-[10vw] lg:text-[7.5rem]"
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1, ease: EASE }}
          >
            {title}
          </motion.span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} className="mt-3 max-w-xl text-[14px] leading-relaxed text-ivory/85 sm:mt-4 sm:text-base">
          {tagline}
        </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* ───────── grid with drifting columns ───────── */
function Grid({ list, word, q, resetTo }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const wordX = useTransform(p, [0, 1], ['10%', '-45%'])

  return (
    <section ref={ref} className="relative overflow-hidden pt-10 pb-28 sm:pt-14">
      {/* faint word sliding behind the grid */}
      <motion.p style={{ x: wordX }} aria-hidden="true" className="pointer-events-none absolute top-1/3 left-0 font-serif text-[22vw] leading-none whitespace-nowrap text-transparent italic [-webkit-text-stroke:1px_rgba(168,121,53,0.16)]">
        {word} · {word}
      </motion.p>

      <div className="container-site relative">
        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl text-espresso">Nothing found{q && <> for “{q}”</>}.</p>
            <Link to={resetTo} className="mt-6 inline-block text-[11px] font-semibold tracking-[0.2em] text-cocoa uppercase underline underline-offset-4">Clear filters</Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">
            <AnimatePresence mode="popLayout">
              {list.map((prod, i) => (
                <motion.li key={prod.slug} layout exit={{ opacity: 0, scale: 0.95 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.8, delay: (i % 4) * 0.07, ease: EASE }}
                  >
                    <Card p={prod} />
                  </motion.div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  )
}

/* ───────── minimal product card ───────── */
function Card({ p }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const saved = isWishlisted(p.slug)
  const url = `/product/${p.slug}`
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[18px] bg-peach sm:rounded-[22px]">
        <Link to={url} aria-label={`View ${p.name}`}>
          <SmartImage src={productImage(p)} alt={p.name} art={p.art} position={p.focus} label={false} className="aspect-[4/5]" imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.07]" />
        </Link>
        {p.badge && <span className="absolute top-3 left-3 rounded-full bg-ivory/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-cocoa uppercase backdrop-blur sm:text-[10px]">{p.badge}</span>}
        <button
          onClick={() => toggleWishlist(p.slug)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-ivory/90 text-cocoa backdrop-blur transition-colors hover:bg-cocoa hover:text-ivory"
        >
          <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
        {/* quick add: always visible on touch, slides up on hover for mouse */}
        <button
          onClick={() => addToCart(p.slug, p.variants[0].id, 1, { open: false })}
          className="absolute right-3 bottom-3 left-3 flex items-center justify-center gap-2 rounded-full bg-espresso/90 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-ivory uppercase backdrop-blur transition-all duration-500 ease-[var(--ease-lux)] hover:bg-cocoa [@media(hover:hover)]:translate-y-[140%] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
        >
          <Plus size={14} /> Add · {p.variants[0].label}
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 sm:mt-4">
        <div className="min-w-0">
          <p className="text-[9.5px] font-semibold tracking-[0.2em] text-gold uppercase sm:text-[10px]">{p.kicker}</p>
          <h3 className="mt-1 font-serif text-[15px] leading-snug font-semibold text-espresso sm:text-[17px]">
            <Link to={url} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">{p.name}</Link>
          </h3>
        </div>
        <p className="shrink-0 pt-[13px] font-serif text-[15px] font-semibold text-espresso sm:pt-[14px] sm:text-[17px]">{formatPrice(fromPrice(p))}</p>
      </div>
    </article>
  )
}
