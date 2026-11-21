/**
 * Karu — The Palm Story's helper. A small rule-based assistant that answers
 * from the site's own data (products, categories, shipping, gifting).
 * No external AI service: replies are instant and work offline.
 * To connect a real AI/backend later, replace `reply()` with an API call
 * that returns the same shape: { text, mood, products?, chips?, links? }.
 */
import { PRODUCTS, CATEGORIES, fromPrice, formatPrice } from '../data/products'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../data/site'

export const MOODS = ['happy', 'surprised', 'wink', 'thinking', 'excited', 'laughing']

const has = (s, ...words) => words.some((w) => s.includes(w))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const MAIN_CHIPS = ['Best sellers', 'Gift ideas', 'What is Karupatti?', 'Shipping', 'Bulk orders']

function findProducts(s) {
  const words = s.split(/[^a-z]+/).filter((w) => w.length > 2)
  const scored = PRODUCTS.map((p) => {
    // whole-word matching ('pak' must not match 'pakoda'); longer words may match a prefix ('laddus'→'laddu')
    const split = (t) => t.toLowerCase().split(/[^a-z]+/).filter(Boolean)
    const nameWords = split(p.name)
    const otherWords = split([p.kicker, p.short, p.category, p.sub, ...p.ingredients].join(' '))
    const hit = (list, w) => list.some((h) => h === w || (w.length >= 5 && (h.startsWith(w) || w.startsWith(h)) && h.length >= 4))
    const score = words.reduce((n, w) => n + (hit(nameWords, w) ? 3 : hit(otherWords, w) ? 1 : 0), 0)
    return [p, score]
  })
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
  return scored.slice(0, 4).map(([p]) => p)
}

export function greeting() {
  return {
    text: 'Vanakkam! I’m Karu, a little cube of Karupatti. I can help you find sweets, plan a gift or answer questions about orders. What are you in the mood for?',
    mood: 'wink',
    chips: MAIN_CHIPS,
  }
}

