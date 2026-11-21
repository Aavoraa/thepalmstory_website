import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Package, Truck, BadgePercent, Sparkles } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import useMedia from '../../hooks/useMedia'
import { EASE } from '../ui/Reveal'

/**
 * Bulk orders — two clear routes:
 *   1. Sweets & Savories (one button, one enquiry)
 *   2. Karupatti (palm jaggery) by weight
 * Both open the contact form with the topic pre-selected (/contact?topic=…).
 *
 * Scroll story: heading words rise in → each card glides in from its side while its
 * photo wipes open and settles → text, ticks and button follow → the perks pop in.
 */
const OFFERS = [
  {
    id: 'bulk-sweets',
    kicker: 'Weddings · festivals · corporate',
    title: 'Sweets & Savories',
    text: 'Halwa, laddu, Mysore pak, murukku and mixture — made fresh for your occasion and packed in basic, premium or custom boxes.',
    points: ['Mix sweets and savories in one order', 'Custom boxes, notes and branding', 'Return gifts from 25 boxes'],
    cta: 'Sweets & Savories Bulk Order',
    tag: 'Sweets + Savories',
    images: ['/images/categories/sweets.jpg', '/images/categories/savories.jpg'],
  },
  {
    id: 'bulk-karupatti',
    kicker: 'Shops · bakeries · kitchens',
    title: 'Karupatti',
    text: 'Pure palm jaggery from the palmyra groves — blocks and powder by the kilo for retailers, bakers and home kitchens.',
    points: ['Blocks and powdered Karupatti', 'Packs from 5 kg to 100 kg', 'Regular supply for businesses'],
    cta: 'Karupatti Bulk Order',
    tag: 'Palm jaggery',
    images: ['/images/journey/step-2.jpg'],
  },
]

const PERKS = [
  [BadgePercent, 'Bulk pricing'],
  [Package, 'Custom packing'],
  [Sparkles, 'Made fresh to order'],
  [Truck, 'Pan-India delivery'],
]

const rise = { hide: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease: EASE } } }
const fade = { hide: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }

