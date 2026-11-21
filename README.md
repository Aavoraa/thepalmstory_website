# THE PALM STORY

Luxury e-commerce site for traditional South Indian Karupatti (palm jaggery) sweets.

The project is split into three parts:

| Folder | What it holds |
| --- | --- |
| [`frontend/`](frontend/) | The website people see — React + Vite + Tailwind + Framer Motion |
| [`backend/`](backend/) | The server (orders, payments, accounts) — folders ready, not built yet |
| [`design/`](design/) | Design screenshots the site was built from, and backups of replaced photos |

## Run the website

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173. To make a production build: `npm run build` (output in `frontend/dist/`).

## Folder structure

```
the palm story/
├── README.md                  ← this file
│
├── frontend/                  ← the website
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── README.md              ← where to change products, prices, colours, photos
│   │
│   ├── src/                   ← all website code
│   │   ├── main.jsx           ← starts the app
│   │   ├── App.jsx            ← page routes, smooth scroll, loading screen
│   │   ├── index.css          ← colours, fonts, shared styles
│   │   ├── pages/             ← one file per page (Home, Shop, Product, Cart, Checkout, OurStory, Gifting …)
│   │   ├── components/
│   │   │   ├── home/          ← homepage sections (hero, journey, collection, gifting, heritage)
│   │   │   ├── layout/        ← header, footer, cart drawer, search, page transition
│   │   │   ├── ui/            ← small reusable pieces (buttons, product card, logo, images)
│   │   │   ├── intro/         ← the opening loading screen
│   │   │   ├── chat/          ← Karu, the mascot chatbot
│   │   │   └── art/           ← drawn placeholders shown until a photo exists
│   │   ├── data/
│   │   │   ├── products.js    ← products, prices, weights, categories
│   │   │   └── site.js        ← menu, banners, story text, shipping and promo settings
│   │   ├── context/           ← cart and wishlist (saved in the browser)
│   │   ├── hooks/             ← small React helpers
│   │   └── lib/               ← smooth scroll, chatbot answers
│   │
│   ├── public/                ← files served as-is
│   │   ├── favicon.png
│   │   ├── images/            ← ALL images live here
│   │   │   ├── logo/          ← logo, mark, wordmark (dark and light versions)
│   │   │   ├── products/      ← <product-slug>.jpg (main) and <product-slug>-2.jpg (second photo)
│   │   │   ├── categories/    ← sweets, cakes, savories cards
│   │   │   ├── banners/       ← homepage slideshow banners
│   │   │   ├── journey/       ← "palm to plate" journey steps
│   │   │   ├── story/         ← story panels
│   │   │   ├── heritage/      ← heritage section, wax seal, palm sketches
│   │   │   ├── brand/         ← about, craft and gifting photos
│   │   │   ├── checkout/      ← checkout page photos
│   │   │   └── mascot/        ← Karu chatbot poses
│   │   └── videos/            ← ALL videos (brand-intro.mp4, our-story-palm.mp4)
│   │
│   └── scripts/               ← one-off image tools (cut logo, crop photos, cut mascot)
│
├── backend/                   ← server (to be built)
│   ├── README.md              ← what each folder is for
│   ├── .env.example
│   ├── src/
│   │   ├── config/            ← database and payment settings
│   │   ├── routes/            ← API addresses (/api/orders, /api/products …)
│   │   ├── controllers/       ← what each API address does
│   │   ├── models/            ← database tables (Order, Product, Customer)
│   │   ├── middleware/        ← login checks, error handling
│   │   ├── services/          ← payments, email, delivery
│   │   └── utils/             ← small helpers
│   └── tests/
│
└── design/
    ├── references/            ← design screenshots used to build each section
    └── backups/
        ├── old-product-photos/  ← product photos that were replaced
        └── crop-previews/       ← test crops made while cutting photos
```

## Adding or replacing photos

Put the file in `frontend/public/images/<folder>/` with the **same file name** as the one it replaces. No code change is needed.
For a new product photo, name it after the product's `slug` in `frontend/src/data/products.js`
(for example `karupatti-laddu.jpg`, plus `karupatti-laddu-2.jpg` for the second photo).
If a wide photo crops badly in the shop cards, set that product's `focus` (e.g. `'45% 55%'`) in `products.js`.
