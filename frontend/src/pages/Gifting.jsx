import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { Gift, Briefcase, ShoppingBag, ArrowUpRight } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import MagneticButton from '../components/ui/MagneticButton'
import { Reveal } from '../components/ui/Reveal'
import { useStore } from '../context/StoreContext'
import { productsIn, productImage, formatPrice, fromPrice, getProduct } from '../data/products'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useMedia from '../hooks/useMedia'

const EASE = [0.22, 1, 0.36, 1]

/*
 * Gifting — a quiet, scroll-led page.
 *   1. Unwrap     the keepsake box unwraps as you scroll (ribbon parts, bow lifts)
 *   2. Collection the gifts glide sideways as you scroll down
 *   3. Occasions  big words light up one at a time
 *   4. The ritual three steps joined by a line that draws itself
 *   5. Many gifts corporate & bulk invitation
 */
export default function Gifting() {
  useDocumentTitle('Gifting', 'Signature sweet tins and hampers from The Palm Story — for festivals, weddings and corporate gifting.')
  return (
    <>
      <Unwrap />
      <Collection />
      <Occasions />
      <Ritual />
      <ManyGifts />
    </>
  )
}

/* ───────── 1. Unwrap on scroll ───────── */
function Unwrap() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const hamper = getProduct('signature-hamper')

  const bowY = useTransform(p, [0.05, 0.35], ['0%', '-260%'])
  const bowRotate = useTransform(p, [0.05, 0.35], [0, -30])
  const bowOpacity = useTransform(p, [0.25, 0.38], [1, 0])
  const upY = useTransform(p, [0.2, 0.6], ['0%', '-105%'])
  const downY = useTransform(p, [0.2, 0.6], ['0%', '105%'])
  const leftX = useTransform(p, [0.28, 0.66], ['0%', '-105%'])
  const rightX = useTransform(p, [0.28, 0.66], ['0%', '105%'])
  const blur = useTransform(p, [0.3, 0.7], [7, 0])
  const filter = useMotionTemplate`blur(${blur}px)`
  const imgScale = useTransform(p, [0.3, 0.8], [1.15, 1])
  const priceO = useTransform(p, [0.7, 0.85], [0, 1])
  const priceY = useTransform(p, [0.7, 0.85], [24, 0])
  const hintO = useTransform(p, [0, 0.1], [1, 0])

  const satinV = 'bg-[linear-gradient(90deg,#3E0F0B,#7A2A1F_30%,#5D1713_55%,#8A3426_75%,#3E0F0B)]'
  const satinH = 'bg-[linear-gradient(180deg,#3E0F0B,#7A2A1F_30%,#5D1713_55%,#8A3426_75%,#3E0F0B)]'

  return (
    <section ref={ref} className="relative h-[220vh] bg-[linear-gradient(180deg,#FDF9F3,#FBF1E3)]" aria-labelledby="gift-h">
      <div className="sticky top-0 flex h-screen items-start overflow-hidden pt-24 sm:items-center sm:pt-16">
        <div className="container-site grid w-full items-center gap-6 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: EASE }} className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-espresso uppercase">
              <Gift size={18} strokeWidth={1.4} className="text-gold" /> The royal gifting suite
            </motion.p>
            <h1 id="gift-h" className="mt-3 font-serif leading-[1.02] font-semibold sm:mt-5">
              {[['Gift a Little', 'text-espresso'], ['Tradition.', 'italic text-gold']].map(([t, c], i) => (
                <span key={t} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className={`block text-[2.5rem] sm:text-6xl xl:text-[4.6rem] ${c}`}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: EASE }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: EASE }} className="mt-3 max-w-md text-[14.5px] leading-relaxed text-espresso/80 sm:mt-5 sm:text-base">
              Thoughtfully crafted sweets in keepsake tins and wax-sealed boxes — for weddings, festivals and the people who matter.
            </motion.p>
            <motion.p style={{ opacity: hintO }} className="mt-6 hidden items-center gap-3 text-[10px] tracking-[0.3em] text-cocoa-70 uppercase sm:flex">
              <span className="h-px w-10 bg-gold" /> Scroll to unwrap
            </motion.p>
          </div>

          {/* the gift */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[min(640px,calc((100svh-180px)*1.333))] overflow-hidden rounded-[24px] rounded-tl-[90px] shadow-[0_40px_80px_-40px_rgba(43,18,13,0.6)] sm:rounded-tl-[140px]">
            <motion.div style={{ scale: imgScale, filter }} className="absolute inset-0">
              <SmartImage src="/images/brand/gift-box.jpg" alt="The Palm Story keepsake gift box with five rows of sweets" art={{ kind: 'box', tone: 'beige' }} label={false} className="h-full w-full" eager />
            </motion.div>
            {/* ribbon */}
            <motion.div style={{ y: upY }} className={`absolute top-0 left-1/2 h-1/2 w-10 -translate-x-1/2 sm:w-14 ${satinV} shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`} />
            <motion.div style={{ y: downY }} className={`absolute bottom-0 left-1/2 h-1/2 w-10 -translate-x-1/2 sm:w-14 ${satinV} shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`} />
            <motion.div style={{ x: leftX }} className={`absolute top-1/2 left-0 h-10 w-1/2 -translate-y-1/2 sm:h-14 ${satinH} shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`} />
            <motion.div style={{ x: rightX }} className={`absolute top-1/2 right-0 h-10 w-1/2 -translate-y-1/2 sm:h-14 ${satinH} shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`} />
            {/* bow */}
            <motion.svg
              viewBox="0 0 160 110"
              style={{ y: bowY, rotate: bowRotate, opacity: bowOpacity }}
              className="absolute top-1/2 left-1/2 -mt-[13%] -ml-[16%] w-[32%] drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="giftBow" x1="0" x2="1">
                  <stop offset="0" stopColor="#4A120E" />
                  <stop offset=".45" stopColor="#8A3426" />
                  <stop offset="1" stopColor="#4A120E" />
                </linearGradient>
              </defs>
              <path d="M80 55 C 40 10, 2 22, 12 52 C 20 78, 58 70, 80 55 Z" fill="url(#giftBow)" stroke="#D9B77E" strokeWidth="1.5" />
              <path d="M80 55 C 120 10, 158 22, 148 52 C 140 78, 102 70, 80 55 Z" fill="url(#giftBow)" stroke="#D9B77E" strokeWidth="1.5" />
              <path d="M74 60 L 52 106 L 66 100 L 72 108 L 80 62 Z" fill="url(#giftBow)" stroke="#D9B77E" strokeWidth="1.2" />
              <path d="M86 60 L 108 106 L 94 100 L 88 108 L 80 62 Z" fill="url(#giftBow)" stroke="#D9B77E" strokeWidth="1.2" />
              <ellipse cx="80" cy="56" rx="12" ry="10" fill="#7A2A1F" stroke="#D9B77E" strokeWidth="1.5" />
            </motion.svg>
            {/* revealed price */}
            {hamper && (
              <motion.div style={{ opacity: priceO, y: priceY }} className="absolute right-3 bottom-3 left-3 sm:right-5 sm:bottom-5 sm:left-auto">
                <Link to={`/product/${hamper.slug}`} className="flex items-center justify-between gap-5 rounded-2xl bg-espresso/90 px-5 py-3 text-ivory backdrop-blur transition-colors hover:bg-cocoa">
                  <span>
                    <span className="block text-[9px] font-semibold tracking-[0.22em] text-gold-soft uppercase">Festive centrepiece</span>
                    <span className="block font-serif text-base italic sm:text-lg">{hamper.name.replace('The ', '')}</span>
                  </span>
                  <span className="font-serif text-xl font-semibold sm:text-2xl">{formatPrice(fromPrice(hamper))}</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── 2. Collection: sideways on scroll (desktop), swipe (phones) ───────── */
function Collection() {
  const gifts = productsIn('gifting')
  const desktop = useMedia('(min-width: 1024px)')
  const ref = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(p, [0.05, 0.95], [0, -dist])
  const bar = useTransform(p, [0.05, 0.95], ['0%', '100%'])

  useEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 64))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [desktop])

  const heading = (
    <div className="container-site flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.32em] text-gold uppercase">The collection</p>
        <h2 className="mt-2 font-serif text-[2.2rem] font-semibold text-espresso sm:text-5xl">
          Tins, boxes <span className="italic">&amp; hampers</span>
        </h2>
      </div>
      <p className="max-w-xs text-sm text-cocoa-70">Each one packed by hand and finished in chocolate and gold.</p>
    </div>
  )

  if (!desktop)
    return (
      <section className="py-16">
        {heading}
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 pb-2">
          {gifts.map((g) => (
            <div key={g.slug} className="w-[78vw] max-w-[340px] shrink-0 snap-start">
              <GiftCard g={g} />
            </div>
          ))}
        </div>
      </section>
    )

  return (
    <section ref={ref} style={{ height: `${100 + gifts.length * 40}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
        {heading}
        <motion.div ref={track} style={{ x }} className="mt-10 flex gap-8 pl-[max(3.5rem,calc((100vw-1440px)/2+3.5rem))] will-change-transform">
          {gifts.map((g, i) => (
            <div key={g.slug} className="w-[30vw] max-w-[400px] shrink-0" style={{ marginTop: i % 2 ? 40 : 0 }}>
              <GiftCard g={g} />
            </div>
          ))}
          <div className="w-[10vw] shrink-0" />
        </motion.div>
        <div className="container-site mt-10">
          <div className="relative h-px bg-cocoa/15">
            <motion.div className="absolute inset-y-0 left-0 bg-gold" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  )
}

function GiftCard({ g }) {
  const { addToCart } = useStore()
  return (
    <article className="group">
      <Link to={`/product/${g.slug}`} className="relative block overflow-hidden rounded-[22px]">
        <SmartImage src={productImage(g)} alt={g.name} art={g.art} position={g.focus} label={false} className="aspect-[4/3]" imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.06]" />
        {g.badge && <span className="absolute top-4 left-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-cocoa uppercase">{g.badge}</span>}
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-espresso sm:text-2xl">
            <Link to={`/product/${g.slug}`} className="hover:text-cocoa">{g.name}</Link>
          </h3>
          <p className="mt-1 line-clamp-2 max-w-sm text-[13px] text-cocoa-70">{g.short}</p>
        </div>
        <p className="shrink-0 font-serif text-xl font-semibold text-espresso">{formatPrice(fromPrice(g))}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => addToCart(g.slug, g.variants[0].id, 1, { open: false })} className="flex items-center gap-2 rounded-full bg-cocoa px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-espresso">
          <ShoppingBag size={14} /> Add to bag
        </button>
        <Link to={`/product/${g.slug}`} aria-label={`View ${g.name}`} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-cocoa/30 transition-colors hover:bg-cocoa hover:text-ivory">
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  )
}

/* ───────── 3. Occasions: words light up as they pass the centre ───────── */
const OCCASIONS = [
  { title: 'Deepavali', text: 'Tins of adhirasam, laddu and Mysore Pak for the festival of lights.', img: '/images/products/festive-celebration-box.jpg' },
  { title: 'Pongal', text: 'Celebrate the harvest with palm jaggery sweets and savories.', img: '/images/products/karupatti-halwa.jpg' },
  { title: 'Weddings', text: 'Return gifts and keepsake boxes, finished in chocolate and gold.', img: '/images/products/signature-hamper.jpg' },
  { title: 'Corporate', text: 'Elegant hampers for clients and teams, with your note on every box.', img: '/images/products/heritage-sweet-tin.jpg' },
]

function Occasions() {
  return (
    <section className="bg-cocoa py-20 text-ivory sm:py-28" aria-label="Gifts for every occasion">
      <div className="container-site">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-gold-soft uppercase">For every occasion</p>
        <ul className="mt-6">
          {OCCASIONS.map((o) => (
            <Occasion key={o.title} o={o} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function Occasion({ o }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(p, [0.2, 0.45, 0.55, 0.8], [0.18, 1, 1, 0.18])
  const x = useTransform(p, [0.2, 0.5], [-30, 0])
  const imgO = useTransform(p, [0.35, 0.5, 0.6, 0.7], [0, 1, 1, 0])
  const imgRot = useTransform(p, [0.3, 0.7], [-8, 6])
  const imgY = useTransform(p, [0.3, 0.7], ['30%', '-30%'])
  return (
    <li ref={ref} className="relative border-b border-ivory/10 py-6 sm:py-8">
      <motion.div style={{ opacity, x }} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <h3 className="font-serif text-[15vw] leading-none font-semibold sm:text-[9vw] lg:text-[7.5rem]">{o.title}</h3>
        <p className="max-w-xs pb-2 text-sm text-beige/80 sm:text-right">{o.text}</p>
      </motion.div>
      {/* image floats in beside the word (larger screens) */}
      <motion.div style={{ opacity: imgO, rotate: imgRot, y: imgY }} className="pointer-events-none absolute top-1/2 right-[30%] hidden w-56 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/30 lg:block">
        <img src={o.img} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
      </motion.div>
    </li>
  )
}

/* ───────── 4. The ritual: a line draws through three steps ───────── */
const STEPS = [
  ['01', 'Choose', 'Pick a keepsake tin, a wax-sealed box or a hamper — or let us build one for you.'],
  ['02', 'Write', 'Add your message at checkout. We write it by hand on a gold-edged card.'],
  ['03', 'Seal & send', 'Each gift is wax-sealed, packed fresh and dispatched within 48 hours.'],
]

function Ritual() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 80%', 'center 45%'] })
  const line = useTransform(p, [0, 1], [0, 1])
  return (
    <section ref={ref} className="bg-[linear-gradient(180deg,#FDF9F3,#FBF1E3)] py-20 sm:py-28" aria-label="How your gift is made">
      <div className="container-site">
        <Reveal>
          <p className="text-center text-[11px] font-semibold tracking-[0.32em] text-gold uppercase">The ritual</p>
          <h2 className="mt-2 text-center font-serif text-[2.2rem] font-semibold text-espresso sm:text-5xl">
            How your gift <span className="italic">is made</span>
          </h2>
        </Reveal>
        <div className="relative mt-14">
          {/* drawing line: horizontal on desktop, vertical on phones */}
          <div className="absolute top-6 right-[16%] left-[16%] hidden h-px bg-cocoa/15 md:block">
            <motion.div className="h-px origin-left bg-gold" style={{ scaleX: line }} />
          </div>
          <div className="absolute top-6 bottom-6 left-6 w-px bg-cocoa/15 md:hidden">
            <motion.div className="w-px origin-top bg-gold" style={{ scaleY: line, height: '100%' }} />
          </div>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map(([n, t, d], i) => (
              <Step key={n} n={n} t={t} d={d} p={p} at={0.15 + i * 0.35} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Step({ n, t, d, p, at }) {
  const on = useTransform(p, [at - 0.12, at], [0, 1])
  const scale = useTransform(on, [0, 1], [0.7, 1])
  const bg = useTransform(on, [0, 1], ['#FBF1E3', '#5D1713'])
  const color = useTransform(on, [0, 1], ['#A87935', '#F7F3EA'])
  const textO = useTransform(on, [0, 1], [0.35, 1])
  return (
    <li className="relative flex gap-5 pl-0 md:flex-col md:items-center md:text-center">
      <motion.span style={{ scale, backgroundColor: bg, color }} className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full font-serif text-lg ring-1 ring-gold/50">
        {n}
      </motion.span>
      <motion.div style={{ opacity: textO }}>
        <h3 className="font-serif text-2xl font-semibold text-espresso">{t}</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-cocoa-70">{d}</p>
      </motion.div>
    </li>
  )
}

/* ───────── 5. Many gifts ───────── */
function ManyGifts() {
  return (
    <section className="py-20 text-center sm:py-28" aria-label="Corporate and bulk gifting">
      <div className="container-site">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.32em] text-gold uppercase">Gifting for many?</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2.2rem] leading-tight font-semibold text-espresso sm:text-5xl lg:text-6xl">
            Weddings, festivals &amp; teams — <span className="italic text-cocoa">we’ll make every box personal.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] text-cocoa-70">Custom assortments, logo cards and scheduled deliveries across India.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <MagneticButton to="/contact" icon={Briefcase}>Bulk & corporate enquiry</MagneticButton>
            <MagneticButton to="/shop" icon={Gift} variant="outline">Build your own box</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
