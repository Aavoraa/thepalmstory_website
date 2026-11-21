import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SmartImage from '../components/ui/SmartImage'
import QuantitySelector from '../components/ui/QuantitySelector'
import { useStore } from '../context/StoreContext'
import { PromoField } from '../components/layout/CartDrawer'
import { formatPrice, productImage } from '../data/products'
import { FREE_SHIPPING_THRESHOLD } from '../data/site'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Cart() {
  useDocumentTitle('Your Bag')
  const { cart, count, subtotal, shipping, total, updateQty, removeFromCart } = useStore()

  return (
    <>
      <PageHero title="Your Bag" crumbs={[['Bag']]} text={count ? `${count} ${count === 1 ? 'item' : 'items'} awaiting you.` : null} />
      <section className="container-site py-12 lg:py-16">
        {cart.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-3xl">Your bag is empty.</p>
            <p className="mt-3 text-cocoa-70">Begin with our signature Karupatti Laddu.</p>
            <Link to="/shop" className="btn btn-primary mt-8">Explore the collection</Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div>
              <div className="hidden grid-cols-[1fr_140px_120px_32px] gap-6 border-b border-gold/40 pb-3 text-[10px] tracking-[0.22em] text-cocoa-70 uppercase md:grid">
                <span>Product</span><span>Quantity</span><span className="text-right">Total</span><span />
              </div>
              <ul>
                <AnimatePresence initial={false}>
                  {cart.map((l) => (
                    <motion.li key={l.key} layout exit={{ opacity: 0, height: 0 }} className="grid grid-cols-[88px_1fr] items-center gap-x-5 gap-y-3 border-b border-gold/30 py-6 md:grid-cols-[1fr_140px_120px_32px] md:gap-6">
                      <Link to={`/product/${l.slug}`} className="flex items-center gap-5 md:col-span-1">
                        <SmartImage src={productImage(l.product)} alt={l.product.name} art={l.product.art} position={l.product.focus} label={false} className="h-28 w-[88px] shrink-0 rounded ring-1 ring-gold/20" />
                        <span className="hidden md:block">
                          <span className="block font-serif text-2xl">{l.product.name}</span>
                          <span className="text-xs text-cocoa-70">{l.variant.label} · {l.packaging.name} · {formatPrice(l.unit)}</span>
                        </span>
                      </Link>
                      <div className="md:hidden">
                        <Link to={`/product/${l.slug}`} className="block font-serif text-xl">{l.product.name}</Link>
                        <span className="text-xs text-cocoa-70">{l.variant.label} · {l.packaging.name} · {formatPrice(l.unit)}</span>
                        <div className="mt-3 flex items-center justify-between">
                          <QuantitySelector size="sm" value={l.qty} onChange={(q) => updateQty(l.key, q)} />
                          <span className="font-serif text-xl">{formatPrice(l.total)}</span>
                        </div>
                        <button onClick={() => removeFromCart(l.key)} className="mt-2 text-[10px] tracking-[0.2em] text-cocoa-70 uppercase underline">Remove</button>
                      </div>
                      <div className="hidden md:block"><QuantitySelector size="sm" value={l.qty} onChange={(q) => updateQty(l.key, q)} /></div>
                      <span className="hidden text-right font-serif text-xl md:block">{formatPrice(l.total)}</span>
                      <button aria-label={`Remove ${l.product.name}`} onClick={() => removeFromCart(l.key)} className="hidden h-8 w-8 place-items-center rounded-full hover:bg-beige md:grid">
                        <X size={15} strokeWidth={1.3} />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <Link to="/shop" className="link-lux mt-8 inline-block text-[11px] tracking-[0.22em] uppercase">← Continue shopping</Link>
            </div>

            <OrderSummary subtotal={subtotal} shipping={shipping} total={total}>
              <Link to="/checkout" className="btn btn-primary mt-6 w-full">Proceed to checkout <ArrowRight size={14} strokeWidth={1.4} /></Link>
            </OrderSummary>
          </div>
        )}
      </section>
    </>
  )
}

export function OrderSummary({ subtotal, shipping, total, children, lines }) {
  const { discount, promo } = useStore()
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  return (
    <aside className="h-fit card p-7 lg:sticky lg:top-28">
      <h2 className="font-serif text-2xl">Order Summary</h2>
      <div className="hairline my-5" />
      {lines && (
        <ul className="mb-5 space-y-4">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-4">
              <div className="relative">
                <SmartImage src={productImage(l.product)} alt="" art={l.product.art} position={l.product.focus} label={false} className="h-16 w-12 rounded ring-1 ring-gold/20" />
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-cocoa text-[10px] text-ivory">{l.qty}</span>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-serif text-lg leading-tight">{l.product.name}</p>
                <p className="text-xs text-cocoa-70">{l.variant.label} · {l.packaging.name}</p>
              </div>
              <span className="font-serif">{formatPrice(l.total)}</span>
            </li>
          ))}
        </ul>
      )}
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-cocoa-70">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        {discount > 0 && <div className="flex justify-between text-gold"><dt>Code {promo}</dt><dd>−{formatPrice(discount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-cocoa-70">Shipping</dt><dd>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</dd></div>
        {remaining > 0 && <p className="text-xs text-gold">Add {formatPrice(remaining)} more for complimentary shipping.</p>}
        <div className="hairline !my-5" />
        <div className="flex items-baseline justify-between"><dt className="text-[11px] tracking-[0.22em] uppercase">Total</dt><dd className="font-serif text-3xl">{formatPrice(total)}</dd></div>
        <p className="text-xs text-cocoa-70">Inclusive of all taxes.</p>
      </dl>
      <div className="mt-5"><PromoField /></div>
      {children}
    </aside>
  )
}