export function reply(input) {
  const s = ` ${input.toLowerCase().trim()} `

  if (has(s, ' hi ', ' hello', ' hey', 'vanakkam', 'namaste', 'good morning', 'good evening'))
    return { text: pick(['Vanakkam! How can I sweeten your day?', 'Hello there! Looking for something sweet, savoury or giftable?']), mood: 'wink', chips: MAIN_CHIPS }

  if (has(s, 'thank', 'thanks', 'great', 'awesome', 'love it', 'perfect'))
    return { text: pick(['You’re very welcome! Anything else I can help with?', 'Happy to help — enjoy every bite!']), mood: 'laughing', chips: ['Best sellers', 'Gift ideas'] }

  if (has(s, ' bye', 'goodbye', 'see you'))
    return { text: 'Bye for now! I’ll be right here in the corner if you need me.', mood: 'happy' }

  if (has(s, 'joke', 'funny'))
    return { text: 'Why did the laddu go to school? To become a little more well-rounded!', mood: 'laughing', chips: ['Another one!', 'Best sellers'] }
  if (has(s, 'another one'))
    return { text: 'What do you call a halwa that tells stories? A sweet talker.', mood: 'laughing', chips: ['Best sellers'] }

  if (has(s, 'shop karupatti'))
    return { text: 'Every sweet here is made with Karupatti:', mood: 'excited', products: PRODUCTS.filter((p) => p.category === 'sweets').slice(0, 4) }

  if (has(s, 'karupatti', 'palm jaggery', 'what is', 'palmyra', 'jaggery'))
    return {
      text: 'Karupatti is palm jaggery — the fresh sap of the palmyra palm, simmered slowly over a wood fire until it sets. It’s unrefined, so it keeps its dark colour and deep caramel taste. Every sweet we make starts with it.',
      mood: 'thinking',
      chips: ['Shop Karupatti sweets', 'Our story'],
      links: [{ label: 'Read our story', to: '/our-story' }],
    }

  if (has(s, 'our story', 'about you', 'who are you', 'brand'))
    return { text: 'The Palm Story celebrates South Indian sweet-making with palm jaggery, pure ghee and family recipes, made by hand in small batches.', mood: 'happy', links: [{ label: 'Our story', to: '/our-story' }, { label: 'About us', to: '/about' }] }

  if (has(s, 'ship', 'deliver', 'delivery', 'courier', 'how long', 'dispatch'))
    return {
      text: `We pack fresh and dispatch within 48 hours. Delivery takes 2–3 working days in Tamil Nadu and 3–6 days elsewhere in India. Shipping is free above ${formatPrice(FREE_SHIPPING_THRESHOLD)}; otherwise it’s ${formatPrice(SHIPPING_FEE)}. You can check your PIN code on any product page.`,
      mood: 'happy',
      chips: ['Best sellers', 'Payment options'],
    }

  if (has(s, 'track', 'my order', 'order status', 'where is'))
    return { text: 'Once your order ships, we email you the tracking details. If you need help with an order, our team will sort it out quickly.', mood: 'thinking', links: [{ label: 'Contact us', to: '/contact' }] }

  if (has(s, 'pay', 'upi', 'card', 'cod', 'cash on'))
    return { text: 'You can pay by UPI, credit/debit card, or cash on delivery for orders under ₹3,000.', mood: 'happy', links: [{ label: 'Go to checkout', to: '/checkout' }] }

  if (has(s, 'discount', 'coupon', 'promo', 'offer', 'code'))
    return { text: 'Here’s a little treat: use code PALM10 in your bag for 10% off.', mood: 'excited', links: [{ label: 'Open the shop', to: '/shop' }] }

  if (has(s, 'bulk', 'corporate', 'wedding', 'return gift', 'event', 'institution', 'large order'))
    return {
      text: 'We love big celebrations! For corporate gifting, weddings, festivals and events, our team can put together custom tins, notes and bulk pricing.',
      mood: 'excited',
      links: [{ label: 'Bulk order enquiry', to: '/contact' }, { label: 'See gift sets', to: '/gifting' }],
    }

  if (has(s, 'gift', 'hamper', 'tin', 'box', 'present', 'diwali', 'deepavali', 'pongal', 'festival'))
    return { text: 'These keepsake gifts are our favourites — each one is packed by hand, and we can add a handwritten note.', mood: 'excited', products: PRODUCTS.filter((p) => p.gift).slice(0, 4), links: [{ label: 'All gifting', to: '/gifting' }] }

  if (has(s, 'store', 'storage', 'shelf', 'fresh', 'how long last', 'expiry'))
    return { text: 'Sweets are best within 15 days, savories within 30 days and cakes within 7 days. Keep them airtight, in a cool, dry place — cakes in the fridge once opened.', mood: 'thinking' }

  if (has(s, 'allerg', 'nut', 'gluten', 'vegan', 'egg', 'dairy'))
    return { text: 'Each product page lists every ingredient. Our kitchen handles nuts, dairy, gluten and sesame, and our cakes contain eggs. If you have an allergy, please check the ingredients or ask our team.', mood: 'thinking', links: [{ label: 'Contact us', to: '/contact' }] }

  if (has(s, 'contact', 'human', 'call', 'phone', 'email', 'talk to', 'support'))
    return { text: 'Our team is happy to help, Monday to Saturday, 10am–7pm.', mood: 'happy', links: [{ label: 'Contact page', to: '/contact' }] }

  if (has(s, 'best', 'popular', 'recommend', 'suggest', 'favourite', 'favorite', 'bestseller', 'what should'))
    return { text: 'Here are the ones everyone keeps coming back for:', mood: 'excited', products: PRODUCTS.filter((p) => ['Bestseller', 'Signature'].includes(p.badge)).slice(0, 4), chips: ['Gift ideas', 'Shipping'] }

  if (has(s, 'price', 'cost', 'how much', 'cheap', 'budget')) {
    const found = findProducts(s)
    if (found.length) return { text: 'Here are the prices:', mood: 'happy', products: found }
    const min = Math.min(...PRODUCTS.map(fromPrice))
    return { text: `Our sweets start from ${formatPrice(min)}, and gift tins from ${formatPrice(Math.min(...PRODUCTS.filter((p) => p.gift).map(fromPrice)))}. Tell me what you fancy and I’ll show you!`, mood: 'thinking', chips: ['Sweets', 'Savories', 'Gift ideas'] }
  }

  const cat = CATEGORIES.find((c) => has(s, c.slug, c.name.toLowerCase(), c.slug.replace(/s$/, '')))
  if (cat && cat.slug !== 'gifting')
    return {
      text: `Here are some of our ${cat.name.toLowerCase()}:`,
      mood: 'excited',
      products: PRODUCTS.filter((p) => p.category === cat.slug).slice(0, 4),
      links: [{ label: `All ${cat.name.toLowerCase()}`, to: `/collections/${cat.slug}` }],
    }

  const found = findProducts(s)
  if (found.length) return { text: found.length === 1 ? 'Found it! Here you go:' : 'These might be what you’re looking for:', mood: 'excited', products: found }

  if (has(s, 'menu', 'products', 'sell', 'what do you have', 'shop', 'catalog'))
    return { text: 'We make traditional sweets, palm jaggery cakes, heritage savories and keepsake gifts. Which would you like to explore?', mood: 'happy', chips: ['Sweets', 'Cakes', 'Savories', 'Gift ideas'] }

  return {
    text: 'Hmm, I didn’t quite catch that — I’m still a small cube! Try asking about our sweets, gifts, shipping or Karupatti.',
    mood: 'surprised',
    chips: MAIN_CHIPS,
  }
}
