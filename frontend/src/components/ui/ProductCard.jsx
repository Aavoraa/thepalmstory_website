import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import SmartImage from './SmartImage'
import { useStore } from '../../context/StoreContext'
import { formatPrice, productImage } from '../../data/products'

const BADGE_STYLES = [
  'bg-espresso/85 text-ivory',
  'bg-gold text-white',
  'bg-ivory/90 text-cocoa',
]

/** Premium product card: photo, badge, wishlist, kicker, quantity chips, price and add-to-bag. */
export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const variant = product.variants.find((v) => v.id === variantId)
  const saved = isWishlisted(product.slug)
  const url = `/product/${product.slug}`
  const badgeStyle = BADGE_STYLES[product.slug.length % BADGE_STYLES.length]

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow duration-500 hover:shadow-[0_24px_50px_-28px_rgba(43,18,13,0.45)]">
      <div className="relative">
        <Link to={url} aria-label={`View ${product.name}`} className="block overflow-hidden">
          <SmartImage
            src={productImage(product)}
            alt={product.name}
            art={product.art}
            position={product.focus}
            className="aspect-[4/3] w-full"
            imgClassName="transition-transform duration-[1200ms] ease-[var(--ease-lux)] group-hover:scale-[1.05]"
          />
        </Link>
        {product.badge && <span className={`chip absolute top-3 left-3 ${badgeStyle}`}>{product.badge}</span>}
        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-cocoa shadow-sm transition-colors hover:bg-cocoa hover:text-ivory"
        >
          <motion.span key={String(saved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
            <Heart size={14} strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
          </motion.span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[9.5px] font-semibold tracking-[0.18em] text-gold uppercase">{product.kicker || product.category}</p>
        <h3 className="mt-2 font-serif text-[1.15rem] leading-snug font-medium text-espresso">
          <Link to={url} className="hover:text-cocoa">{product.name}</Link>
        </h3>
        {!compact && <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-cocoa-70">{product.short}</p>}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-beige pt-3.5">
            <span className="text-[9.5px] font-semibold tracking-[0.16em] text-cocoa-70 uppercase">
              {product.variants.length > 1 ? 'Net quantity' : 'Includes'}
            </span>
            {product.variants.length > 1 ? (
              <div className="flex gap-1" role="radiogroup" aria-label="Net quantity">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={v.id === variantId}
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-[2px] border px-2 py-1 text-[10.5px] font-medium transition-colors ${
                      v.id === variantId ? 'border-cocoa bg-cocoa text-ivory' : 'border-beige text-cocoa-70 hover:border-cocoa/50'
                    }`}
                  >
                    {v.label.replace(' ', '')}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[11px] font-semibold text-espresso">
                {variant.label}{variant.note ? ` · ${variant.note}` : ''}
              </span>
            )}
          </div>

          <div className="mt-3.5 flex items-end justify-between gap-3">
            <div>
              <p className="text-[9.5px] font-semibold tracking-[0.16em] text-cocoa-70 uppercase">Price</p>
              <p className="font-serif text-[1.45rem] leading-tight font-medium text-espresso">{formatPrice(variant.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => addToCart(product.slug, variantId, 1, { open: false })}
              className="btn btn-primary !gap-2 !px-3.5 !py-2.5 !text-[10.5px]"
            >
              <ShoppingBag size={13} strokeWidth={1.8} /> Add to bag
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
