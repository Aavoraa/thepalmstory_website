import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { formatPrice, productImage } from '../../data/products'
import { FREE_SHIPPING_THRESHOLD } from '../../data/site'
import SmartImage from '../ui/SmartImage'
import QuantitySelector from '../ui/QuantitySelector'
import { EASE } from '../ui/Reveal'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

/** Promo code input (demo codes live in src/data/site.js) */
export function PromoField() {
  const { promo, applyPromo, clearPromo } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  if (promo)
    return (
      <p className="flex items-center justify-between rounded border border-gold/40 bg-white px-3 py-2 text-xs">
        <span>Code <b className="tracking-wider">{promo}</b> applied</span>
        <button onClick={clearPromo} className="text-[10px] tracking-[0.16em] text-cocoa-70 uppercase underline">Remove</button>
      </p>
    )
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setError(applyPromo(code) ? '' : 'This code isn’t valid.')
      }}
    >
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo code (e.g. PALM10)"
          aria-label="Promo code"
          className="min-w-0 flex-1 rounded-[3px] border border-beige bg-white px-3 py-2 text-xs tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal focus:border-gold focus:outline-none"
        />
        <button className="rounded-[3px] bg-gold px-4 text-[10px] font-semibold tracking-[0.16em] text-white uppercase hover:bg-cocoa">Apply</button>
      </div>
      {error && <p className="mt-1 text-[11px] text-[#9b3b22]">{error}</p>}
    </form>
  )
}

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, subtotal, shipping, discount, promo, total, updateQty, removeFromCart } = useStore()
  const navigate = useNavigate()
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  useEffect(() => {
    if (!cartOpen) return
    const k = (e) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [cartOpen, setCartOpen])

  const go = (to) => {
    setCartOpen(false)
    navigate(to)
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div data-lenis-prevent className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-espresso/45 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="font-serif text-2xl tracking-wide">Your Bag</h2>
              <button aria-label="Close bag" onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center hover:text-gold">
                <X size={20} strokeWidth={1.3} />
              </button>
            </div>
            <div className="hairline" />

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <ShoppingBag size={34} strokeWidth={1} className="text-gold" />
                <p className="font-serif text-2xl">Your bag is waiting to be filled.</p>
                <button onClick={() => go('/shop')} className="btn btn-primary">Explore the collection</button>
              </div>
            ) : (
              <>
                <div className="px-6 pt-4">
                  <p className="text-xs text-cocoa-70">
                    {remaining > 0 ? <>Add <b className="text-cocoa">{formatPrice(remaining)}</b> more for complimentary shipping.</> : 'Your order ships complimentary.'}
                  </p>
                  <div className="mt-2 h-[3px] bg-beige">
                    <motion.div className="h-full bg-gold" initial={false} animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                  </div>
                </div>
                <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  <AnimatePresence initial={false}>
                    {cart.map((l) => (
                      <motion.li key={l.key} layout exit={{ opacity: 0, x: 40 }} className="flex gap-3.5 rounded-md bg-peach p-3">
                        <button onClick={() => go(`/product/${l.slug}`)} className="shrink-0">
                          <SmartImage src={productImage(l.product)} alt={l.product.name} art={l.product.art} position={l.product.focus} label={false} className="h-20 w-20 rounded" />
                        </button>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <button onClick={() => go(`/product/${l.slug}`)} className="text-left font-serif text-[15px] leading-tight font-medium">{l.product.name}</button>
                            <button onClick={() => removeFromCart(l.key)} aria-label={`Remove ${l.product.name}`} className="h-6 shrink-0 text-cocoa-70 hover:text-cocoa">
                              <Trash2 size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-[11px] text-cocoa-70">{l.variant.label} · {l.packaging.name}</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QuantitySelector size="sm" value={l.qty} onChange={(q) => updateQty(l.key, q)} />
                            <p className="font-serif text-base font-semibold">{formatPrice(l.total)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-gold/30 bg-cream px-6 py-5">
                  <PromoField />
                  <dl className="mt-4 space-y-1.5 text-[13px]">
                    <div className="flex justify-between"><dt className="text-cocoa-70">Bag subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                    {discount > 0 && <div className="flex justify-between text-gold"><dt>Code {promo}</dt><dd>−{formatPrice(discount)}</dd></div>}
                    <div className="flex justify-between"><dt className="text-cocoa-70">Keepsake packaging</dt><dd className="text-gold">Included in item price</dd></div>
                    <div className="flex justify-between"><dt className="text-cocoa-70">Express shipping</dt><dd>{shipping ? formatPrice(shipping) : 'Free'}</dd></div>
                    <div className="flex items-baseline justify-between border-t border-beige pt-2.5"><dt className="font-serif text-base font-semibold">Total payable</dt><dd className="font-serif text-xl font-semibold">{formatPrice(total)}</dd></div>
                  </dl>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button onClick={() => go('/cart')} className="btn btn-outline">View Bag</button>
                    <button onClick={() => go('/checkout')} className="btn btn-primary">Checkout</button>
                  </div>
                  <Link to="/shop" onClick={() => setCartOpen(false)} className="mt-4 block text-center text-[10px] tracking-[0.2em] text-cocoa-70 uppercase hover:text-cocoa">
                    Continue shopping
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
