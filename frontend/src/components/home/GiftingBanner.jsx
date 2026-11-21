import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion'
import { Gift, PenLine, BadgeCheck, Truck, Briefcase } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import { EASE } from '../ui/Reveal'
import { getProduct } from '../../data/products'

const FEATURES = [
  [Gift, 'Wax Seal Stamping', 'Add a signature touch on every keepsake box.'],
  [PenLine, 'Handwritten Notes', 'Your message, written by hand on cards and notecards.'],
  [BadgeCheck, 'Keepsake Tins', 'Cherished and collectible even after the sweets are gone.'],
  [Truck, 'Express Delivery', 'Festive orders and corporate gifts, packed fresh and dispatched within 48 hours.'],
]

const formatINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

/**
 * "Gift a Little Tradition." — the gifting suite.
 * Signature animation: the photo arrives gift-wrapped. A satin ribbon and bow
 * sit over the box; as the section scrolls in the bow lifts away and the
 * ribbons slide apart to "unwrap" the hamper, then gold sparkles drift up.
 */
export default function GiftingBanner() {
  const ref = useRef(null)
  const photoRef = useRef(null)
  const inView = useInView(photoRef, { once: true, amount: 0.45 })
  const hamper = getProduct('signature-hamper')
  const price = hamper?.variants[0].price ?? 1850

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const leafRotate = useTransform(scrollYProgress, [0, 1], [-6, 6])

  // count the price up once unwrapped
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, price, { duration: 1.4, delay: 1.5, ease: EASE, onUpdate: setShown })
    return () => c.stop()
  }, [inView, price])

  return (
    <section ref={ref} aria-labelledby="gift-h" className="container-site relative py-16 lg:py-10">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FCF5EA] via-[#FBF1E4] to-[#F6E8D6] p-5 shadow-[0_30px_70px_-45px_rgba(43,18,13,0.5)] ring-1 ring-gold/15 sm:p-8 lg:p-10">
        {/* swaying palm leaf, top-right */}
        <motion.img
          src="/images/journey/palm-leaf.jpg"
          alt=""
          aria-hidden="true"
          style={{ rotate: leafRotate, maskImage: 'radial-gradient(ellipse 70% 80% at 70% 30%, #000 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 70% 30%, #000 30%, transparent 100%)' }}
          className="pointer-events-none absolute -top-4 -right-4 z-20 w-52 origin-top-right mix-blend-multiply sm:w-72 lg:w-80"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
          {/* ── left: story + features + CTAs ── */}
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-espresso uppercase"
            >
              <motion.span
                initial={{ rotate: -20, scale: 0.6 }}
                whileInView={{ rotate: [-20, 12, -6, 0], scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE }}
              >
                <Gift size={26} strokeWidth={1.3} className="text-gold" />
              </motion.span>
              The royal gifting suite
              <motion.span
                className="hidden h-px w-40 origin-left bg-gradient-to-r from-gold to-transparent sm:block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, delay: 0.3, ease: EASE }}
              />
            </motion.p>

            <motion.h2 id="gift-h" initial="hide" whileInView="show" viewport={{ once: true }} className="mt-5 font-serif leading-[1.02] font-semibold">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block text-[2.6rem] text-espresso sm:text-[3.4rem] xl:text-[3.9rem]"
                  variants={{ hide: { y: '110%' }, show: { y: '0%' } }}
                  transition={{ duration: 1, ease: EASE }}
                >
                  Gift a Little
                </motion.span>
              </span>
              <span className="relative block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="block w-fit"
                  variants={{ hide: { y: '110%' }, show: { y: '0%' } }}
                  transition={{ duration: 1, delay: 0.12, ease: EASE }}
                >
                  {/* slow gold shimmer across the word */}
                  <motion.span
                    className="block bg-[linear-gradient(100deg,#A87935_0%,#D9B77E_35%,#A87935_55%,#8A5F2A_100%)] bg-[length:250%_100%] bg-clip-text pr-2 text-[2.9rem] text-transparent italic sm:text-[3.8rem] xl:text-[4.4rem]"
                    animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Tradition.
                  </motion.span>
                </motion.span>
              </span>
              {/* leaf brush-stroke */}
              <svg viewBox="0 0 220 24" className="-mt-2 ml-[42%] h-5 w-44 sm:w-52" aria-hidden="true">
                <motion.path
                  d="M4 18 C 70 6, 140 4, 190 10"
                  stroke="#5E7A2E"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  variants={{ hide: { pathLength: 0 }, show: { pathLength: 1 } }}
                  transition={{ duration: 1, delay: 0.6, ease: EASE }}
                />
                <motion.path
                  d="M186 10 C 196 1, 212 0, 218 4 C 210 12, 198 14, 186 10 Z"
                  fill="#6E8C34"
                  variants={{ hide: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1 } }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  style={{ transformOrigin: '186px 10px' }}
                />
              </svg>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="mt-3 max-w-xl text-[15px] leading-relaxed text-espresso/85 sm:text-[16.5px]"
            >
              Celebrate meaningful moments with thoughtfully crafted sweets, beautifully presented for weddings, festivals and corporate milestones.
            </motion.p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {FEATURES.map(([Icon, t, d], i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, y: 24, rotateX: -25 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.35 + i * 0.1, ease: EASE }}
                  style={{ transformPerspective: 600 }}
                  className="group flex gap-3.5 rounded-2xl bg-white/85 p-4 shadow-[0_10px_30px_-22px_rgba(43,18,13,0.5)] ring-1 ring-gold/10 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_36px_-20px_rgba(43,18,13,0.5)]"
                >
                  <Icon size={30} strokeWidth={1.2} className="mt-0.5 shrink-0 text-gold transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
                  <div>
                    <h3 className="font-serif text-[1.08rem] font-semibold text-espresso">{t}</h3>
                    <p className="mt-1 text-[12.5px] leading-snug text-espresso/75">{d}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <MagneticButton to="/gifting" icon={Gift} className="!gap-2.5 !px-5 !tracking-[0.14em] xl:!px-6">Explore luxury gifting</MagneticButton>
              <MagneticButton to="/contact" icon={Briefcase} variant="outline" className="!gap-2.5 !px-5 !tracking-[0.14em] xl:!px-6">Corporate inquiry</MagneticButton>
            </motion.div>
          </div>

          {/* ── right: gift-wrapped photo ── */}
          <div ref={photoRef} className="relative h-[340px] overflow-hidden rounded-[28px] rounded-tl-[120px] shadow-[0_30px_60px_-30px_rgba(43,18,13,0.55)] sm:h-[460px] lg:h-[560px] lg:rounded-tl-[160px]">
            <motion.div style={{ y: photoY }} className="absolute -inset-y-[6%] inset-x-0">
              <motion.img
                src="/images/brand/gift-box.jpg"
                alt="The Palm Story keepsake gift box with five rows of sweets"
                className="h-full w-full object-cover"
                initial={{ scale: 1.15, filter: 'blur(6px) brightness(0.9)' }}
                animate={inView ? { scale: 1, filter: 'blur(0px) brightness(1)' } : {}}
                transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/35 via-transparent to-transparent" />

            <Unwrap open={inView} />
            <Sparkles active={inView} />

            {/* price card */}
            {hamper && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
                className="absolute right-3 bottom-3 left-3 sm:right-6 sm:bottom-6 sm:left-auto"
              >
                <Link
                  to={`/product/${hamper.slug}`}
                  className="group/price relative flex items-center gap-5 overflow-hidden rounded-2xl bg-gradient-to-br from-cocoa to-espresso px-5 py-3.5 text-ivory shadow-xl ring-1 ring-gold/40 transition-transform duration-500 hover:-translate-y-1 sm:px-7 sm:py-4"
                >
                  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-gold-soft/30 to-transparent transition-transform duration-1000 group-hover/price:translate-x-[350%]" />
                  <span className="relative">
                    <span className="block text-[10px] font-semibold tracking-[0.24em] text-gold-soft uppercase">Festive centrepiece</span>
                    <span className="mt-0.5 block font-serif text-lg italic sm:text-[1.35rem]">Sovereign Heritage Hamper</span>
                  </span>
                  <span className="relative h-10 w-px bg-gold/40" />
                  <span className="relative font-serif text-2xl font-semibold tabular-nums sm:text-[1.9rem]">{formatINR(shown)}</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Satin ribbon + bow that slides away to reveal the photo */
function Unwrap({ open }) {
  const satin = 'bg-[linear-gradient(90deg,#3E0F0B,#7A2A1F_30%,#5D1713_55%,#8A3426_75%,#3E0F0B)]'
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {/* vertical ribbon: splits up and down */}
      <motion.div
        className={`absolute top-0 left-1/2 h-1/2 w-14 -translate-x-1/2 ${satin} shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`}
        animate={open ? { y: '-105%' } : { y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: EASE }}
      />
      <motion.div
        className={`absolute bottom-0 left-1/2 h-1/2 w-14 -translate-x-1/2 ${satin} shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`}
        animate={open ? { y: '105%' } : { y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: EASE }}
      />
      {/* horizontal ribbon: splits left and right */}
      <motion.div
        className={`absolute top-1/2 left-0 h-14 w-1/2 -translate-y-1/2 ${satin} [background-image:linear-gradient(180deg,#3E0F0B,#7A2A1F_30%,#5D1713_55%,#8A3426_75%,#3E0F0B)] shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`}
        animate={open ? { x: '-105%' } : { x: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: EASE }}
      />
      <motion.div
        className={`absolute top-1/2 right-0 h-14 w-1/2 -translate-y-1/2 ${satin} [background-image:linear-gradient(180deg,#3E0F0B,#7A2A1F_30%,#5D1713_55%,#8A3426_75%,#3E0F0B)] shadow-[0_0_0_2px_rgba(217,183,126,0.5)]`}
        animate={open ? { x: '105%' } : { x: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: EASE }}
      />
      {/* bow */}
      <motion.svg
        viewBox="0 0 160 110"
        className="absolute top-1/2 left-1/2 w-36 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)] sm:w-44"
        animate={open ? { y: -260, rotate: -25, scale: 0.6, opacity: 0 } : { y: 0, rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.5, 0, 0.75, 0] }}
      >
        <defs>
          <linearGradient id="bowSatin" x1="0" x2="1">
            <stop offset="0" stopColor="#4A120E" />
            <stop offset=".45" stopColor="#8A3426" />
            <stop offset="1" stopColor="#4A120E" />
          </linearGradient>
        </defs>
        <path d="M80 55 C 40 10, 2 22, 12 52 C 20 78, 58 70, 80 55 Z" fill="url(#bowSatin)" stroke="#D9B77E" strokeWidth="1.5" />
        <path d="M80 55 C 120 10, 158 22, 148 52 C 140 78, 102 70, 80 55 Z" fill="url(#bowSatin)" stroke="#D9B77E" strokeWidth="1.5" />
        <path d="M74 60 L 52 106 L 66 100 L 72 108 L 80 62 Z" fill="url(#bowSatin)" stroke="#D9B77E" strokeWidth="1.2" />
        <path d="M86 60 L 108 106 L 94 100 L 88 108 L 80 62 Z" fill="url(#bowSatin)" stroke="#D9B77E" strokeWidth="1.2" />
        <ellipse cx="80" cy="56" rx="12" ry="10" fill="#7A2A1F" stroke="#D9B77E" strokeWidth="1.5" />
      </motion.svg>
    </div>
  )
}

/** Gold sparkles that drift up after the unwrap */
function Sparkles({ active }) {
  const dots = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      left: `${8 + ((i * 53) % 84)}%`,
      size: 3 + (i % 4),
      delay: 1.6 + (i % 7) * 0.45,
      dur: 4 + (i % 5),
    })),
  ).current
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold-soft shadow-[0_0_10px_3px_rgba(217,183,126,0.7)]"
          style={{ left: d.left, width: d.size, height: d.size }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [-20, -420], opacity: [0, 1, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, repeatDelay: 1.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
