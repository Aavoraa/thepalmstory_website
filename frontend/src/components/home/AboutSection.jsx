import { useRef } from 'react'
import { useState } from 'react'
import { motion, useInView, useScroll, useTransform, useMotionValueEvent, useAnimationControls, AnimatePresence } from 'framer-motion'
import { Leaf, Soup, MapPin, CookingPot, Milk, Layers, Gift, Ban, Droplet, TreePalm, Sprout } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import { EASE } from '../ui/Reveal'

export const PILLARS = [
  { n: 'I', title: 'Our Philosophy', text: 'Sweets should taste of where they come from. We cook slowly, in small batches, the way it has always been done.' },
  { n: 'II', title: 'Natural Ingredients', text: 'Karupatti, ghee and carefully chosen nuts — nothing refined, nothing we wouldn’t serve at home.' },
  { n: 'III', title: 'Traditional Craftsmanship', text: 'Laddus rolled by hand, halwa stirred for hours in bronze urulis, murukku twisted by skilled hands.' },
]

const MARKS = [
  [Ban, 'Zero refined sugar'],
  [Droplet, 'Pure ghee'],
  [TreePalm, 'Palmyra jaggery'],
  [Sprout, 'Sealed for freshness'],
]

// Provenance ledger — edit these rows to match your actual sourcing.
const PROVENANCE = [
  [Soup, 'Sweetener', '100% unrefined Karupatti'],
  [MapPin, 'Source', 'Palmyra groves of South Tamil Nadu'],
  [CookingPot, 'Cooking method', 'Bronze uruli, slow flame'],
  [Milk, 'Fat', 'Pure ghee'],
  [Layers, 'Batch size', 'Small batch, made to order'],
  [Gift, 'Packaging', 'Commemorative keepsake tin'],
]

/**
 * "A Story of Heritage. A Taste of Tradition."
 * Entrance: the heading rises in, the leaf stroke draws, the badges flip up and
 * the provenance card writes itself — each ledger row inks in left to right —
 * before the wax seal is stamped onto its corner.
 */
