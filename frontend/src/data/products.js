/**
 * THE PALM STORY — product catalogue
 * ------------------------------------------------------------
 * Edit names, prices, weights and copy here.
 * Photography: /public/images/products/<slug>.jpg (main) and
 *   (optional) focus: 'x% y%' keeps the sweet centred when a frame crops it;
 *   <slug>-2.jpg, <slug>-3.jpg (gallery). Missing files fall back
 *   to an illustrated, labelled placeholder (art).
 */

export const CATEGORIES = [
  {
    slug: 'sweets',
    name: 'Sweets',
    title: 'The Artisanal Sweets Collection',
    kicker: 'Ancestral halwa · pak · laddu',
    tagline: 'Slow-cooked in bronze urulis with unrefined palm jaggery, pure ghee and heirloom recipes.',
    image: '/images/categories/sweets.jpg',
    art: { kind: 'laddu', tone: 'beige' },
    cta: 'Discover sweets',
    subs: [
      ['halwa', 'Heritage Halwa'],
      ['pak', 'Royal Pak & Katli'],
      ['laddu', 'Artisanal Laddu'],
      ['classic', 'Village Classics'],
    ],
  },
  {
    slug: 'cakes',
    name: 'Cakes',
    title: 'Palm Jaggery Cakes',
    kicker: 'Oven-baked slow gastronomy',
    tagline: 'Plum cake, tea loaves and millet bakes with the deep caramel warmth of Karupatti.',
    image: '/images/categories/cakes.jpg',
    art: { kind: 'cake', tone: 'ivory' },
    cta: 'Explore cakes',
  },
  {
    slug: 'savories',
    name: 'Savories',
    title: 'Heritage Savories',
    kicker: 'Hand-twisted heritage crisps',
    tagline: 'Hand-twisted kai murukku, ribbon pakoda, thattai and the classic Madras mixture.',
    image: '/images/categories/savories.jpg',
    art: { kind: 'murukku', tone: 'beige' },
    cta: 'Explore savories',
  },
  {
    slug: 'gifting',
    name: 'Gifting',
    title: 'Gifting',
    kicker: 'Keepsake tins & hampers',
    tagline: 'Signature tins, keepsake boxes and hampers for every celebration.',
    image: '/images/brand/gifting.jpg',
    art: { kind: 'tin', tone: 'cocoa' },
    cta: 'Explore gifting',
  },
]

const W = {
  sweet: (p) => [
    { id: '250g', label: '250 g', note: 'Tasting tin', price: p },
    { id: '500g', label: '500 g', note: 'Family share', price: Math.round((p * 1.86) / 10) * 10 },
    { id: '1kg', label: '1 kg', note: 'Royal feast', price: Math.round((p * 3.55) / 10) * 10 },
  ],
  sweet2: (p) => [
    { id: '250g', label: '250 g', note: 'Tasting tin', price: p },
    { id: '500g', label: '500 g', note: 'Family share', price: Math.round((p * 1.86) / 10) * 10 },
  ],
  cake: (p) => [
    { id: '500g', label: '500 g', note: 'Tea loaf', price: p },
    { id: '1kg', label: '1 kg', note: 'Celebration', price: Math.round((p * 1.85) / 10) * 10 },
  ],
  savory: (p) => [
    { id: '200g', label: '200 g', note: 'Snack pack', price: p },
    { id: '400g', label: '400 g', note: 'Family pack', price: Math.round((p * 1.9) / 10) * 10 },
  ],
  single: (p, label = 'Gift box', note = '') => [{ id: 'std', label, note, price: p }],
}

/** Presentation options shown on product pages (price is added per unit). */
export const PACKAGING = [
  { id: 'basic', name: 'Basic Box', note: 'Sturdy kraft box with The Palm Story seal', price: 0, tag: 'Included' },
  { id: 'premium', name: 'Premium Box', note: 'Rigid ivory gift box with gold foil, ribbon and note card', price: 120 },
  { id: 'custom', name: 'Custom Box', note: 'Your colours, name or logo and a personal message — we confirm the design with you', price: 250 },
]
// carts saved before the rename still resolve to the matching box
const PACK_ALIASES = { tin: 'basic', box: 'premium', basket: 'custom' }

