import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useMotionValue } from 'framer-motion'
import { TreePalm, ChefHat, Gift } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import MagneticButton from '../ui/MagneticButton'
import { STORY } from '../../data/site'
import { EASE } from '../ui/Reveal'
import useMedia from '../../hooks/useMedia'

/* outline icons in Lucide's style for the two the set doesn't have */
function Diya(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2.5c1.7 2.1 1.8 3.8 0 5.4-1.8-1.6-1.7-3.3 0-5.4Z" />
      <path d="M3 11.5h18c-.7 4.3-4.6 7.5-9 7.5s-8.3-3.2-9-7.5Z" />
      <path d="M8 21.5h8" />
    </svg>
  )
}
function Mortar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11h18a9 9 0 0 1-18 0Z" />
      <path d="M8 20.5h8" />
      <path d="m13 11 7.5-8a1.6 1.6 0 0 1 2 2.2L15.5 11" />
    </svg>
  )
}
const ICONS = { palm: TreePalm, diya: Diya, mortar: Mortar, chef: ChefHat, gift: Gift }
const N = STORY.length

/* scroll choreography (progress 0 → 1 while the section is pinned) */
const DEAL = (i) => [0.04 + i * 0.085, 0.3 + i * 0.085] // each card leaves the deck in turn
const THREAD = [0.62, 0.96] // then the gold thread walks across the chapters

/**
 * "Our Journey — From the Palm to Your Plate".
 * Desktop: the section pins while you scroll. The five chapters start as a
 * fanned deck in the centre and are dealt out one by one; then a gold thread
 * with a glowing traveller walks across them, lifting each card in turn.
 * Cards tilt in 3D under the cursor. Phones: a simple swipeable row.
 */
