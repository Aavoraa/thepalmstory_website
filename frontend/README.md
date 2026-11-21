# THE PALM STORY — Front-end

Ivory × Chocolate Brown × Champagne Gold storefront for traditional South Indian Karupatti sweets.
React + Vite + Tailwind CSS v4 + Framer Motion + React Router + Lucide.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Where to change things

| What | File |
| --- | --- |
| Products, prices, weights, ingredients, categories | `src/data/products.js` |
| Hero banners, Karupatti story chapters, nav, socials, shipping threshold | `src/data/site.js` |
| Colour & font tokens | `src/index.css` (`@theme`) |
| Logo files | `public/images/logo/` (`mark.png`, `logo.png` and light variants — generated from `logo-full.webp` by `node scripts/prepare-logo.mjs`) |

## Current photography

The photos in `public/images/` were cropped out of the design screenshots in `../design/references/`
by `node scripts/extract-photos.mjs`. The screenshots are small, so these crops are upscaled and soft —
replace each file with the original high-resolution photo (same file name) before launch.

## Adding real photography and the brand film

Every image slot shows an illustrated, labelled **placeholder** until a real file exists.
Drop files in with the names below — no code changes needed (full map in the root `README.md`):

- `public/images/products/<product-slug>.jpg` (+ `-2.jpg`, `-3.jpg` for the gallery)
- `public/images/banners/banner-1.jpg … banner-5.jpg`
- `public/images/story/story-1.jpg … story-5.jpg`
- `public/images/categories/sweets.jpg`, `cakes.jpg`, `savories.jpg`
- `public/images/brand/gifting.jpg`, `about.jpg`, `about-2.jpg`
- `public/videos/brand-intro.mp4`

Once the banners are real, remove the "Banner N · placeholder" tag in `src/components/home/Hero.jsx`.

## Pages

Home · Shop All (`/shop`) · Sweets / Cakes / Savories (`/collections/:category`) · Product (`/product/:slug`) ·
Gifting · About · Our Story · Cart · Wishlist · Checkout · Contact · Account · Help (`/help/faqs|shipping|returns|privacy|terms`)

## Not yet connected (front-end only)

- **Payments** — checkout validates and shows a confirmation, but takes no payment. Connect Razorpay/Stripe in `src/pages/Checkout.jsx` (`submit`) once a backend and credentials exist.
- **Accounts, newsletter, contact form** — UI only; wire to a backend/email service.
- **Contact details & policy copy** are placeholders.
- Cart and wishlist persist in `localStorage`.

For production hosting, configure the server to fall back to `index.html` for client-side routes.