export const PRODUCTS = [
  // ─────────── SWEETS ───────────
  {
    slug: 'karupatti-mysore-pak',
    name: 'Royal Karupatti Mysore Pak',
    category: 'sweets',
    sub: 'pak',
    kicker: '100% palmyra jaggery',
    short: 'Melt-in-mouth golden fudge made with palm jaggery, roasted gram flour and ghee, finished with pistachio.',
    description:
      'The classic, reimagined with Karupatti. Gram flour is roasted until fragrant, then cooked with palm jaggery and generous ghee to a delicate, porous crumb that dissolves on the tongue. Finished with slivered pistachio.',
    ingredients: ['Bengal gram flour', 'Karupatti (palm jaggery)', 'Ghee', 'Pistachio', 'Cardamom'],
    variants: W.sweet(580),
    badge: 'Bestseller',
    featured: true,
    art: { kind: 'barfi', tone: 'beige' },
  },
  {
    slug: 'karupatti-halwa',
    focus: '50% 60%', // object-position for cropped frames
    name: 'Slow-Cooked Tirunelveli Karupatti Halwa',
    category: 'sweets',
    sub: 'halwa',
    kicker: 'Heirloom slow cook',
    short: 'Wheat milk slow-simmered with deep, smoky palm jaggery and ghee, crowned with cashews.',
    description:
      'Wheat milk is stirred for hours over a gentle flame with Karupatti and ghee until it turns glossy, deep and almost translucent — a Tirunelveli-style halwa with the warmth of palm jaggery.',
    ingredients: ['Wheat', 'Karupatti (palm jaggery)', 'Ghee', 'Cashew', 'Cardamom'],
    variants: W.sweet(640),
    badge: 'Bestseller',
    featured: true,
    art: { kind: 'halwa', tone: 'beige' },
  },
  {
    slug: 'athi-palam-karupatti-halwa',
    focus: '50% 55%', // object-position for cropped frames
    name: 'Athi Palam Karupatti Halwa',
    category: 'sweets',
    sub: 'halwa',
    kicker: 'Wild fig infusion',
    short: 'Dried figs simmered in palm jaggery and ghee, crowned with toasted cashew and almond.',
    description:
      'Dried figs (athi palam) are soaked, ground and slow-cooked with Karupatti and ghee into a jammy, luscious halwa studded with fig seeds and topped with toasted nuts.',
    ingredients: ['Dried figs', 'Karupatti (palm jaggery)', 'Ghee', 'Cashew', 'Almond', 'Cardamom'],
    variants: W.sweet2(690),
    badge: 'Limited harvest',
    featured: true,
    art: { kind: 'halwa', tone: 'ivory', palette: 'fig' },
  },
  {
    slug: 'nattu-sarkarai-laddu',
    focus: '48% 55%', // object-position for cropped frames
    name: 'Nattu Chakara Bites',
    category: 'sweets',
    sub: 'laddu',
    kicker: 'Native country jaggery',
    short: 'Crunchy roasted groundnuts bound with unrefined nattu chakara and a touch of ghee.',
    description:
      'Freshly roasted groundnuts are folded into bubbling nattu chakara (country jaggery) and pressed by hand into crunchy, nutty rounds — the village snack every grandmother kept in a tin.',
    ingredients: ['Groundnuts', 'Nattu chakara (country jaggery)', 'Ghee', 'Cardamom', 'Dry ginger'],
    variants: W.sweet2(490),
    featured: true,
    art: { kind: 'laddu', tone: 'ivory', palette: 'sand' },
  },
  {
    slug: 'karupatti-laddu',
    focus: '45% 55%', // object-position for cropped frames
    name: 'Karupatti Laddu',
    category: 'sweets',
    sub: 'laddu',
    kicker: 'Ghee roasted',
    short: 'Roasted gram flour, ghee and Karupatti, rolled by hand with cashew and cardamom.',
    description:
      'Our signature laddu. Gram flour is slow-roasted in ghee until nutty and golden, then bound with melted Karupatti for a deep caramel sweetness. Finished with cardamom and cashew.',
    ingredients: ['Bengal gram flour', 'Karupatti (palm jaggery)', 'Ghee', 'Cashew', 'Cardamom'],
    variants: W.sweet(520),
    badge: 'Signature',
    featured: true,
    art: { kind: 'laddu', tone: 'ivory', palette: 'amber' },
  },
  {
    slug: 'banana-appichakara-halwa',
    focus: '48% 55%', // object-position for cropped frames
    name: 'Banana Appichakara Laddu',
    category: 'sweets',
    sub: 'laddu',
    kicker: 'Travancore speciality',
    short: 'Ripe bananas cooked down with palm jaggery and ghee, rolled by hand in fresh coconut.',
    description:
      'An old village favourite: ripe nendran bananas are cooked down with Karupatti and ghee until dark and fudgy, then rolled by hand and finished in a snowy coat of fresh coconut.',
    ingredients: ['Banana', 'Karupatti (palm jaggery)', 'Ghee', 'Coconut', 'Cardamom'],
    variants: W.sweet2(560),
    badge: 'Heirloom recipe',
    art: { kind: 'laddu', tone: 'beige' },
  },
  {
    slug: 'karupatti-then-kuzhal',
    name: 'Karupatti Then Kuzhal',
    category: 'sweets',
    sub: 'classic',
    kicker: 'Hand-piped spirals',
    short: 'Crisp rice-flour spirals glazed in warm palm jaggery syrup, with a whisper of cardamom.',
    description:
      'Rice and urad flour are piped by hand into delicate spirals, fried until golden, then dipped in a glossy Karupatti syrup that sets into a crackling caramel shell. Crunchy, honeyed and impossible to stop at one.',
    ingredients: ['Rice flour', 'Urad dal flour', 'Karupatti (palm jaggery)', 'Sesame', 'Cardamom', 'Groundnut oil'],
    variants: W.sweet2(380),
    badge: 'New',
    featured: true,
    art: { kind: 'murukku', tone: 'beige' },
  },
  {
    slug: 'palm-jaggery-peda',
    name: 'Chettinad Palm Jaggery Peda',
    category: 'sweets',
    sub: 'classic',
    kicker: 'Pure milk khoa',
    short: 'Milk khoa slow-reduced and blended with palm jaggery, hand-stamped.',
    description:
      'Milk is reduced slowly over a low flame into khoa, then blended with Karupatti and pressed into hand-stamped pedas with a soft, fudgy bite.',
    ingredients: ['Milk khoa', 'Karupatti (palm jaggery)', 'Ghee', 'Cardamom'],
    variants: W.sweet2(520),
    badge: 'Chettinad reserve',
    art: { kind: 'adhirasam', tone: 'ivory' },
  },
  {
    slug: 'palm-badam-katli',
    name: 'Karkandu & Palm Badam Katli',
    category: 'sweets',
    sub: 'pak',
    kicker: 'Almond & palm candy',
    short: 'Fine-ground almonds with palm rock candy (panam karkandu), finished with gold leaf.',
    description:
      'Almonds are soaked, peeled and stone-ground, then cooked with panam karkandu (palm rock candy) into a smooth katli, cut into diamonds and finished with edible gold.',
    ingredients: ['Almonds', 'Panam karkandu (palm candy)', 'Ghee', 'Edible gold leaf'],
    variants: W.sweet2(780),
    badge: 'Signature reserve',
    art: { kind: 'barfi', tone: 'ivory' },
  },
  {
    slug: 'karupatti-adhirasam',
    name: 'Karupatti Adhirasam',
    category: 'sweets',
    sub: 'classic',
    kicker: 'Festive classic',
    short: 'Rice and palm jaggery discs, fried in ghee until crisp-edged and chewy.',
    description:
      'A Deepavali essential. Rice flour dough rested with Karupatti syrup, pressed into discs and fried until crisp-edged and chewy within.',
    ingredients: ['Raw rice', 'Karupatti (palm jaggery)', 'Sesame', 'Ghee', 'Cardamom'],
    variants: W.sweet(300),
    art: { kind: 'adhirasam', tone: 'ivory' },
  },
  {
    slug: 'ellu-karupatti-urundai',
    name: 'Ellu Karupatti Urundai',
    category: 'sweets',
    sub: 'laddu',
    kicker: 'Toasted sesame',
    short: 'Toasted sesame balls bound with bubbling palm jaggery syrup.',
    description:
      'Black and white sesame, roasted until fragrant and bound with Karupatti syrup — a crunchy, toasty sweet from grandmother’s tin.',
    ingredients: ['Sesame seeds', 'Karupatti (palm jaggery)', 'Cardamom'],
    variants: W.sweet(260),
    art: { kind: 'laddu', tone: 'beige', palette: 'sesame' },
  },

  // ─────────── CAKES ───────────
  {
    slug: 'karupatti-plum-cake',
    name: 'Karupatti Plum Cake',
    category: 'cakes',
    kicker: 'Seasonal bake',
    short: 'Festive fruit cake with spiced palm jaggery caramel.',
    description:
      'Dried fruits steeped in spiced Karupatti syrup, folded into a buttery batter and baked low and slow. Dense, moist and fragrant with nutmeg and clove.',
    ingredients: ['Wheat flour', 'Karupatti (palm jaggery)', 'Butter', 'Eggs', 'Dried fruits', 'Spices'],
    variants: W.cake(650),
    badge: 'Seasonal',
    featured: true,
    art: { kind: 'cake', tone: 'beige', palette: 'plum' },
  },
  {
    slug: 'banana-walnut-karupatti-cake',
    name: 'Banana Walnut Tea Loaf',
    category: 'cakes',
    kicker: 'Everyday bake',
    short: 'Soft banana loaf with walnuts and Karupatti.',
    description: 'Overripe bananas, toasted walnuts and palm jaggery in a tender tea loaf that pairs perfectly with filter coffee.',
    ingredients: ['Wheat flour', 'Banana', 'Karupatti (palm jaggery)', 'Walnuts', 'Butter', 'Eggs'],
    variants: W.cake(520),
    art: { kind: 'cake', tone: 'ivory', palette: 'banana' },
  },
  {
    slug: 'date-karupatti-tea-cake',
    name: 'Date & Karupatti Tea Cake',
    category: 'cakes',
    kicker: 'Caramel crumb',
    short: 'Sticky dates and palm jaggery, baked into a tender crumb.',
    description: 'Dates simmered with Karupatti create a naturally caramel-rich tea cake with a soft, sticky crumb.',
    ingredients: ['Wheat flour', 'Dates', 'Karupatti (palm jaggery)', 'Butter', 'Eggs'],
    variants: W.cake(560),
    art: { kind: 'cake', tone: 'beige', palette: 'date' },
  },
  {
    slug: 'ragi-karupatti-brownie',
    name: 'Ragi Karupatti Brownie',
    category: 'cakes',
    kicker: 'Millet bake',
    short: 'Fudgy dark chocolate brownies made with ragi flour. Box of six.',
    description: 'Finger millet and dark chocolate meet palm jaggery in a dense, fudgy brownie with a crackled top.',
    ingredients: ['Ragi flour', 'Dark chocolate', 'Karupatti (palm jaggery)', 'Butter', 'Eggs'],
    variants: W.single(480, 'Box of 6'),
    art: { kind: 'brownie', tone: 'ivory' },
  },

  // ─────────── SAVORIES ───────────
  {
    slug: 'kai-murukku',
    name: 'Kai Murukku & Pepper Cashews',
    category: 'savories',
    kicker: 'Hand-twisted',
    short: 'Hand-twisted rice murukku with pepper-tossed cashews.',
    description:
      'Twisted entirely by hand in concentric spirals — an art practised by only a few artisans today. Light, crisp and gently spiced, paired with pepper-roasted cashews.',
    ingredients: ['Rice flour', 'Urad dal flour', 'Sesame', 'Cumin', 'Cashew', 'Black pepper', 'Groundnut oil'],
    variants: W.savory(260),
    badge: 'Handmade',
    featured: true,
    art: { kind: 'murukku', tone: 'ivory' },
  },
  {
    slug: 'ribbon-pakoda',
    name: 'Ribbon Pakoda',
    category: 'savories',
    kicker: 'Tea-time crisp',
    short: 'Crisp ribbons of gram and rice flour with chilli.',
    description: 'Pressed into flat ribbons and fried until golden, with a gentle warmth from chilli and asafoetida.',
    ingredients: ['Gram flour', 'Rice flour', 'Chilli', 'Asafoetida', 'Groundnut oil'],
    variants: W.savory(200),
    art: { kind: 'ribbon', tone: 'beige' },
  },
  {
    slug: 'thattai',
    name: 'Thattai',
    category: 'savories',
    kicker: 'Hand-flattened',
    short: 'Thin, crisp rice crackers with curry leaf and chana.',
    description: 'Hand-flattened rice crackers studded with chana dal, curry leaves and peanuts — the perfect tea-time crunch.',
    ingredients: ['Rice flour', 'Chana dal', 'Curry leaves', 'Peanuts', 'Chilli', 'Groundnut oil'],
    variants: W.savory(200),
    art: { kind: 'thattai', tone: 'ivory' },
  },
  {
    slug: 'madras-mixture',
    name: 'Madras Mixture',
    category: 'savories',
    kicker: 'House blend',
    short: 'A classic medley of sev, boondi, nuts and curry leaf.',
    description: 'Our house mixture of crisp sev, boondi, roasted peanuts, fried gram and curry leaves, lightly spiced the Madras way.',
    ingredients: ['Gram flour', 'Peanuts', 'Fried gram', 'Curry leaves', 'Spices', 'Groundnut oil'],
    variants: W.savory(190),
    art: { kind: 'mixture', tone: 'beige' },
  },

  // ─────────── GIFTING ───────────
  {
    slug: 'signature-hamper',
    name: 'The Sovereign Heritage Hamper',
    category: 'gifting',
    kicker: 'Confectioner reserve',
    short: 'Gilded gift caddy with our royal quartet: Mysore Pak, Tirunelveli Halwa, Nattu Sarkarai Laddu and Athi Palam Halwa.',
    description:
      'Our most celebrated gift: an ivory-and-gold caddy holding four signature sweets, sealed with a wax stamp and gold ribbon. Presented with a handwritten note card.',
    ingredients: ['Royal Karupatti Mysore Pak', 'Tirunelveli Karupatti Halwa', 'Nattu Sarkarai Laddu', 'Athi Palam Halwa'],
    variants: W.single(1850, '750 g', '4 varieties'),
    badge: 'Festive packaging',
    featured: true,
    gift: true,
    art: { kind: 'box', tone: 'beige' },
  },
  {
    slug: 'heritage-sweet-tin',
    name: 'The Heritage Sweet Tin',
    category: 'gifting',
    kicker: 'Keepsake tin',
    short: 'Our gold compartment tin with three sweets and a savory.',
    description:
      'The Palm Story compartment tin in champagne gold, filled with Mysore Pak, Karupatti Halwa and a savory medley — made to be kept long after the sweets are gone.',
    ingredients: ['Assorted Karupatti sweets', 'Heritage savory'],
    variants: W.single(1450, 'Tin · 750 g'),
    badge: 'Royal hamper',
    featured: true,
    gift: true,
    art: { kind: 'tin', tone: 'beige' },
  },
  {
    slug: 'festive-celebration-box',
    name: 'Royal Reserve Celebration Box',
    category: 'gifting',
    kicker: 'Wax-sealed box',
    short: 'Twelve hand-picked sweets in a wax-sealed ivory keepsake box.',
    description:
      'A keepsake ivory box with gold foil detailing and a wax seal, holding twelve hand-picked Karupatti sweets in individual compartments.',
    ingredients: ['Twelve assorted Karupatti sweets'],
    variants: W.single(1890, 'Box of 12'),
    gift: true,
    art: { kind: 'box', tone: 'ivory' },
  },
  {
    slug: 'petite-gift-tin',
    name: 'The Petite Tin',
    category: 'gifting',
    kicker: 'Return gift',
    short: 'A petite round tin of Karupatti laddus — a sweet thank-you.',
    description: 'A petite round tin holding eight Karupatti laddus. Ideal for return gifts, thank-yous and corporate tokens.',
    ingredients: ['Karupatti laddus'],
    variants: W.single(690, 'Tin · 300 g'),
    gift: true,
    art: { kind: 'tin', tone: 'ivory', palette: 'petite' },
  },
]