export default function StoryCards() {
  const ref = useRef(null)
  const cardsRef = useRef(null)
  const desktop = useMedia('(min-width: 1024px)')
  const [active, setActive] = useState(-1)
  const [lineTop, setLineTop] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 })
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const skyY = useTransform(pass, [0, 1], ['-8%', '12%'])
  const bandScale = useTransform(p, [0, 0.3], [0.55, 1])
  const thread = useTransform(p, THREAD, [0, 1])
  const travellerX = useTransform(thread, [0, 1], ['0%', '100%'])
  const hintO = useTransform(p, [0, 0.08], [1, 0])
  const threadO = useTransform(p, [THREAD[0] - 0.08, THREAD[0]], [0, 1]) // thread appears once the deal is done

  useMotionValueEvent(p, 'change', (v) => {
    if (!desktop) return
    const t = (v - THREAD[0]) / (THREAD[1] - THREAD[0])
    setActive(t < 0 ? -1 : Math.min(N - 1, Math.floor(t * N)))
  })

  // keep the thread level with the lower part of the photos
  useEffect(() => {
    const measure = () => {
      const img = cardsRef.current?.querySelector('[data-photo]')
      if (img) setLineTop(img.offsetHeight * 0.72)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (cardsRef.current) ro.observe(cardsRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      aria-labelledby="journey-h"
      style={{ height: desktop ? '270vh' : 'auto' }}
      className="relative bg-[linear-gradient(180deg,#FDF9F3_0%,#FBF0E1_45%,#F8E7D2_100%)]"
    >
      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-[84px]">
        {/* palm skyline + sun glow */}
        <motion.div style={{ y: skyY }} className="pointer-events-none absolute top-0 right-0 hidden h-[340px] w-[52%] md:block lg:top-[60px]">
          <img
            src="/images/journey/palm-skyline.jpg"
            alt=""
            className="h-full w-full object-cover mix-blend-multiply"
            style={{ maskImage: 'linear-gradient(90deg, transparent 0%, #000 30%, #000 85%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 30%, #000 85%, transparent)' }}
          />
          <motion.div
            className="absolute top-[38%] left-[48%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,214,150,0.55),transparent_70%)]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.img
          src="/images/journey/palm-leaf.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 right-0 w-56 origin-top-right mix-blend-multiply sm:w-72 lg:top-[70px] lg:w-[22rem]"
          style={{ maskImage: 'radial-gradient(ellipse 70% 80% at 70% 30%, #000 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 70% 30%, #000 30%, transparent 100%)' }}
          animate={{ rotate: [0, -2.5, 0, 1.5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* header */}
        <div className="container-site relative pt-16 sm:pt-20 lg:pt-0">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="flex items-center gap-4 text-[11px] font-medium tracking-[0.36em] text-espresso uppercase sm:text-xs"
              >
                Our journey
                <motion.span
                  className="block h-px w-24 origin-left bg-gradient-to-r from-gold to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
                />
              </motion.p>
              <motion.h2
                id="journey-h"
                initial="hide"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-4 font-serif text-[2.4rem] leading-[1.08] font-semibold text-espresso sm:text-5xl lg:text-[3.1rem]"
              >
                {['From the', 'Palm', 'to Your', 'Plate'].map((w, i) => (
                  <span key={w} className="inline-block overflow-hidden pr-[0.25em] pb-[0.08em] align-bottom">
                    <motion.span
                      className={`inline-block ${i % 2 ? 'italic' : ''}`}
                      variants={{ hide: { y: '110%' }, show: { y: '0%' } }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                className="mt-3 max-w-xl text-[15px] leading-relaxed text-espresso/80 sm:text-base"
              >
                Every sweet has a beginning. Ours begins with the natural goodness of the palmyra palm and the traditions passed down through generations.
              </motion.p>
            </div>
            <motion.div
              className="relative z-20 lg:mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            >
              <MagneticButton to="/our-story">The full story</MagneticButton>
            </motion.div>
          </div>
        </div>

        {/* cards over the maroon band */}
        <div className="relative mt-10 pb-14 lg:mt-8 lg:pb-10">
          <motion.div
            style={desktop ? { scaleY: bandScale } : undefined}
            className="absolute inset-x-0 top-[34%] -bottom-[40vh] origin-bottom bg-[linear-gradient(180deg,#6A1E17,#5D1713_40%,#4A120E)]"
          >
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute -top-[80px] left-0 h-[81px] w-full" aria-hidden="true">
              <path d="M0 0 C 260 92, 1180 92, 1440 0 V120 H0 Z" fill="#6A1E17" />
              <path d="M0 0 C 260 92, 1180 92, 1440 0" stroke="#D9B77E" strokeWidth="2.5" fill="none" />
            </svg>
          </motion.div>

          {desktop && (
            <motion.p style={{ opacity: hintO }} className="pointer-events-none absolute top-[38%] left-1/2 z-30 -translate-x-1/2 text-[10px] tracking-[0.34em] text-ivory/80 uppercase">
              Scroll to deal the story
            </motion.p>
          )}

          <div className="container-site relative">
            <div ref={cardsRef} className="relative">
              {/* the journey thread (desktop) */}
              {desktop && lineTop > 0 && (
                <motion.div className="pointer-events-none absolute inset-x-0 z-0 h-[2px]" style={{ top: lineTop, opacity: threadO }}>
                  <div className="absolute inset-0 bg-gold/25" />
                  <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-gold-soft via-gold to-gold-soft" style={{ scaleX: thread }} />
                  {STORY.slice(0, -1).map((_, i) => (
                    <span
                      key={i}
                      className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-soft transition-colors duration-500 ${active > i ? 'bg-gold' : 'bg-cocoa'}`}
                      style={{ left: `${((i + 1) / N) * 100}%` }}
                    />
                  ))}
                  <motion.span className="absolute top-1/2 -translate-y-1/2" style={{ left: travellerX }}>
                    <span className="absolute -top-2 -left-2 block h-4 w-4 rounded-full bg-gold-soft shadow-[0_0_16px_6px_rgba(217,183,126,0.75)]" />
                  </motion.span>
                </motion.div>
              )}

              <ol className="no-scrollbar relative z-10 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
                {STORY.map((s, i) =>
                  desktop ? (
                    <DealtCard key={s.n} s={s} i={i} p={p} active={active === i} />
                  ) : (
                    <motion.li
                      key={s.n}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
                      className="w-[74vw] max-w-[290px] shrink-0 snap-center sm:w-[290px]"
                    >
                      <Card s={s} />
                    </motion.li>
                  ),
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** A card that starts in the centre deck and is dealt to its column */
function DealtCard({ s, i, p, active }) {
  const centre = (N - 1) / 2
  const [a, b] = DEAL(i)
  const x = useTransform(p, [a, b], [`${(centre - i) * 104}%`, '0%'], { clamp: true })
  const y = useTransform(p, [a, b], [36 + Math.abs(i - centre) * 6, 0], { clamp: true })
  const rotate = useTransform(p, [a, b], [(i - centre) * 5, 0], { clamp: true })
  const scale = useTransform(p, [a, b], [0.9, 1], { clamp: true })

  return (
    <motion.li style={{ x, y, rotate, scale, zIndex: N - i }} className="relative">
      <Card s={s} active={active} tilt />
    </motion.li>
  )
}

/** The chapter card itself (with optional 3D tilt and active lift) */
function Card({ s, active = false, tilt = false }) {
  const Icon = ICONS[s.icon]
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 })
  const glareX = useMotionValue(50)
  const glare = useTransform(glareX, (g) => `radial-gradient(circle at ${g}% 0%, rgba(255,255,255,0.35), transparent 55%)`)

  const move = (e) => {
    if (!tilt) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 10)
    rx.set(-py * 10)
    glareX.set((px + 0.5) * 100)
  }
  const leave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.article
      onMouseMove={move}
      onMouseLeave={leave}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      animate={{ y: active ? -12 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-[#FFF9F0] to-[#FBEFDF] transition-shadow duration-500 ${
        active
          ? 'shadow-[0_30px_60px_-24px_rgba(43,18,13,0.75),0_0_0_2px_rgba(217,183,126,0.9)]'
          : 'shadow-[0_22px_45px_-28px_rgba(43,18,13,0.6)]'
      }`}
    >
      <div data-photo className="relative overflow-hidden">
        <SmartImage
          src={s.image}
          alt={s.title}
          art={s.art}
          label={false}
          className="aspect-[4/3]"
          imgClassName={`transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.08] ${active ? 'scale-[1.06]' : ''}`}
        />
        <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="absolute -bottom-px left-0 h-6 w-full" aria-hidden="true">
          <path d="M0 30 V16 C 70 -2, 150 30, 220 14 C 255 6, 285 8, 300 12 V30 Z" fill="#FFF9F0" />
          <path d="M0 16 C 70 -2, 150 30, 220 14 C 255 6, 285 8, 300 12" stroke="#A87935" strokeWidth="1.4" fill="none" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-2 pb-4 xl:px-6">
        <div className="flex items-start justify-between">
          <span className="font-serif text-[1.7rem] leading-none font-semibold text-cocoa">{s.n}</span>
          <motion.span
            animate={active ? { rotate: [0, -12, 8, 0], scale: [1, 1.18, 1] } : {}}
            transition={{ duration: 0.8 }}
            className="text-cocoa transition-transform duration-500 group-hover:-rotate-6"
          >
            <Icon width={32} height={32} size={32} strokeWidth={1.2} />
          </motion.span>
        </div>
        <h3 className="mt-2 font-serif text-[1.35rem] leading-tight font-semibold text-espresso xl:text-[1.5rem]">{s.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-espresso/80">{s.text}</p>
        <p className={`mt-auto border-t pt-3 text-center text-[11px] font-medium tracking-[0.32em] uppercase transition-colors duration-500 ${active ? 'border-gold/60 text-cocoa' : 'border-gold/25 text-espresso'}`}>
          {s.tag}
        </p>
      </div>
      {/* moving glare under the cursor */}
      {tilt && <motion.div style={{ background: glare }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
    </motion.article>
  )
}
