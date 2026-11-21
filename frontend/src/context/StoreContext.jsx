import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getProduct, getPackaging } from '../data/products'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, PROMO_CODES } from '../data/site'

const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — keep in memory */
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('tps.cart', []))
  const [wishlist, setWishlist] = useState(() => load('tps.wishlist', []))
  const [promo, setPromo] = useState(() => load('tps.promo', null))
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  useEffect(() => save('tps.cart', cart), [cart])
  useEffect(() => save('tps.wishlist', wishlist), [wishlist])
  useEffect(() => save('tps.promo', promo), [promo])

  const notify = useCallback((message, action) => {
    clearTimeout(toastTimer.current)
    setToast({ message, action, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const addToCart = useCallback(
    (slug, variantId, qty = 1, { open = true, pack = 'basic' } = {}) => {
      const p = getProduct(slug)
      if (!p) return
      const v = p.variants.find((x) => x.id === variantId) || p.variants[0]
      setCart((c) => {
        const key = `${slug}|${v.id}|${pack}`
        const existing = c.find((i) => i.key === key)
        if (existing) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(20, i.qty + qty) } : i))
        return [...c, { key, slug, variantId: v.id, pack, qty }]
      })
      if (open) setCartOpen(true)
      else notify(`${p.name} added to your bag`, { label: 'View bag', onClick: () => setCartOpen(true) })
    },
    [notify],
  )

  const updateQty = useCallback((key, qty) => {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))))
  }, [])
  const removeFromCart = useCallback((key) => setCart((c) => c.filter((i) => i.key !== key)), [])
  const clearCart = useCallback(() => { setCart([]); setPromo(null) }, [])

  const toggleWishlist = useCallback(
    (slug) => {
      const p = getProduct(slug)
      setWishlist((w) => {
        const has = w.includes(slug)
        notify(has ? `Removed ${p?.name} from wishlist` : `Saved ${p?.name} to your wishlist`)
        return has ? w.filter((s) => s !== slug) : [...w, slug]
      })
    },
    [notify],
  )

  // enriched lines + totals
  const lines = useMemo(
    () =>
      cart
        .map((i) => {
          const product = getProduct(i.slug)
          if (!product) return null
          const variant = product.variants.find((v) => v.id === i.variantId) || product.variants[0]
          const packaging = getPackaging(i.pack)
          const unit = variant.price + packaging.price
          return { ...i, product, variant, packaging, unit, total: unit * i.qty }
        })
        .filter(Boolean),
    [cart],
  )
  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const applyPromo = useCallback((code) => {
    const c = code.trim().toUpperCase()
    if (PROMO_CODES[c]) { setPromo(c); return true }
    return false
  }, [])
  const discount = promo ? Math.round(subtotal * PROMO_CODES[promo]) : 0
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE

  const value = {
    cart: lines, count, subtotal, shipping, discount, promo, applyPromo, clearPromo: () => setPromo(null), total: subtotal - discount + shipping,
    addToCart, updateQty, removeFromCart, clearCart,
    wishlist, toggleWishlist, isWishlisted: (s) => wishlist.includes(s),
    cartOpen, setCartOpen, searchOpen, setSearchOpen,
    toast, setToast, notify,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => useContext(StoreContext)
