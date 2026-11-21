import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react'
import Logo from '../ui/Logo'
import Art from '../art/Art'
import { NAV, ANNOUNCEMENT } from '../../data/site'
import { CATEGORIES } from '../../data/products'
import { useStore } from '../../context/StoreContext'
import { EASE } from '../ui/Reveal'
import { lockScroll } from '../../lib/smoothScroll'

const iconBtn = 'relative grid h-10 w-10 place-items-center text-cocoa transition-colors hover:text-gold'

export default function Header() {
  const { count, wishlist, setCartOpen, setSearchOpen } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [mobile, setMobile] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // close menus on navigation
  useEffect(() => {
    setMega(false)
    setMobile(false)
  }, [pathname])
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    lockScroll(mobile)
  }, [mobile])

  return (
    <>
      {/* announcement */}
      <div className="bg-espresso text-ivory/90">
        <p className="container-site flex items-center justify-center gap-2 py-2 text-center text-[9.5px] font-medium tracking-[0.18em] uppercase sm:text-[10.5px]"><span className="text-gold-soft">✦</span><span className="hidden sm:inline">{ANNOUNCEMENT}</span><span className="sm:hidden">Free heritage tin packaging over ₹1,499</span></p>
      </div>

      <header
        className={`sticky top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500 ${
          scrolled || mega ? 'bg-[#FDF9F3]/92 shadow-[0_10px_30px_-20px_rgba(40,19,14,0.35)] backdrop-blur-md' : 'bg-[#FDF9F3]'
        }`}
        onMouseLeave={() => setMega(false)}
      >
        <div className={`container-site grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-[height] duration-500 xl:grid-cols-[1fr_auto_1fr] ${scrolled ? 'h-[68px]' : 'h-[84px]'}`}>
          <div className="flex items-center gap-1">
            <button className={`${iconBtn} -ml-2 xl:hidden`} aria-label="Open menu" onClick={() => setMobile(true)}>
              <Menu size={20} strokeWidth={1.3} />
            </button>
            <Logo />
          </div>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {NAV.map((item) => (
                <li key={item.label} onMouseEnter={() => setMega(!!item.mega)}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className="link-lux py-3 whitespace-nowrap text-[10.5px] font-semibold tracking-[0.16em] text-espresso uppercase aria-[current=page]:text-cocoa"
                    onFocus={() => setMega(!!item.mega)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <button className={iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={19} strokeWidth={1.3} />
            </button>
            
            <Link to="/wishlist" className={iconBtn} aria-label={`Wishlist, ${wishlist.length} items`}>
              <Heart size={19} strokeWidth={1.3} />
              {wishlist.length > 0 && <Badge n={wishlist.length} />}
            </Link>
            <button className={iconBtn} aria-label={`Shopping bag, ${count} items`} onClick={() => setCartOpen(true)}>
              <ShoppingBag size={19} strokeWidth={1.3} />
              {count > 0 && <Badge n={count} />}
            </button>
            <Link to="/account" className="ml-1 hidden h-9 w-9 place-items-center rounded-full bg-espresso text-ivory transition-colors hover:bg-cocoa sm:grid" aria-label="Account">
              <User size={16} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
        <div className="hairline" />

        {/* Shop mega dropdown */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-x-0 top-full hidden border-b border-gold/30 bg-ivory xl:block"
            >
              <div className="container-site grid grid-cols-[1fr_3fr] gap-12 py-10">
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="eyebrow">The Collection</p>
                    <p className="mt-4 font-serif text-3xl leading-tight text-cocoa">Traditional flavours, crafted with nature’s goodness.</p>
                  </div>
                  <Link to="/shop" className="link-lux mt-6 inline-flex w-fit items-center gap-2 text-[11px] tracking-[0.22em] uppercase">
                    Shop all <ArrowRight size={14} strokeWidth={1.3} />
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-5">
                  {CATEGORIES.map((c, i) => (
                    <motion.div key={c.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE }}>
                      <Link to={c.slug === 'gifting' ? '/gifting' : `/collections/${c.slug}`} className="group block">
                        <div className="aspect-[4/3] overflow-hidden ring-1 ring-gold/30">
                          <div className="h-full w-full transition-transform duration-1000 ease-[var(--ease-lux)] group-hover:scale-105">
                            <Art {...c.art} />
                          </div>
                        </div>
                        <p className="mt-3 font-serif text-xl text-cocoa">{c.name}</p>
                        <p className="text-xs text-cocoa-70">{c.tagline}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobile && (
          <motion.div data-lenis-prevent className="fixed inset-0 z-[70] xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-espresso/50" onClick={() => setMobile(false)} />
            <motion.nav
              aria-label="Mobile"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="paper absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-5">
                <Logo />
                <button className={iconBtn} aria-label="Close menu" onClick={() => setMobile(false)}>
                  <X size={20} strokeWidth={1.3} />
                </button>
              </div>
              <div className="hairline" />
              <ul className="flex-1 px-6 py-6">
                {NAV.map((item, i) => (
                  <motion.li key={item.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05, ease: EASE, duration: 0.6 }}>
                    <NavLink to={item.to} end={item.to === '/'} className="flex items-center justify-between border-b border-gold/20 py-4 font-serif text-[1.7rem] text-cocoa">
                      {item.label}
                      <ArrowRight size={16} strokeWidth={1.2} className="text-gold" />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className="flex gap-6 px-6 pb-8 text-[11px] tracking-[0.2em] text-cocoa uppercase">
                <Link to="/account">Account</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/contact">Contact</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Badge({ n }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      className="absolute top-1 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-semibold text-white"
    >
      {n}
    </motion.span>
  )
}
