import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cookie, CookingPot, Droplet, Boxes, CakeSlice, Leaf } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { Reveal, EASE } from '../ui/Reveal'
import { CATEGORIES, productsIn } from '../../data/products'

const META = {
  sweets: { badge: 'Palm jaggery', BadgeIcon: Cookie, cta: 'Discover Sweets', unit: 'Collections', CountIcon: Boxes },
  cakes: { badge: 'Unrefined', BadgeIcon: CookingPot, cta: 'Explore Cakes', unit: 'Bakes', CountIcon: CakeSlice },
  savories: { badge: 'Cold-pressed oils', BadgeIcon: Droplet, cta: 'Explore Savories', unit: 'Varieties', CountIcon: Leaf },
}

/** Leaf-tipped brush stroke under the italic word */
function LeafUnderline({ className = '' }) {
  return (
    <svg viewBox="0 0 200 18" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M4 13 C 60 4, 120 3, 168 9" stroke="#5E7A2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M164 9 C 172 1, 188 -1, 197 3 C 189 10, 176 13, 164 9 Z" fill="#6E8C34" />
    </svg>
  )
}

export default function Categories() {
  const cats = CATEGORIES.filter((c) => c.slug !== 'gifting')
  return (
    <section aria-labelledby="collection-h" className="relative overflow-hidden bg-[linear-gradient(180deg,#FDF9F3_0%,#FCF5EC_10%,#FBF0E1_30%,#FBF1E4_60%,#F8ECDD_80%,#FDF9F3_100%)] pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-12 lg:pb-14">
      {/* soft palm shadows in the corners */}
      <img src="/images/brand/palm-shadow-left.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute top-6 -left-6 w-48 opacity-75 mix-blend-multiply sm:w-56 lg:w-72" style={{ maskImage: "radial-gradient(ellipse 60% 60% at 35% 45%, #000 25%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 35% 45%, #000 25%, transparent 100%)" }} />
      <img src="/images/brand/palm-shadow-right.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute top-6 -right-6 w-52 opacity-65 mix-blend-multiply sm:w-64 lg:w-80" style={{ maskImage: "radial-gradient(ellipse 60% 60% at 65% 45%, #000 25%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 65% 45%, #000 25%, transparent 100%)" }} />

      <div className="container-site relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 id="collection-h" className="font-serif text-[2.3rem] leading-tight font-semibold text-espresso sm:text-5xl lg:text-[3.1rem]">
              Explore the{' '}
              <span className="relative inline-block italic">
                Collection
                <motion.span
                  className="absolute -bottom-3 left-[18%] block h-3 w-[72%] origin-left sm:-bottom-4 sm:h-4"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
                >
                  <LeafUnderline className="h-full w-full" />
                </motion.span>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-[15px] text-cocoa-70 sm:text-[17px] lg:mt-5 lg:text-base">Discover a world of traditional flavours, crafted with nature’s goodness.</p>
          </Reveal>
        </div>

        {/* on desktop the row width follows screen height so the whole section fits one screen */}
        <div style={{ "--fit": "clamp(960px, calc(600svh - 3900px), 1240px)" }} className="mx-auto mt-10 grid max-w-[1320px] gap-6 sm:mt-14 md:grid-cols-2 lg:mt-9 lg:max-w-[var(--fit)] lg:grid-cols-3 lg:gap-7">
          {cats.map((c, i) => {
            const m = META[c.slug]
            const count = String(productsIn(c.slug).length).padStart(2, '0')
            return (
              <motion.article
                key={c.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
                className={i === 2 ? 'md:col-span-2 md:mx-auto md:w-[calc(50%-12px)] lg:col-span-1 lg:w-auto' : ''}
              >
                <Link
                  to={`/collections/${c.slug}`}
                  aria-label={`${m.cta} — ${c.name} collection`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[26px] bg-gradient-to-b from-[#FFF9F0] to-[#FBEEDC] shadow-[0_18px_40px_-26px_rgba(43,18,13,0.45)] ring-1 ring-gold/15 transition-all duration-500 ease-[var(--ease-lux)] hover:-translate-y-2 hover:shadow-[0_34px_60px_-30px_rgba(43,18,13,0.6)] focus-visible:-translate-y-2"
                >
                  {/* photo with wave edge */}
                  <div className="relative overflow-hidden">
                    <SmartImage
                      src={c.image}
                      alt={`${c.name} from The Palm Story`}
                      art={c.art}
                      className="aspect-[2/1] sm:aspect-[16/9] lg:aspect-[2/1]"
                      imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.08]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-espresso/85 py-1 pr-4 pl-1 text-[10.5px] font-semibold tracking-[0.12em] text-ivory uppercase shadow-lg ring-1 ring-gold/40 backdrop-blur-sm sm:top-5 sm:left-5 sm:text-[11.5px]">
                      <span className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-gold/60">
                        <m.BadgeIcon size={14} strokeWidth={1.6} className="text-gold-soft" />
                      </span>
                      {m.badge}
                    </span>
                    <svg viewBox="0 0 400 30" preserveAspectRatio="none" className="absolute -bottom-px left-0 h-6 w-full sm:h-8" aria-hidden="true">
                      <path d="M0 30 V14 C 90 30, 200 -4, 300 10 C 345 16, 380 12, 400 6 V30 Z" fill="#FFF9F0" />
                      <path d="M0 14 C 90 30, 200 -4, 300 10 C 345 16, 380 12, 400 6" stroke="#A87935" strokeWidth="1.2" fill="none" opacity=".7" />
                    </svg>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col px-6 pt-4 pb-6 sm:px-8 lg:pt-3 lg:pb-4">
                    <p className="text-[10.5px] font-medium tracking-[0.18em] text-espresso/80 uppercase sm:text-[11px]">{c.kicker}</p>
                    <h3 className="mt-1.5 font-serif text-[2.1rem] leading-tight font-semibold text-espresso italic sm:text-[2.4rem] lg:text-[2.15rem]">{c.name}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-cocoa-70 sm:text-[15px]">{c.tagline}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 lg:pt-5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-cocoa to-espresso px-6 py-2.5 text-[14px] font-medium whitespace-nowrap text-ivory shadow-[0_8px_18px_-8px_rgba(93,23,19,0.7)] transition-all duration-300 group-hover:from-[#6E2018] group-hover:shadow-[0_12px_24px_-8px_rgba(93,23,19,0.8)] sm:text-[15px]">
                        {m.cta}
                        <ArrowRight size={16} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="flex items-center gap-2.5 text-[12.5px] text-espresso lg:border-l lg:border-cocoa/25 lg:pl-5">
                        <m.CountIcon size={20} strokeWidth={1.3} className="text-cocoa" />
                        {count} {m.unit}
                      </span>
                    </div>
                  </div>

                  {/* brown wave base */}
                  <svg viewBox="0 0 400 34" preserveAspectRatio="none" className="block h-6 w-full sm:h-8" aria-hidden="true">
                    <defs>
                      <linearGradient id={`base-${c.slug}`} x1="0" x2="1">
                        <stop offset="0" stopColor="#7A3A1E" />
                        <stop offset=".5" stopColor="#5D1713" />
                        <stop offset="1" stopColor="#7A3A1E" />
                      </linearGradient>
                    </defs>
                    <path d="M0 34 V20 C 80 4, 160 26, 250 18 C 320 12, 370 4, 400 2 V34 Z" fill={`url(#base-${c.slug})`} />
                    <path d="M0 20 C 80 4, 160 26, 250 18 C 320 12, 370 4, 400 2" stroke="#D9B77E" strokeWidth="1.6" fill="none" className="transition-opacity duration-500 group-hover:opacity-100" opacity=".75" />
                  </svg>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
