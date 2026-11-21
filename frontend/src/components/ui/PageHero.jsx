import { Link } from 'react-router-dom'
import { Reveal, TextReveal } from './Reveal'
import PalmFrond from '../art/PalmFrond'

/** Shared page header: breadcrumbs, eyebrow between gold rules, serif title, intro */
export default function PageHero({ eyebrow, title, text, crumbs = [], dark = false, children }) {
  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-cocoa text-ivory' : 'bg-peach'}`}>
      <PalmFrond
        color={dark ? '#7A2A22' : '#A87935'}
        gold={dark ? '#A87935' : '#A87935'}
        className={`pointer-events-none absolute -top-28 -right-24 w-[360px] sm:w-[480px] ${dark ? 'opacity-40' : 'opacity-[0.07]'}`}
      />
      <div className="container-site relative py-12 text-center sm:py-16">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
            <ol className={`flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-[0.16em] uppercase ${dark ? 'text-beige/70' : 'text-cocoa-70'}`}>
              <li><Link to="/" className="hover:text-gold">Home</Link></li>
              {crumbs.map(([label, to]) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="text-gold">/</span>
                  {to ? <Link to={to} className="hover:text-gold">{label}</Link> : <span aria-current="page" className={dark ? 'text-ivory' : 'text-espresso'}>{label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold/60" />
              {eyebrow}
              <span className="h-px w-8 bg-gold/60" />
            </p>
          </Reveal>
        )}
        <TextReveal as="h1" lines={title} animateNow className={`display text-[2.3rem] font-semibold sm:text-5xl ${dark ? 'text-ivory' : 'text-espresso'}`} />
        {text && (
          <Reveal delay={0.15}>
            <p className={`mx-auto mt-4 max-w-2xl text-[14.5px] leading-relaxed ${dark ? 'text-beige/85' : 'text-cocoa-70'}`}>{text}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