export default function AboutSection() {
  const ref = useRef(null)
  const cardRef = useRef(null)
  const cardIn = useInView(cardRef, { once: true, amount: 0.35 })
  const nudge = useAnimationControls()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sunsetY = useTransform(scrollYProgress, [0, 1], ['18%', '-6%'])
  const leafRotate = useTransform(scrollYProgress, [0, 1], [8, -6])
  const ROW_DELAY = 0.35
  const sealDelay = ROW_DELAY + PROVENANCE.length * 0.16 + 0.35

  return (
    <section ref={ref} aria-labelledby="heritage-h" className="relative overflow-hidden bg-[linear-gradient(180deg,#FDF9F3,#FBF1E3)] pt-16 lg:pt-20">
      {/* palm frond, top-left */}
      <motion.img
        src="/images/journey/palm-leaf.jpg"
        alt=""
        aria-hidden="true"
        style={{ rotate: leafRotate, maskImage: 'radial-gradient(ellipse 70% 80% at 70% 30%, #000 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 70% 30%, #000 30%, transparent 100%)' }}
        className="pointer-events-none absolute -top-6 -left-10 w-52 -scale-x-100 opacity-80 mix-blend-multiply sm:w-72"
      />

      <div className="container-site relative grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* ── left: story ── */}
        <div className="relative z-10 pb-44 sm:pb-56 lg:pb-60">
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex items-center gap-4 text-[11px] font-semibold tracking-[0.32em] text-espresso uppercase sm:text-xs"
          >
            House of artisanal jaggery
            <motion.span
              className="block h-px w-28 origin-left bg-gradient-to-r from-gold to-transparent sm:w-40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, delay: 0.3, ease: EASE }}
            />
          </motion.p>

          <motion.h2 id="heritage-h" initial="hide" whileInView="show" viewport={{ once: true }} className="mt-5 font-serif leading-[1.04] font-semibold">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-[2.4rem] text-espresso sm:text-5xl xl:text-[3.6rem]" variants={{ hide: { y: '110%' }, show: { y: '0%' } }} transition={{ duration: 1, ease: EASE }}>
                A Story of Heritage.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span className="block w-fit" variants={{ hide: { y: '110%' }, show: { y: '0%' } }} transition={{ duration: 1, delay: 0.12, ease: EASE }}>
                <motion.span
                  className="block bg-[linear-gradient(100deg,#A87935_0%,#D9B77E_35%,#A87935_55%,#8A5F2A_100%)] bg-[length:250%_100%] bg-clip-text pr-2 text-[2.4rem] text-transparent italic sm:text-5xl xl:text-[3.6rem]"
                  animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                >
                  A Taste of Tradition.
                </motion.span>
              </motion.span>
            </span>
            <svg viewBox="0 0 220 24" className="-mt-1 ml-[52%] h-5 w-40 sm:w-48" aria-hidden="true">
              <motion.path d="M4 18 C 70 6, 140 4, 190 10" stroke="#5E7A2E" strokeWidth="3" fill="none" strokeLinecap="round" variants={{ hide: { pathLength: 0 }, show: { pathLength: 1 } }} transition={{ duration: 1, delay: 0.6, ease: EASE }} />
              <motion.path d="M186 10 C 196 1, 212 0, 218 4 C 210 12, 198 14, 186 10 Z" fill="#6E8C34" variants={{ hide: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1 } }} transition={{ duration: 0.5, delay: 1.4 }} style={{ transformOrigin: '186px 10px' }} />
            </svg>
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }}>
            <p className="mt-4 text-[15px] leading-relaxed text-espresso/85 sm:text-[16px]">
              At <b className="text-espresso">THE PALM STORY</b>, we celebrate the timeless sweetness of South Indian heritage. Inspired by the natural goodness of palm jaggery and traditional recipes, we bring authentic flavours to modern celebrations.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-espresso/85 sm:text-[16px]">
              Instead of refined sugar and shortcuts, we cook with unrefined Karupatti, pure ghee and patience — preserving recipes from family kitchens across Tamil Nadu.
            </p>
          </motion.div>

          <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MARKS.map(([Icon, t], i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, y: 24, rotateX: -40 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: EASE }}
                style={{ transformPerspective: 600 }}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-white/70 px-2 py-4 text-center ring-1 ring-gold/25 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_16px_30px_-18px_rgba(43,18,13,0.5)]"
              >
                <Icon size={30} strokeWidth={1.2} className="text-gold transition-transform duration-700 ease-[var(--ease-lux)] group-hover:rotate-[360deg]" />
                <span className="text-[10px] font-semibold tracking-[0.14em] text-espresso uppercase sm:text-[10.5px]">{t}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.75, ease: EASE }} className="mt-8">
            <MagneticButton to="/about">Discover our story</MagneticButton>
          </motion.div>
        </div>

        {/* ── right: provenance card ── */}
        <motion.div ref={cardRef} animate={nudge} className="relative z-10 pb-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: 1.5 }}
            animate={cardIn ? { opacity: 1, y: 0, rotate: 0 } : {}}
            transition={{ duration: 1, ease: EASE }}
            className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#FFFBF4,#FBF2E4)] shadow-[0_40px_80px_-50px_rgba(43,18,13,0.6)] ring-1 ring-gold/25"
          >
            {/* header bar */}
            <div className="flex items-center gap-4 bg-[linear-gradient(90deg,#4A120E,#6A2A14_60%,#5D1713)] px-6 py-4 pr-24 text-ivory sm:px-8 sm:py-5 sm:pr-32">
              <Leaf size={22} strokeWidth={1.3} className="shrink-0 text-gold-soft" />
              <span className="text-[12px] font-semibold tracking-[0.34em] uppercase sm:text-[13px]">Our provenance</span>
              <span className="hidden h-7 w-px bg-gold/50 sm:block" />
              <span className="hidden text-[12px] font-semibold tracking-[0.22em] text-gold-soft uppercase sm:block">Tamil Nadu</span>
            </div>

            {/* ledger rows ink in one by one */}
            <dl className="px-5 pt-3 sm:px-8">
              {PROVENANCE.map(([Icon, k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0 }}
                  animate={cardIn ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: ROW_DELAY + i * 0.16 }}
                  className="group flex items-center gap-4 border-b border-gold/20 py-3 transition-colors duration-300 last:border-0 hover:bg-peach/60 sm:gap-5 sm:py-3.5"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={cardIn ? { scale: 1, rotate: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: ROW_DELAY + i * 0.16 }}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-peach text-cocoa ring-1 ring-gold/20 transition-colors duration-300 group-hover:bg-cocoa group-hover:text-ivory"
                  >
                    <Icon size={20} strokeWidth={1.4} />
                  </motion.span>
                  <dt className="font-serif text-[15px] text-espresso sm:text-[17px]">{k}</dt>
                  <motion.dd
                    initial={{ clipPath: 'inset(0 0 0 100%)' }}
                    animate={cardIn ? { clipPath: 'inset(0 0 0 0%)' } : {}}
                    transition={{ duration: 0.7, delay: ROW_DELAY + i * 0.16 + 0.15, ease: EASE }}
                    className="ml-auto text-right font-serif text-[14px] font-semibold text-espresso sm:text-[17px]"
                  >
                    {v}
                  </motion.dd>
                </motion.div>
              ))}
            </dl>

            {/* sketched palm landscape */}
            <div className="relative mt-2 h-32 overflow-hidden sm:h-36">
              <img src="/images/heritage/sketch-strip.jpg" alt="" aria-hidden="true" className="absolute inset-x-0 bottom-0 w-full mix-blend-multiply" style={{ maskImage: 'linear-gradient(180deg, transparent, #000 40%)', WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 40%)' }} />
              <motion.img initial={{ opacity: 0, x: -20 }} animate={cardIn ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: sealDelay - 0.3 }} style={{ maskImage: 'radial-gradient(ellipse 60% 65% at 50% 60%, #000 45%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 65% at 50% 60%, #000 45%, transparent 100%)' }} src="/images/heritage/sketch-left.jpg" alt="" aria-hidden="true" className="absolute bottom-0 left-2 h-full mix-blend-multiply" />
              <motion.img initial={{ opacity: 0, x: 20 }} animate={cardIn ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: sealDelay - 0.3 }} style={{ maskImage: 'radial-gradient(ellipse 60% 65% at 50% 60%, #000 45%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 65% at 50% 60%, #000 45%, transparent 100%)' }} src="/images/heritage/sketch-right.jpg" alt="" aria-hidden="true" className="absolute right-2 bottom-0 h-full mix-blend-multiply" />
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={cardIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: sealDelay }}
                className="relative mx-auto max-w-[17rem] px-2 pt-3 text-center text-[13px] leading-relaxed text-espresso/80 italic sm:max-w-xs sm:pt-4 sm:text-[14px]"
              >
                Every batch is cooked, packed and passed to you with our constant care.
              </motion.p>
            </div>
          </motion.div>

          <ScrollSeal targetRef={cardRef} onStamp={() => nudge.start({ y: [0, 5, -1, 0], transition: { duration: 0.45, ease: 'easeOut' } })} />
        </motion.div>
      </div>

      {/* palm grove at sunset, rising behind the story */}
      <motion.div style={{ y: sunsetY }} className="pointer-events-none absolute bottom-0 left-0 w-full lg:w-[55%]">
        <img
          src="/images/heritage/sunset.jpg"
          alt=""
          aria-hidden="true"
          className="w-full"
          style={{
            maskImage: 'linear-gradient(180deg, transparent 22%, #000 62%), linear-gradient(90deg, #000 72%, transparent)',
            maskComposite: 'intersect',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 22%, #000 62%), linear-gradient(90deg, #000 72%, transparent)',
            WebkitMaskComposite: 'source-in',
          }}
        />
        <motion.div
          className="absolute top-[52%] left-[28%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,210,140,0.55),transparent_70%)]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

