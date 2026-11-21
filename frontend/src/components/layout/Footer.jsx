import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Ornament from '../ui/Ornament'
import { SOCIAL } from '../../data/site'
import { SOCIAL_ICONS } from '../ui/Icons'

const COLS = [
  {
    title: 'Quick Links',
    links: [
      ['Home', '/'], ['Shop', '/shop'], ['Our Story', '/our-story'], ['About Us', '/about'], ['Gifting', '/gifting'], ['Contact', '/contact'],
    ],
  },
  { title: 'Shop', links: [['Sweets', '/collections/sweets'], ['Cakes', '/collections/cakes'], ['Savories', '/collections/savories']] },
  {
    title: 'Customer Care',
    links: [
      ['FAQs', '/help/faqs'], ['Shipping', '/help/shipping'], ['Returns', '/help/returns'], ['Privacy Policy', '/help/privacy'], ['Terms & Conditions', '/help/terms'],
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <footer className="relative overflow-hidden bg-cocoa text-ivory">
      {/* faint palm watermark */}
      <img src="/images/logo/mark-light.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-24 w-[420px] opacity-[0.05]" />

      {/* newsletter */}
      <div className="container-site relative grid gap-10 py-16 lg:grid-cols-2 lg:items-end lg:py-20">
        <div>
          <p className="eyebrow">The Palm Story Letters</p>
          <h2 className="display mt-4 text-4xl text-ivory sm:text-5xl">Be part of our<br />sweet story.</h2>
          <p className="mt-4 max-w-md text-sm text-beige/80">Festive launches, new recipes and stories from the palm groves — a few thoughtful letters a season.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (/\S+@\S+\.\S+/.test(email)) setDone(true)
          }}
          className="w-full"
        >
          {done ? (
            <p className="font-serif text-2xl text-gold-soft italic">Thank you — welcome to the story.</p>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full border-b border-ivory/30 bg-transparent py-3.5 text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
                />
              </label>
              <button className="btn btn-gold">Subscribe <ArrowRight size={14} strokeWidth={1.4} /></button>
            </div>
          )}
        </form>
      </div>

      <div className="container-site"><div className="h-px bg-gold/30" /></div>

      <div className="container-site relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Link to="/" aria-label="The Palm Story — home">
            <img src="/images/logo/logo-gold.png" alt="The Palm Story" width="520" height="497" className="w-36 transition-transform duration-700 ease-[var(--ease-lux)] hover:scale-[1.03] sm:w-40" loading="lazy" />
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-beige/75">
            Traditional South Indian sweets crafted with Karupatti — palm jaggery — heirloom recipes and a love for the art of making.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="eyebrow !font-sans !text-[10px]">{c.title}</h3>
            <ul className="mt-5 space-y-3">
              {c.links.map(([l, to]) => (
                <li key={l}>
                  <Link to={to} className="link-lux text-sm text-ivory/80 transition-colors hover:text-ivory">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="eyebrow !font-sans !text-[10px]">Follow</h3>
          <ul className="mt-5 space-y-3">
            {SOCIAL.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon]
              return (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`The Palm Story on ${s.label} (opens in a new tab)`} className="group inline-flex items-center gap-3 text-sm text-ivory/80 hover:text-ivory">
                    <span className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-gold/40 transition-colors group-hover:bg-gold group-hover:text-espresso">
                      <Icon width={15} height={15} />
                    </span>
                    {s.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-gold/20 bg-espresso/40">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-[11px] tracking-[0.14em] text-ivory/55 sm:flex-row">
          <p>© {new Date().getFullYear()} The Palm Story. All rights reserved.</p>
          <Ornament width={120} className="opacity-70" />
          <p>Crafted with Karupatti in Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  )
}
