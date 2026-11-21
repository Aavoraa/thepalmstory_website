/**
 * Site-wide content: hero slides, story chapters, navigation, footer.
 * Image paths point to /public/images — replace files to update photos.
 */

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop', mega: true },
  { label: 'Sweets', to: '/collections/sweets' },
  { label: 'Cakes', to: '/collections/cakes' },
  { label: 'Savories', to: '/collections/savories' },
  { label: 'Gifting', to: '/gifting' },
  { label: 'Our Story', to: '/our-story' },
]

export const ANNOUNCEMENT = 'Complimentary heritage tin packaging & express delivery on orders over ₹1,499 · 100% pure Karupatti'

/**
 * Home hero banners (text is part of the artwork). Each slide links to its CTA.
 * Files: public/images/banners/hero-<name>.webp (+ -sm.webp for phones).
 */
export const HERO_BANNERS = [
  {
    id: "best-sellers",
    image: "/images/banners/hero-best-sellers.webp",
    imageSm: "/images/banners/hero-best-sellers-sm.webp",
    alt: "The Palm Story — Our best selling sweets. Traditional, natural, wholesome.",
    to: "/shop?sort=featured",
    label: "Shop best sellers",
  },
  {
    id: "bulk-orders",
    image: "/images/banners/hero-bulk-orders.webp",
    imageSm: "/images/banners/hero-bulk-orders-sm.webp",
    alt: "Bulk orders for every occasion — corporate gifting, festive orders, events and institutional orders.",
    to: "/contact",
    label: "Place your bulk order",
  },
  {
    id: "gifting",
    image: "/images/banners/hero-gifting.webp",
    imageSm: "/images/banners/hero-gifting-sm.webp",
    alt: "Gifting collection — traditional sweets, thoughtful gifts for corporate, festive and special occasions.",
    to: "/gifting",
    label: "Explore the gifting collection",
  },
]

export const STORY = [
  {
    n: "01",
    notes: ["Palmyra palm","Fresh, unfermented sap","Gathered at dawn"],
    title: "The Palm",
    kicker: "Rooted in the red earth",
    text: "At dawn, skilled climbers step up the tall palmyra for its fresh, unfermented sap — a harvest that leads to natural sweetness.",
    tag: "The source",
    icon: "palm",
    image: "/images/journey/step-1.jpg",
    art: { kind: "palm", tone: "ivory" },
  },
  {
    n: "02",
    notes: ["Wood-fire simmer","Stirred by hand","Set in moulds"],
    title: "The Karupatti",
    kicker: "Sap, fire and patience",
    text: "The sap is simmered over wood fire until it thickens, then set in moulds as Karupatti — the pure, unrefined palm jaggery.",
    tag: "The essence",
    icon: "diya",
    image: "/images/journey/step-2.jpg",
    art: { kind: "jaggery", tone: "beige" },
  },
  {
    n: "03",
    notes: ["Family recipes","Measured by hand","Festival favourites"],
    title: "The Tradition",
    kicker: "Recipes passed down",
    text: "Our recipes come from family kitchens across Tamil Nadu — measured, mindful and perfected over generations of festivals.",
    tag: "The recipe",
    icon: "mortar",
    image: "/images/journey/step-3.jpg",
    art: { kind: "pot", tone: "ivory" },
  },
  {
    n: "04",
    notes: ["Bronze uruli","Pure ghee","Small batches"],
    title: "The Art of Making",
    kicker: "By hand, in small batches",
    text: "Grandmas’ time-tested methods, a touch of patience and the right ingredients come together to create unforgettable sweets.",
    tag: "The craft",
    icon: "chef",
    image: "/images/journey/step-4.jpg",
    art: { kind: "halwa", tone: "beige" },
  },
  {
    n: "05",
    notes: ["Packed by hand","Keepsake packaging","Ready to gift"],
    title: "The Sweet Story",
    kicker: "From our hands to yours",
    text: "Finished sweets are packed with care, carrying the richness of our heritage to your celebrations, homes and special moments.",
    tag: "To your plate",
    icon: "gift",
    image: "/images/journey/step-5.jpg",
    art: { kind: "tin", tone: "cocoa" },
  },
]

export const CRAFT = [
  { time: '01 · 05:00 AM', title: 'The Morning Nectar Tap', text: 'Fresh palm sap is drawn before dawn in earthen pots, then carried to the fire before the day warms.', image: '/images/brand/craft-1.jpg', art: { kind: 'palm', tone: 'cocoa' } },
  { time: '02 · 08:30 AM', title: 'The Bronze Uruli Simmer', text: 'Steady stirring in heavy bell-metal urulis over wood embers, reducing the syrup to a single-thread consistency.', image: '/images/brand/craft-2.jpg', art: { kind: 'pot', tone: 'beige' } },
  { time: '03 · 11:15 AM', title: 'The Master’s Ghee Pour', text: 'At just the right moment, hot ghee is folded in — the step that gives each sweet its crumb and gloss.', image: '/images/brand/craft-3.jpg', art: { kind: 'halwa', tone: 'ivory' } },
]

export const BRAND_VIDEO = { src: '/videos/brand-intro.mp4' }

export const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/_thepalmstory_/', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/p/1JP1SMAgb1/', icon: 'facebook' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCZqdT2-5F8XUar4ZpJTU3AA', icon: 'youtube' },
]

export const FREE_SHIPPING_THRESHOLD = 1499
export const SHIPPING_FEE = 80
/** Demo promo codes — replace with server-side validation when a backend exists. */
export const PROMO_CODES = { PALM10: 0.1 }
