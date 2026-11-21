import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { searchProducts, formatPrice, fromPrice, productImage } from '../../data/products'
import SmartImage from '../ui/SmartImage'
import { EASE } from '../ui/Reveal'

const SUGGESTIONS = ['Laddu', 'Halwa', 'Karupatti', 'Murukku', 'Gift tin', 'Cake']

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore()
  const [q, setQ] = useState('')
  const input = useRef(null)
  const navigate = useNavigate()
  const results = searchProducts(q).slice(0, 6)

  useEffect(() => {
    if (!searchOpen) return
    setTimeout(() => input.current?.focus(), 250)
    const k = (e) => e.key === 'Escape' && setSearchOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [searchOpen, setSearchOpen])

  const go = (to) => {
    setSearchOpen(false)
    setQ('')
    navigate(to)
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div data-lenis-prevent className="fixed inset-0 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-espresso/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <motion.div
            role="dialog"
            aria-label="Search"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="paper relative max-h-[90vh] overflow-y-auto border-b border-gold/40"
          >
            <div className="container-site py-8 sm:py-12">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Search the collection</p>
                <button aria-label="Close search" onClick={() => setSearchOpen(false)} className="grid h-10 w-10 place-items-center hover:text-gold">
                  <X size={20} strokeWidth={1.3} />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`)
                }}
                className="mt-4 flex items-center gap-4 border-b border-cocoa/30 pb-3 focus-within:border-gold"
              >
                <Search size={24} strokeWidth={1.1} className="text-gold" />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Laddu, halwa, gift tin…"
                  aria-label="Search products"
                  className="w-full bg-transparent font-serif text-3xl text-cocoa placeholder:text-cocoa/30 focus:outline-none sm:text-5xl"
                />
              </form>

              {!q && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => setQ(s)} className="border border-gold/50 px-4 py-2 text-[11px] tracking-[0.18em] uppercase transition-colors hover:bg-cocoa hover:text-ivory">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {q && (
                <div className="mt-8">
                  {results.length === 0 ? (
                    <p className="font-serif text-xl italic text-cocoa-70">No sweets found for “{q}”. Try “laddu” or “halwa”.</p>
                  ) : (
                    <>
                      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {results.map((p) => (
                          <li key={p.slug}>
                            <button onClick={() => go(`/product/${p.slug}`)} className="group flex w-full items-center gap-4 bg-cream p-3 text-left ring-1 ring-gold/25 transition-shadow hover:shadow-lg">
                              <SmartImage src={productImage(p)} alt={p.name} art={p.art} position={p.focus} label={false} className="h-20 w-16 shrink-0 rounded-t-full" />
                              <span className="flex-1">
                                <span className="block font-serif text-xl">{p.name}</span>
                                <span className="text-xs text-cocoa-70">from {formatPrice(fromPrice(p))}</span>
                              </span>
                              <ArrowRight size={16} strokeWidth={1.2} className="text-gold transition-transform group-hover:translate-x-1" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => go(`/shop?q=${encodeURIComponent(q)}`)} className="link-lux mt-6 text-[11px] tracking-[0.22em] uppercase">
                        See all results
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
