# THE PALM STORY — Back-end

Not built yet. The website in `../frontend` works on its own today: the cart and wishlist are saved in the
browser, and checkout shows a confirmation without taking payment.

These folders are ready for the server when it is added (for example Node.js + Express):

| Folder | Purpose |
| --- | --- |
| `src/config/` | Database connection, payment gateway keys (read from `.env`) |
| `src/routes/` | API addresses, e.g. `POST /api/orders`, `GET /api/products` |
| `src/controllers/` | The logic behind each route |
| `src/models/` | Data shapes / database tables: Product, Order, Customer |
| `src/middleware/` | Login checks, input validation, error handling |
| `src/services/` | Talking to outside services: payments (Razorpay), email, delivery tracking |
| `src/utils/` | Small shared helpers |
| `tests/` | Automated tests |

## What the front-end will need

- **Orders and payment** — `frontend/src/pages/Checkout.jsx` (`submit`) is where the order is sent.
- **Products** — today they live in `frontend/src/data/products.js`; later they can come from `GET /api/products`.
- **Contact form, newsletter, accounts** — UI exists in the front-end, waiting for API addresses.

Copy `.env.example` to `.env` and fill in real values. Never commit `.env`.
