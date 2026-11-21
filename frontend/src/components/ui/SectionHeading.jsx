import { Reveal, TextReveal } from './Reveal'

/** Eyebrow + serif heading (+ optional italic gold accent line) + supporting text */
export default function SectionHeading({ eyebrow, title, accent, text, align = 'center', light = false, className = '', as = 'h2' }) {
  const center = align === 'center'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow mb-3">{eyebrow}</p>
        </Reveal>
      )}
      <TextReveal
        as={as}
        lines={accent ? [title, <span key="a" className="accent">{accent}</span>] : title}
        className={`display text-[1.9rem] font-semibold sm:text-4xl lg:text-[2.55rem] ${light ? 'text-ivory' : 'text-espresso'}`}
      />
      {text && (
        <Reveal delay={0.15}>
          <p className={`mt-4 text-[14.5px] leading-relaxed ${light ? 'text-beige/80' : 'text-cocoa-70'}`}>{text}</p>
        </Reveal>
      )}
    </div>
  )
}
