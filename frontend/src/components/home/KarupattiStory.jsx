import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import SectionHeading from '../ui/SectionHeading'
import Ornament from '../ui/Ornament'
import PalmFrond from '../art/PalmFrond'
import { Reveal, TextReveal } from '../ui/Reveal'
import { STORY } from '../../data/site'
import useMedia from '../../hooks/useMedia'

const TITLE = 'From the Palm to Your Plate'
const TEXT = 'Every sweet has a beginning. Ours begins with the natural goodness of the palm and the traditions passed down through generations.'

export default function KarupattiStory() {
  const desktop = useMedia('(min-width: 1024px)')
  return desktop ? <HorizontalStory /> : <VerticalStory />
}

/* ───────── Desktop: pinned horizontal storytelling ───────── */
function HorizontalStory() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const steps = STORY.length // panels after the intro
  const x = useTransform(p, [0, 1], ['0vw', `-${steps * 100}vw`])
  const bar = useTransform(p, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} aria-labelledby="story-h" style={{ height: `${(steps + 1) * 100}vh` }} className="relative paper">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full will-change-transform">
          {/* intro */}
          <div className="relative flex h-full w-screen shrink-0 items-center">
            <PalmFrond className="pointer-events-none absolute -top-24 -left-40 w-[620px] opacity-[0.07]" />
            <div className="container-site grid grid-cols-[1.2fr_1fr] items-center gap-16">
              <div>
                <p className="eyebrow">The Karupatti Story</p>
                <TextReveal as="h2" lines={['From the Palm', 'to Your Plate']} className="display mt-6 text-[4.2rem] text-cocoa xl:text-[5rem]" />
                <Ornament className="my-8" />
                <p className="max-w-lg font-serif text-2xl leading-snug text-cocoa-70 italic">{TEXT}</p>
              </div>
              <div className="flex flex-col items-start gap-6 border-l border-gold/40 pl-10">
                {STORY.map((s) => (
                  <p key={s.n} className="flex items-baseline gap-5 font-serif text-2xl text-cocoa">
                    <span className="text-sm text-gold">{s.n}</span>
                    {s.title}
                  </p>
                ))}
                <p className="mt-6 inline-flex items-center gap-3 text-[11px] tracking-[0.24em] text-cocoa-70 uppercase">
                  Scroll to begin <ArrowRight size={14} strokeWidth={1.3} className="animate-pulse" />
                </p>
              </div>
            </div>
          </div>

          {STORY.map((s, i) => (
            <Chapter key={s.n} story={s} i={i} p={p} steps={steps} />
          ))}
        </motion.div>

        {/* chapter progress */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8">
          <div className="container-site">
            <div className="relative h-px bg-cocoa/15">
              <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-gold" />
            </div>
            <div className="mt-3 grid grid-cols-5">
              {STORY.map((s, i) => (
                <ChapterLabel key={s.n} s={s} i={i} p={p} steps={steps} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChapterLabel({ s, i, p, steps }) {
  const a = (i + 0.5) / steps
  const opacity = useTransform(p, [a - 0.12, a, a + 0.12], [0.35, 1, 0.35])
  return (
    <motion.span style={{ opacity }} className="text-[10px] tracking-[0.24em] text-cocoa uppercase">
      {s.n} · {s.title}
    </motion.span>
  )
}

function Chapter({ story, i, p, steps }) {
  const start = i / steps
  const end = (i + 1) / steps
  const clip = useTransform(p, [start + 0.02, end - 0.04], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const imgScale = useTransform(p, [start, end + 0.1], [1.25, 1])
  const textY = useTransform(p, [start, end], [80, 0])
  const textO = useTransform(p, [start + 0.04, end - 0.02], [0, 1])
  const numX = useTransform(p, [start, end + 1 / steps], ['30%', '-20%'])
  // palm-leaf sweep crossing into this chapter
  const leafRot = useTransform(p, [start - 0.02, end], [-38, 26])
  const leafX = useTransform(p, [start, end], ['10%', '-30%'])
  const leafO = useTransform(p, [start - 0.02, start + (end - start) * 0.55, end], [0.95, 0.35, 0.14])

  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden">
      {/* organic leaf transition at the chapter edge */}
      <motion.div style={{ rotate: leafRot, x: leafX, opacity: leafO }} className="pointer-events-none absolute -top-[22%] -left-[16%] z-0 w-[44vw] origin-bottom-left">
        <PalmFrond color={i % 2 ? '#4A2116' : '#28130E'} className="w-full drop-shadow-[0_30px_40px_rgba(40,19,14,0.25)]" />
      </motion.div>

      <motion.span style={{ x: numX }} className="pointer-events-none absolute top-1/2 right-[6%] -translate-y-1/2 font-serif text-[30vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,154,85,0.35)]">
        {story.n}
      </motion.span>

      <div className="container-site relative grid grid-cols-[1fr_1.05fr] items-center gap-20">
        <motion.div style={{ y: textY, opacity: textO }} className="relative z-10 pl-[8%]">
          <p className="font-serif text-xl text-gold">{story.n}</p>
          <p className="eyebrow mt-3">{story.kicker}</p>
          <h3 className="display mt-5 text-7xl text-cocoa xl:text-[5.4rem]">{story.title}</h3>
          <Ornament className="my-7" />
          <p className="max-w-md text-[15px] leading-[1.9] text-cocoa-70">{story.text}</p>
        </motion.div>

        <div className="relative mx-auto h-[68vh] w-full max-w-[520px]">
          <div className="absolute -inset-6 rounded-t-[999px] border border-gold/40" />
          <motion.div style={{ clipPath: clip }} className="relative h-full overflow-hidden rounded-t-[999px] shadow-[0_50px_80px_-40px_rgba(40,19,14,0.5)]">
            <motion.div style={{ scale: imgScale }} className="h-full w-full">
              <SmartImage src={story.image} alt={story.title} art={story.art} className="h-full w-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ───────── Mobile / tablet: vertical chapters ───────── */
function VerticalStory() {
  return (
    <section aria-labelledby="story-h" className="paper relative overflow-hidden py-20">
      <PalmFrond className="pointer-events-none absolute -top-16 -right-32 w-[420px] opacity-[0.07]" />
      <div className="container-site">
        <SectionHeading eyebrow="The Karupatti Story" title={TITLE} text={TEXT} />
        <ol className="mt-16 space-y-20">
          {STORY.map((s, i) => (
            <li key={s.n} className="relative">
              {i > 0 && (
                <Reveal className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2">
                  <motion.div initial={{ rotate: -30, opacity: 0 }} whileInView={{ rotate: 0, opacity: 0.5 }} viewport={{ once: true }} transition={{ duration: 1.4 }}>
                    <PalmFrond className="w-16" />
                  </motion.div>
                </Reveal>
              )}
              <div className={`grid items-center gap-8 sm:grid-cols-2 sm:gap-10 ${i % 2 ? 'sm:[&>*:first-child]:order-2' : ''}`}>
                {/* observe the unclipped wrapper; the clip-path reveal runs via variants */}
                <motion.div initial="hide" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
                  <motion.div
                    variants={{ hide: { clipPath: 'inset(100% 0% 0% 0%)' }, show: { clipPath: 'inset(0% 0% 0% 0%)' } }}
                    transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-t-[999px] ring-1 ring-gold/40"
                  >
                    <SmartImage src={s.image} alt={s.title} art={s.art} className="aspect-[4/5]" />
                  </motion.div>
                </motion.div>
                <Reveal delay={0.15}>
                  <p className="font-serif text-lg text-gold">{s.n}</p>
                  <p className="eyebrow mt-2">{s.kicker}</p>
                  <h3 className="display mt-3 text-5xl text-cocoa">{s.title}</h3>
                  <Ornament className="my-5" />
                  <p className="text-[15px] leading-[1.85] text-cocoa-70">{s.text}</p>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
