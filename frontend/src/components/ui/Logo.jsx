import { Link } from 'react-router-dom'

/**
 * Brand lockup.
 * Default: the official horizontal logo (mark + "THE PALM STORY") from /images/logo/logo-header.png.
 * light: mark + typeset wordmark in ivory, for dark backgrounds.
 */
export default function Logo({ light = false, className = '' }) {
  if (!light)
    return (
      <Link to="/" aria-label="The Palm Story — home" className={`group inline-flex items-center ${className}`}>
        <img
          src="/images/logo/logo-header.png"
          alt="The Palm Story"
          width="593"
          height="228"
          className="h-12 w-auto transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03] sm:h-14 lg:h-[62px]"
        />
      </Link>
    )

  return (
    <Link to="/" aria-label="The Palm Story — home" className={`group inline-flex items-center gap-2 sm:gap-3 ${className}`}>
      <img
        src="/images/logo/mark-light.png"
        alt=""
        width="44"
        height="56"
        className="h-9 w-auto transition-transform sm:h-11 duration-700 ease-[var(--ease-lux)] group-hover:-rotate-3 lg:h-[52px]"
      />
      <span className="flex flex-col leading-none text-ivory">
        <span className="flex items-center gap-2 font-serif text-[0.62rem] tracking-[0.42em]">
          <span className="h-px w-4 bg-gold" />
          THE
          <span className="h-px w-4 bg-gold" />
        </span>
        <span className="mt-1 font-serif text-[1.02rem] tracking-[0.12em] sm:text-[1.25rem] sm:tracking-[0.16em] whitespace-nowrap lg:text-[1.4rem]">PALM STORY</span>
      </span>
    </Link>
  )
}
