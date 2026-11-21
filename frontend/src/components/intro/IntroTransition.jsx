import { motion } from 'framer-motion'
import PalmFrond from '../art/PalmFrond'

const EASE = [0.76, 0, 0.24, 1]

/**
 * Two large palm fronds framing the intro. They drift gently while the story
 * plays and, on exit, swing outward like curtains to open onto the homepage.
 */
export default function IntroTransition({ opening, appearAt = 1.4 }) {
  const common = 'pointer-events-none absolute top-1/2 w-[70vw] max-w-[820px] min-w-[420px] drop-shadow-[0_30px_40px_rgba(43,18,13,0.25)]'
  return (
    <>
      <motion.div
        className={`${common} -left-[34vw] origin-bottom-left sm:-left-[26vw]`}
        initial={{ x: '-40%', y: '-50%', rotate: -30, opacity: 0 }}
        animate={opening ? { x: '-120%', y: '-60%', rotate: -55, opacity: 0.9 } : { x: '0%', y: '-50%', rotate: [-8, -5, -8], opacity: 0.9 }}
        transition={
          opening
            ? { duration: 1.1, ease: EASE }
            : { x: { duration: 1.2, delay: appearAt, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.8, delay: appearAt }, rotate: { duration: 5, delay: appearAt, repeat: Infinity, ease: 'easeInOut' } }
        }
      >
        <PalmFrond color="#6E7A3E" gold="#A87935" className="w-full -scale-x-100 rotate-90" />
      </motion.div>
      <motion.div
        className={`${common} -right-[34vw] origin-bottom-right sm:-right-[26vw]`}
        initial={{ x: '40%', y: '-50%', rotate: 30, opacity: 0 }}
        animate={opening ? { x: '120%', y: '-60%', rotate: 55, opacity: 0.9 } : { x: '0%', y: '-50%', rotate: [8, 5, 8], opacity: 0.9 }}
        transition={
          opening
            ? { duration: 1.1, ease: EASE }
            : { x: { duration: 1.2, delay: appearAt, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.8, delay: appearAt }, rotate: { duration: 5, delay: appearAt, repeat: Infinity, ease: 'easeInOut' } }
        }
      >
        <PalmFrond color="#6E7A3E" gold="#A87935" className="w-full -rotate-90" />
      </motion.div>
    </>
  )
}