export default function BulkOrders() {
  const ref = useRef(null)
  // soft background glow that drifts across as the section passes
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const glowX = useTransform(scrollYProgress, [0, 1], ['-20%', '40%'])

  return (
    <section ref={ref} aria-labelledby="bulk-h" className="relative overflow-hidden bg-[linear-gradient(180deg,#FBF6EE,#F5EADB)] py-16 sm:py-20 lg:py-24">
      <motion.div
        aria-hidden="true"
        style={{ x: glowX }}
        className="pointer-events-none absolute top-1/4 left-0 h-[60vw] max-h-[620px] w-[60vw] max-w-[620px] rounded-full bg-[radial-gradient(circle,rgba(217,183,126,0.28),transparent_65%)]"
      />

      <div className="container-site relative">
        {/* heading */}
        <motion.div
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fade} className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
            <motion.span variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }} className="h-px w-8 origin-right bg-gold/60" />
            Bulk Orders
            <motion.span variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }} className="h-px w-8 origin-left bg-gold/60" />
          </motion.p>
          <h2 id="bulk-h" className="mt-3 font-serif text-[2rem] leading-[1.12] font-semibold text-espresso sm:text-[2.8rem] lg:text-[3.4rem]">
            <Line words={['Big', 'celebrations,']} />
            <Line words={['made', 'by', 'hand.']} accent />
          </h2>
          <motion.p variants={fade} className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-pretty text-cocoa-70 sm:text-base">
            Order our sweets and savories for your event, or Karupatti by the kilo for your business. Tell us what you need and we’ll send a quote within a working day.
          </motion.p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {OFFERS.map((o, i) => (
            <Offer key={o.id} o={o} i={i} />
          ))}
        </div>

        {/* perks */}
        <motion.ul
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-4 gap-y-6 sm:mt-12 sm:grid-cols-4"
        >
          {PERKS.map(([Icon, label]) => (
            <motion.li
              key={label}
              variants={{ hide: { opacity: 0, y: 18, scale: 0.85 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } } }}
              className="group flex flex-col items-center gap-2.5 text-center text-[11px] font-medium tracking-[0.12em] text-espresso uppercase sm:text-[12px]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-gold shadow-[0_8px_20px_-14px_rgba(93,23,19,0.6)] ring-1 ring-gold/20 transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-cocoa group-hover:text-ivory">
                <motion.span variants={{ hide: { rotate: -40 }, show: { rotate: 0, transition: { duration: 0.8, ease: EASE } } }} className="grid">
                  <Icon size={19} strokeWidth={1.5} />
                </motion.span>
              </span>
              {label}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/** One heading line; each word rises out of a mask */
function Line({ words, accent }) {
  return (
    <motion.span variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="block">
      {words.map((w) => (
        <span key={w} className="inline-block overflow-hidden pr-[0.24em] pb-[0.1em] align-bottom last:pr-0">
          <motion.span variants={rise} className={`inline-block ${accent ? 'text-cocoa italic' : ''}`}>
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

function Offer({ o, i }) {
  const ref = useRef(null)
  const wide = useMedia('(min-width: 1024px)')
  const fromLeft = !wide || i === 0
  // entrance, tied to scroll: glide in from the card's side and straighten up
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] })
  const e = useSpring(enter, { stiffness: 120, damping: 26, mass: 0.4 })
  const x = useTransform(e, [0, 1], [fromLeft ? (wide ? -90 : -36) : 90, 0])
  const rotate = useTransform(e, [0, 1], [fromLeft ? -3 : 3, 0])
  const opacity = useTransform(e, [0, 0.5], [0, 1])
  // photo wipes open from the outer edge, then keeps a gentle parallax
  const clip = useTransform(e, [0.15, 1], [fromLeft ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'])
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgScale = useTransform(pass, [0, 0.5, 1], [1.25, 1.05, 1.12])
  const imgY = useTransform(pass, [0, 1], ['-6%', '6%'])
  const split = o.images.length > 1

  return (
    <motion.article
      ref={ref}
      style={{ x, rotate, opacity }}
      className="group flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_60px_-40px_rgba(43,18,13,0.55)] ring-1 ring-gold/15 transition-shadow duration-500 hover:shadow-[0_40px_70px_-38px_rgba(43,18,13,0.7)] sm:flex-row sm:rounded-[26px] lg:flex-col xl:flex-row"
    >
      {/* photo — the sweets card shows sweets and savories side by side */}
      <motion.div style={{ clipPath: clip }} className="relative h-52 shrink-0 overflow-hidden sm:h-auto sm:min-h-[340px] sm:w-[42%] lg:h-60 lg:min-h-0 lg:w-auto xl:h-auto xl:min-h-[400px] xl:w-[44%]">
        <motion.div style={{ scale: imgScale, y: imgY }} className="absolute -inset-y-[8%] inset-x-0 flex">
          {o.images.map((src, k) => (
            <div
              key={src}
              className={`relative h-full overflow-hidden transition-[flex-grow] duration-700 ease-[var(--ease-lux)] ${split ? (k === 0 ? 'flex-[1.15] group-hover:flex-[1.45]' : 'flex-1') : 'flex-1'}`}
            >
              <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              {k === 1 && <span className="absolute inset-y-0 left-0 w-[2px] bg-gold/80" />}
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(43,18,13,0.5))]" />
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="absolute bottom-4 left-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-cocoa uppercase backdrop-blur"
        >
          {o.tag}
        </motion.span>
      </motion.div>

      {/* words */}
      <motion.div
        initial="hide"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
        className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8"
      >
        <motion.p variants={fade} className="text-[10.5px] font-semibold tracking-[0.24em] text-gold uppercase">{o.kicker}</motion.p>
        <motion.h3 variants={fade} className="mt-2 font-serif text-[1.7rem] leading-tight font-semibold text-espresso sm:text-3xl">{o.title}</motion.h3>
        <motion.p variants={fade} className="mt-3 text-[14.5px] leading-relaxed text-cocoa-70">{o.text}</motion.p>
        <ul className="mt-4 space-y-2.5">
          {o.points.map((pt) => (
            <motion.li key={pt} variants={fade} className="flex items-start gap-2.5 text-[14px] text-espresso">
              <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true">
                  <motion.path
                    d="M2.5 6.2l2.2 2.2 4.8-4.9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{ hide: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } } }}
                  />
                </svg>
              </span>
              {pt}
            </motion.li>
          ))}
        </ul>
        <motion.div variants={fade} className="mt-auto pt-6">
          <MagneticButton
            to={`/contact?topic=${o.id}`}
            className="whitespace-nowrap px-5! text-[11px]! tracking-[0.1em]! sm:px-7! sm:tracking-[0.16em]!"
          >
            {o.cta}
          </MagneticButton>
        </motion.div>
      </motion.div>
    </motion.article>
  )
}