/**
 * Wax seal driven by scroll: it hovers high above the card, large and tilted,
 * and descends as you scroll — its shadow sharpening beneath it — until it
 * presses onto the corner with a stamp (squash, gold ripple, wax flecks).
 * Scroll back up and it lifts away again.
 */
function ScrollSeal({ targetRef, onStamp }) {
  const { scrollYProgress: p } = useScroll({ target: targetRef, offset: ['start 95%', 'start 25%'] })
  const LAND = 0.82
  const y = useTransform(p, [0, LAND], [-260, 0], { clamp: true })
  const x = useTransform(p, [0, LAND], [-60, 0], { clamp: true })
  const rotate = useTransform(p, [0, LAND], [-55, 0], { clamp: true })
  const scale = useTransform(p, [0, LAND], [1.9, 1], { clamp: true })
  const opacity = useTransform(p, [0, 0.18], [0, 1])
  const shadowScale = useTransform(p, [0, LAND], [1.8, 1], { clamp: true })
  const shadowOpacity = useTransform(p, [0, LAND], [0.08, 0.45], { clamp: true })
  const shadowBlur = useTransform(p, [0, LAND], ['blur(22px)', 'blur(6px)'], { clamp: true })
  const [stamps, setStamps] = useState(0)
  const [landed, setLanded] = useState(false)

  useMotionValueEvent(p, 'change', (v) => {
    if (v >= LAND && !landed) {
      setLanded(true)
      setStamps((n) => n + 1)
      onStamp?.()
    } else if (v < LAND - 0.06 && landed) {
      setLanded(false)
    }
  })

  const pos = 'absolute -top-5 right-3 sm:-top-7 sm:right-6 w-24 sm:w-32'
  return (
    <>
      {/* shadow on the card, sharpening as the seal comes down */}
      <motion.span
        style={{ scale: shadowScale, opacity: shadowOpacity, filter: shadowBlur }}
        className={`pointer-events-none ${pos} z-10 aspect-square translate-y-3 rounded-full bg-espresso`}
      />
      {/* the seal */}
      <motion.div style={{ x, y, rotate, scale, opacity }} className={`${pos} z-20`}>
        <motion.div
          key={stamps}
          initial={stamps ? { scaleY: 0.86, scaleX: 1.08 } : false}
          animate={{ scaleY: 1, scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          whileHover={{ rotate: 12, scale: 1.06 }}
          className="cursor-pointer drop-shadow-[0_10px_12px_rgba(43,18,13,0.45)]"
        >
          <img src="/images/heritage/wax-seal.png" alt="The Palm Story wax seal" className="w-full" />
        </motion.div>
      </motion.div>
      {/* stamp impact: gold ripple + wax flecks */}
      <AnimatePresence>
        {landed && (
          <motion.div key={stamps} className={`pointer-events-none ${pos} z-10 aspect-square`} exit={{ opacity: 0 }}>
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-gold/80"
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{ scale: 2.1, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {Array.from({ length: 8 }, (_, k) => {
              const ang = (k / 8) * Math.PI * 2
              return (
                <motion.span
                  key={k}
                  className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-[#9A3A22]"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(ang) * 70, y: Math.sin(ang) * 70, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
