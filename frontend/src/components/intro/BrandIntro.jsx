import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PalmLeafAnimation from './PalmLeafAnimation'
import LogoReveal from './LogoReveal'
import SoundToggle from './SoundToggle'
import IntroTransition from './IntroTransition'
import { startIntroAudio, muteIntroAudio, stopIntroAudio, chime, whoosh } from '../../lib/introAudio'

/**
 * Asset slots. Add footage to /public/videos/ and set `video` to enable it;
 * until then Scene 1 uses the poster still (no extra network request).
 */
export const INTRO = {
  video: null, // e.g. '/videos/palm-landscape.mp4'
  poster: '/images/intro/palm-landscape-poster.jpg',
  wordmark: '/images/logo/wordmark.png',
}

/* timeline (seconds) */
const T = {
  ivory: 1.1, // landscape dissolves into warm ivory
  leaf: 1.5, // Scene 2 — palm leaf unfolds
  leafOut: 2.85,
  logo: 3.0, // Scene 3 — emblem draws
  chime: 4.45,
  brand: 4.5, // Scene 4 — wordmark + tagline
  exit: 5.7, // Scene 5 — open onto homepage
  done: 7.0,
}
const EASE = [0.22, 1, 0.36, 1]

/**
 * "A Story Begins with a Palm." — a 7-second cinematic opening.
 * 1. Palmyra landscape at golden hour  2. a palm leaf unfolds
 * 3. the emblem draws itself  4. wordmark + tagline  5. fronds part like
 * curtains onto the homepage. Skippable, sound off by default.
 */