/** Sensory notes shown on product pages, by category. */
export const SENSORY = {
  sweets: [
    ['Aroma & Bouquet', 'Deep roasted palm caramel, warm ghee and a whisper of cardamom.', ['Toasted molasses', 'Warm ghee']],
    ['Texture', 'Slow cooking gives each sweet its signature crumb — porous, fudgy or glossy.', ['Hand finished', 'Melt-in-mouth']],
    ['Taste & Finish', 'Rounded, earthy sweetness that is never sharp, with a lingering caramel finish.', ['Earthy caramel', 'Balanced']],
  ],
  cakes: [
    ['Aroma', 'Warm spice, toasted butter and palm jaggery caramel straight from the oven.', ['Baking spice', 'Caramel']],
    ['Crumb', 'Dense and moist, with fruit and nuts in every slice.', ['Moist', 'Tender']],
    ['Finish', 'A gentle, molasses-like sweetness that pairs with filter coffee.', ['Tea-time', 'Rich']],
  ],
  savories: [
    ['Aroma', 'Fresh curry leaf, cumin and the nuttiness of cold-pressed oil.', ['Curry leaf', 'Cumin']],
    ['Crunch', 'Light, shattering crispness from hand-pressing and careful frying.', ['Crisp', 'Light']],
    ['Spice', 'Gentle warmth from chilli and pepper, never overpowering.', ['Mild heat', 'Savory']],
  ],
  gifting: [
    ['Presentation', 'Ivory, chocolate and gold packaging finished by hand.', ['Keepsake', 'Gold foil']],
    ['Assortment', 'A curated mix of our most-loved creations.', ['Signature', 'Curated']],
    ['The Note', 'Add a message at checkout — we write it by hand.', ['Personal', 'Handwritten']],
  ],
}

// ─────────── helpers ───────────
export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug)
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug)
export const productsIn = (category) => PRODUCTS.filter((p) => p.category === category)
export const featuredProducts = () => PRODUCTS.filter((p) => p.featured)
export const productImage = (p, n = 1) => `/images/products/${p.slug}${n > 1 ? `-${n}` : ''}.jpg`
export const fromPrice = (p) => Math.min(...p.variants.map((v) => v.price))
export const getPackaging = (id) => PACKAGING.find((x) => x.id === (PACK_ALIASES[id] || id)) || PACKAGING[0]

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export function searchProducts(q) {
  const s = q.trim().toLowerCase()
  if (!s) return []
  return PRODUCTS.filter((p) =>
    [p.name, p.short, p.category, p.kicker, ...(p.ingredients || [])].join(' ').toLowerCase().includes(s),
  )
}
