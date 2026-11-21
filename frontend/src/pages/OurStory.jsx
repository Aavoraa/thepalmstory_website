import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Gift } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import MagneticButton from '../components/ui/MagneticButton'
import { Reveal } from '../components/ui/Reveal'
import { STORY } from '../data/site'
import { EASE } from '../components/ui/Reveal'
import useDocumentTitle from '../hooks/useDocumentTitle'

/*
 * Our Story — told quietly, in one continuous scroll.
 *   Opener   the word "Palm", filled with the palm grove, is zoomed into
 *            until the photo surrounds you
 *   Chapters five pinned scenes; each sentence writes itself word by word
 *            as you scroll, while one photo slowly unveils beside it
 *   Finale   "Your table is waiting."
 */
export default function OurStory() {
  useDocumentTitle('Our Story', 'From the palm to your plate — the story of Karupatti and The Palm Story’s traditional sweets.')
  return (
    <>
      <Opener />
      <Chapters />
      <Finale />
    </>
  )
}

/* ───────── Opener: zoom through the word ───────── */
const OPENER_VIDEO = '/videos/our-story-palm.mp4'
const OPENER_POSTER = '/images/journey/step-1.jpg'

function Opener() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const wordScale = useTransform(p, [0, 0.55], [1, 9])
  const veilOpacity = useTransform(p, [0.4, 0.56], [1, 0]) // ivory layer with the word cut out
  const kickerO = useTransform(p, [0, 0.12], [1, 0])
  const videoScale = useTransform(p, [0.32, 1], [1.12, 1])
  const shadeO = useTransform(p, [0.5, 0.7], [0, 1])
  const lineO = useTransform(p, [0.62, 0.78], [0, 1])
  const lineY = useTransform(p, [0.62, 0.8], [24, 0])

  // play only while on screen (saves battery and data)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative h-[260vh] bg-ivory" aria-label="Our story">
      <div className="sticky top-0 grid h-screen place-items-center overflow-hidden">
        {/* the palm film plays behind everything */}
        <motion.div style={{ scale: videoScale }} className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={OPENER_VIDEO}
            poster={OPENER_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <motion.div style={{ opacity: shadeO }} className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-espresso/25" />
        </motion.div>

        {/* ivory veil with "Palm" knocked out: black text + screen blend = see-through letters */}
        <motion.div style={{ opacity: veilOpacity }} className="pointer-events-none absolute inset-0 grid place-items-center bg-[#FFFDF9] mix-blend-screen">
          <motion.h1
            style={{ scale: wordScale }}
            className="pb-[0.08em] font-serif text-[32vw] leading-none font-semibold tracking-[-0.02em] text-black select-none lg:text-[24vw]"
          >
            Palm
          </motion.h1>
        </motion.div>

        <motion.p style={{ opacity: kickerO }} className="absolute top-[20%] text-[11px] font-medium tracking-[0.42em] text-gold uppercase">
          Our story begins with a
        </motion.p>
        <motion.p style={{ opacity: kickerO }} className="absolute bottom-[12%] flex flex-col items-center gap-3 text-[10px] tracking-[0.34em] text-cocoa-70 uppercase">
          Scroll to begin
          <motion.span className="block h-10 w-px origin-top bg-gold" animate={{ scaleY: [0, 1, 0], y: [0, 0, 20] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.p>

        {/* the first line lands on the film */}
        <motion.div style={{ opacity: lineO, y: lineY }} className="absolute inset-x-0 bottom-[14%] px-6 text-center text-ivory">
          <p className="mx-auto max-w-3xl font-serif text-3xl leading-snug drop-shadow sm:text-5xl">
            Every sweet has a beginning.
            <br />
            <span className="text-gold-soft italic">Ours begins at dawn, high in a palmyra palm.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────── Chapters ───────── */
const TONES = ['#FDF9F3', '#FBF2E6', '#FDF9F3', '#FBF2E6', '#FDF9F3']

function Chapters() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(STORY.length - 1, Math.max(0, Math.floor(v * STORY.length)))))
  const railFill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={ref} className="relative">
      {/* progress rail (desktop) */}
      <div className="pointer-events-none sticky top-0 z-20 hidden h-0 lg:block">
        <div className="absolute top-[50vh] left-[max(1.5rem,calc((100vw-1440px)/2+1.5rem))] -translate-y-1/2">
          <div className="relative flex flex-col gap-7 pl-5">
            <div className="absolute top-1 bottom-1 left-0 w-px bg-cocoa/15">
              <motion.div className="w-px bg-gold" style={{ height: railFill }} />
            </div>
            {STORY.map((s, i) => (
              <span key={s.n} className={`flex items-center gap-3 text-[10px] tracking-[0.24em] uppercase transition-colors duration-500 ${i === active ? 'text-cocoa' : 'text-cocoa/35'}`}>
                <span className={`font-serif text-sm tracking-normal ${i === active ? 'text-gold' : ''}`}>{s.n}</span>
                <span className={`transition-all duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`}>{s.title}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {STORY.map((s, i) => (
        <Chapter key={s.n} s={s} i={i} />
      ))}
    </div>
  )
}

function Chapter({ s, i }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const flip = i % 2 === 1
  const words = s.text.split(' ')

  // photo slats slide in from alternating sides, a gold arch draws behind, then the photo slowly drifts
  const imgScale = useTransform(p, [0, 1], [1.18, 1])
  const imgY = useTransform(p, [0, 1], ['5%', '-5%'])
  const frame = useTransform(p, [0.12, 0.42], [0, 1])
  const frameO = useTransform(p, [0.1, 0.16], [0, 1])
  const numY = useTransform(p, [0, 1], ['30%', '-30%'])
  const titleO = useTransform(p, [0.02, 0.15], [0, 1])
  const titleY = useTransform(p, [0.02, 0.15], [30, 0])
  const notesO = useTransform(p, [0.7, 0.82], [0, 1])

  return (
    <section ref={ref} className="relative h-[190vh]" style={{ background: TONES[i] }} aria-label={`Chapter ${s.n}: ${s.title}`}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-16">
        {/* oversized chapter numeral, drifting */}
        <motion.span
          style={{ y: numY }}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 font-serif text-[42vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(168,121,53,0.22)] lg:text-[28vw] right-[-4vw]`}
          aria-hidden="true"
        >
          {s.n}
        </motion.span>

        <div className={`container-site relative grid w-full items-center gap-5 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pl-48 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          {/* words */}
          <div>
            <motion.div style={{ opacity: titleO, y: titleY }}>
              <p className="text-[11px] font-medium tracking-[0.36em] text-gold uppercase">
                Chapter {s.n} · {s.tag}
              </p>
              <h2 className="mt-2 font-serif text-[2rem] font-semibold text-espresso sm:mt-3 sm:text-5xl lg:text-6xl">{s.title}</h2>
            </motion.div>
            {/* the sentence writes itself as you scroll */}
            <p className="mt-4 max-w-xl font-serif text-[1.15rem] leading-[1.45] text-espresso sm:mt-6 sm:text-[1.9rem] lg:text-[2.2rem]">
              {words.map((w, k) => (
                <Word key={k} p={p} range={[0.12 + (k / words.length) * 0.5, 0.12 + ((k + 1) / words.length) * 0.5]}>
                  {w}
                </Word>
              ))}
            </p>
            {s.notes && (
              <motion.p style={{ opacity: notesO }} className="mt-4 flex sm:mt-6 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.2em] text-cocoa-70 uppercase">
                {s.notes.map((n, k) => (
                  <span key={n} className="flex items-center gap-3">
                    {k > 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
                    {n}
                  </span>
                ))}
              </motion.p>
            )}
          </div>

          {/* photo */}
          <div className="relative order-first mx-auto w-[42vw] max-w-[420px] sm:w-[52vw] lg:order-none lg:w-full">
            {/* gold arch outline, drawn on scroll, offset behind the photo */}
            <motion.svg style={{ opacity: frameO }} viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden="true" className={`absolute inset-0 h-full w-full overflow-visible ${flip ? '-translate-x-3 sm:-translate-x-4' : 'translate-x-3 sm:translate-x-4'} translate-y-3 sm:translate-y-4`}>
              <motion.path d="M0.5 124.5 V50 A49.5 49.5 0 0 1 99.5 50 V124.5 Z" fill="none" stroke="#A87935" strokeWidth="1.2" vectorEffect="non-scaling-stroke" style={{ pathLength: frame }} />
            </motion.svg>
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[24px] bg-[#F1E4D0] shadow-[0_40px_80px_-45px_rgba(43,18,13,0.6)]">
              {Array.from({ length: SLATS }, (_, k) => (
                <Slat key={k} k={k} p={p} scale={imgScale} y={imgY}>
                  <SmartImage src={s.image} alt={k === 0 ? s.title : ''} art={s.art} label={false} className="h-full w-full" />
                </Slat>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SLATS = 5

/** One vertical strip of the chapter photo; strips slide in from alternate ends, staggered left to right */
function Slat({ k, p, scale, y, children }) {
  const start = 0.02 + k * 0.045
  const slide = useTransform(p, [start, start + 0.2], [k % 2 ? '-102%' : '102%', '0%'])
  const fade = useTransform(p, [start, start + 0.08], [0, 1])
  return (
    <motion.div style={{ y: slide, opacity: fade, left: `${(k * 100) / SLATS}%`, width: `calc(${100 / SLATS}% + 1px)` }} className="absolute inset-y-0 overflow-hidden">
      <div className="absolute inset-y-0" style={{ width: `${SLATS * 100}%`, left: `-${k * 100}%` }}>
        <motion.div style={{ scale, y }} className="absolute -inset-y-[8%] inset-x-0">
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

function Word({ p, range, children }) {
  const opacity = useTransform(p, range, [0.14, 1])
  const y = useTransform(p, range, [6, 0])
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.26em] inline-block">
      {children}
    </motion.span>
  )
}

/* ───────── Finale: the gift box settles in ───────── */
function Finale() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const y = useTransform(p, [0, 1], ['45%', '0%'])
  const scale = useTransform(p, [0, 1], [0.8, 1])
  const shadow = useTransform(p, [0.5, 1], [0, 1])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[linear-gradient(180deg,#FDF9F3,#FBF0E1)] pt-24 pb-24 text-center" aria-labelledby="finale-h">
      <Reveal>
        <p className="text-[11px] font-medium tracking-[0.34em] text-gold uppercase">The story continues with you</p>
      </Reveal>
      <motion.h2
        id="finale-h"
        initial="hide"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-4 font-serif text-[2.5rem] leading-tight font-semibold text-espresso sm:text-6xl lg:text-[4.4rem]"
      >
        {['Your', 'table', 'is', 'waiting.'].map((w, k) => (
          <span key={w} className="inline-block overflow-hidden pr-[0.22em] pb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${k === 3 ? 'text-cocoa italic' : ''}`}
              variants={{ hide: { y: '110%' }, show: { y: '0%' } }}
              transition={{ duration: 0.9, delay: k * 0.08, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.h2>

      <div className="relative mx-auto mt-10 w-[86vw] max-w-[560px]">
        <motion.div style={{ y, scale }} className="relative">
          <SmartImage src="/images/brand/gift-box.jpg" alt="The Palm Story keepsake box of sweets" art={{ kind: 'box', tone: 'beige' }} label={false} className="aspect-[4/3] rounded-[28px] shadow-[0_50px_90px_-50px_rgba(43,18,13,0.7)]" />
        </motion.div>
        <motion.div style={{ opacity: shadow }} className="mx-auto -mt-4 h-6 w-3/4 rounded-[50%] bg-espresso/25 blur-xl" />
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <MagneticButton to="/shop" icon={ShoppingBag}>Shop the collection</MagneticButton>
          <MagneticButton to="/gifting" icon={Gift} variant="outline">Explore gifting</MagneticButton>
        </div>
      </Reveal>
    </section>
  )
}