export default function BrandIntro({ onExitStart, onDone }) {
  const [phase, setPhase] = useState('play') // play → exit
  const [sound, setSound] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const t0 = useRef(performance.now())
  const exiting = phase === 'exit'

  // run the timeline
  useEffect(() => {
    const toExit = setTimeout(() => setPhase('exit'), T.exit * 1000)
    return () => clearTimeout(toExit)
  }, [])

  // exit: notify app, whoosh, finish
  useEffect(() => {
    if (!exiting) return
    onExitStart?.()
    if (sound) whoosh(0)
    const t = setTimeout(() => {
      stopIntroAudio(0.8)
      onDone?.()
    }, (T.done - T.exit) * 1000)
    return () => clearTimeout(t)
  }, [exiting]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopIntroAudio(0.3), [])

  const elapsed = () => (performance.now() - t0.current) / 1000

  const toggleSound = () => {
    if (sound) {
      muteIntroAudio()
      setSound(false)
      return
    }
    startIntroAudio()
    setSound(true)
    const e = elapsed()
    if (e < T.chime) chime(T.chime - e)
    if (e < T.leaf) whoosh(T.leaf - e)
  }

  const skip = () => setPhase('exit')

  return (
    <motion.div
      className="fixed inset-0 z-[250] overflow-hidden"
      role="dialog"
      aria-label="The Palm Story introduction"
      onKeyDown={(e) => e.key === 'Escape' && skip()}
    >
      {/* warm ivory ground (fades away on exit to reveal the homepage) */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#FDF9F1,#F7F3EA_55%,#EFE3CF)]"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={exiting ? { duration: 1, delay: 0.25, ease: 'easeInOut' } : { duration: 0 }}
      />

      {/* ── Scene 1: palmyra landscape at sunrise ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : [1, 1, 0] }}
        transition={exiting ? { duration: 0.3 } : { duration: T.leaf, times: [0, T.ivory / T.leaf, 1], ease: 'easeInOut' }}
      >
        <motion.div className="absolute inset-0" initial={{ scale: 1.14 }} animate={{ scale: 1.02 }} transition={{ duration: 2, ease: 'easeOut' }}>
          <img src={INTRO.poster} alt="" className="h-full w-full object-cover object-[50%_70%]" fetchPriority="high" />
          {INTRO.video && !videoFailed && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={INTRO.video}
              poster={INTRO.poster}
              autoPlay
              muted
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
            />
          )}
        </motion.div>
        {/* cinematic grade: warm sunrise, soft vignette, gentle light leak */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(255,196,110,0.35),transparent_55%)] mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(43,18,13,0.45))]" />
        <motion.div
          className="absolute -inset-x-1/4 top-0 h-full bg-gradient-to-r from-transparent via-[rgba(255,230,180,0.25)] to-transparent"
          initial={{ x: '-40%' }}
          animate={{ x: '40%' }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
        <motion.p
          className="absolute inset-x-0 bottom-[14%] text-center font-serif text-xl tracking-[0.04em] text-ivory italic drop-shadow sm:text-3xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], y: 0 }}
          transition={{ duration: 1.4, times: [0, 0.3, 0.75, 1], delay: 0.1 }}
        >
          A story begins with a palm.
        </motion.p>
      </motion.div>

      {/* curtain fronds */}
      <IntroTransition opening={exiting} appearAt={T.leaf} />

      {/* ── centre stage ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        animate={exiting ? { scale: 0.82, opacity: 0, y: -20 } : { scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="relative grid place-items-center">
          {/* Scene 2: leaf (fades as the emblem forms) */}
          {!exiting && (
            <motion.div
              className="absolute"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.6, y: -30 }}
              transition={{ duration: 0.5, delay: T.leafOut, ease: EASE }}
            >
              <PalmLeafAnimation start={T.leaf} className="h-[44vmin] w-[54vmin] max-h-[340px] max-w-[420px]" />
            </motion.div>
          )}

          {/* Scene 3: emblem */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            className="relative h-[26vmin] max-h-[210px] min-h-[130px]"
          >
            <LogoReveal start={T.logo} className="h-full" />
            {/* soft gold halo behind the emblem */}
            <motion.div
              className="absolute -inset-14 -z-10 rounded-full bg-[radial-gradient(circle,rgba(217,183,126,0.35),transparent_65%)]"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: T.logo + 0.6 }}
            />
          </motion.div>
        </div>

        {/* Scene 4: wordmark + tagline */}
        <motion.div
          className="relative mt-6 w-[62vmin] max-w-[380px] min-w-[220px] overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: T.brand, ease: EASE }}
        >
          <img src={INTRO.wordmark} alt="The Palm Story" className="w-full" />
          {/* light sweep across the letters */}
          <motion.span
            className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[rgba(255,240,205,0.85)] to-transparent mix-blend-overlay"
            initial={{ x: '-150%' }}
            animate={{ x: '400%' }}
            transition={{ duration: 1.1, delay: T.brand + 0.5, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.p
          className="mt-5 text-center text-[10px] font-medium tracking-[0.34em] text-cocoa uppercase sm:text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: T.brand + 0.35, ease: EASE }}
        >
          Rooted in nature. <span className="text-gold">Crafted through tradition.</span>
        </motion.p>
      </motion.div>

      {/* controls */}
      <motion.div
        className="absolute right-4 bottom-4 left-4 z-10 flex items-center justify-between sm:right-8 sm:bottom-7 sm:left-8"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <SoundToggle on={sound} onToggle={toggleSound} />
        <motion.button
          type="button"
          onClick={skip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="group flex items-center gap-2 rounded-full bg-espresso/70 px-4 py-2 text-[10px] font-medium tracking-[0.24em] text-ivory uppercase ring-1 ring-ivory/30 backdrop-blur-md transition-colors hover:bg-cocoa"
        >
          Skip intro
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </motion.button>
      </motion.div>

      {/* progress hairline */}
      {!exiting && (
        <motion.span
          className="absolute bottom-0 left-0 z-10 h-[2px] origin-left bg-gradient-to-r from-gold to-gold-soft"
          initial={{ scaleX: 0, width: '100%' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: T.exit, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}
