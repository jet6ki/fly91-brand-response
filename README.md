# Fly91 — Brand Response Package (MERN)

A hand-built proposal for **Fly91**, India's regional airline, by **Mohammed Thameem** (Lovely Professional University, 12406194), developed during the Kalvium Simulated Work program (Jan 2026 – May 2026).

This project diagnoses Fly91's public communication failure following the **Hubballi diversion incident** on April 20, 2026 (Flight IC 3401), and packages a multi-channel brand response — website, AI media, PR strategy, pitch deck, flashcards — all built on the **MERN stack** with one governing rule: *transparency over reassurance*.

The final package was shared directly with **Mr. Manoj Chacko**, CEO of Fly91, who personally acknowledged the work.

---

## Architecture

A full **MERN** stack application:

```
┌─────────────────────────────────────────────────────────────────┐
│  React frontend (Vite)                                          │
│  • Cover letter page    • Site page    • Admin dashboard        │
│  • PR strategy doc      • Pitch deck   • Pitch flashcards       │
│  • Booking widget       • Live flight tracker (SVG + SMIL)      │
│  • Telentir support     • Testimonials section                  │
└─────────────────────────────────────────────────────────────────┘
                                ↕   fetch via /api/*
┌─────────────────────────────────────────────────────────────────┐
│  Express API (Node.js, deployed as Vercel serverless function)  │
│  • Callback request endpoints  (POST/GET/PATCH)                 │
│  • Testimonial moderation                                       │
│  • Live flight tracker data                                     │
│  • Customer recovery pipeline                                   │
│  • Route alert subscriptions                                    │
│  • Bearer-token admin auth middleware                           │
└─────────────────────────────────────────────────────────────────┘
                                ↕   Mongoose ODM
┌─────────────────────────────────────────────────────────────────┐
│  MongoDB Atlas (5 collections)                                  │
│  • callbacks       • testimonials      • flights                │
│  • recoveryCases   • routeAlerts                                │
└─────────────────────────────────────────────────────────────────┘
```

### Stack details

| Layer | Tech | Notes |
|-------|------|-------|
| **M**ongoDB | MongoDB Atlas (M0 free tier) | 5 collections with Mongoose schemas, indexes for performance |
| **E**xpress | Express 4 + Mongoose 8 | RESTful API, Bearer auth middleware, connection pooling cached across serverless invocations |
| **R**eact | React 18 + React Router 6 | Functional components only, custom `useApi` / `useMutation` hooks, no Redux/Zustand (state lives where it's used) |
| **N**ode.js | Node 18+ | Vercel serverless runtime for the API |
| **Build** | Vite 5 | Fast dev server, ES module output, no Webpack |
| **Deploy** | Vercel | Single project — frontend + serverless functions + custom domain |

### Why MERN specifically?

This stack was chosen for three reasons:

1. **MongoDB** suits the data model — callbacks, testimonials, and recovery cases are document-shaped with flexible schemas, no joins needed
2. **Express** keeps the serverless functions simple — one cached connection, RESTful conventions, easy to audit during a viva
3. **React** lets the deck and flashcards become real interactive components with state, instead of pages of static markup

---

## Project structure

```
fly91-brand-response/
├── api/                         # Express + Mongoose backend (serverless)
│   ├── index.js                 # Express entry — mounted at /api/* on Vercel
│   ├── server.js                # Local dev server (port 3001)
│   ├── lib/
│   │   └── db.js                # MongoDB connection with global caching
│   ├── middleware/
│   │   └── auth.js              # Bearer token admin auth
│   ├── models/                  # Mongoose schemas
│   │   ├── Callback.js
│   │   ├── Testimonial.js
│   │   ├── Flight.js
│   │   ├── RouteAlert.js
│   │   └── RecoveryCase.js
│   └── routes/
│       ├── callbacks.js
│       ├── testimonials.js
│       ├── flights.js
│       ├── recovery.js
│       └── routeAlerts.js
├── public/
│   └── media/                   # Static media (video, audio)
├── src/                         # React frontend
│   ├── api/
│   │   └── client.js            # Fetch wrapper with error handling
│   ├── components/
│   │   ├── layout/              # Nav, Footer
│   │   ├── booking/             # BookingWidget
│   │   ├── tracker/             # FlightTracker (polls /api/flights/live)
│   │   ├── telentir/            # TelentirWidget (POSTs to /api/callbacks)
│   │   └── testimonials/        # TestimonialsSection (GET + POST)
│   ├── hooks/
│   │   └── useApi.js            # useApi + useMutation hooks
│   ├── pages/
│   │   ├── HomePage.jsx         # Cover letter
│   │   ├── SitePage.jsx         # Redesigned Fly91 homepage
│   │   ├── AdminPage.jsx        # Admin dashboard (3 tabs + API docs)
│   │   ├── DeckPage.jsx         # 8-slide pitch deck
│   │   ├── FlashcardsPage.jsx   # 8-card swipeable summary
│   │   ├── PRPage.jsx           # PR strategy document
│   │   └── NotFound.jsx
│   ├── styles/
│   │   ├── tokens.css           # CSS custom properties (design system)
│   │   └── global.css           # Reset + utilities
│   ├── App.jsx                  # Router
│   └── main.jsx                 # Entry point
├── index.html                   # Vite entry
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

---

## API endpoints

All endpoints are mounted at `/api/*`. Admin endpoints require `Authorization: Bearer <ADMIN_TOKEN>`.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api` | – | Health check + endpoint list |
| `GET` | `/api/health` | – | DB connection status |
| `POST` | `/api/callbacks` | – | Submit Telentir callback request |
| `GET` | `/api/callbacks?status=pending` | admin | List callbacks |
| `PATCH` | `/api/callbacks/:id` | admin | Update callback status |
| `POST` | `/api/testimonials` | – | Submit testimonial for moderation |
| `GET` | `/api/testimonials` | – | List approved testimonials (public) |
| `GET` | `/api/testimonials/admin` | admin | List all testimonials |
| `PATCH` | `/api/testimonials/:id` | admin | Approve / reject testimonial |
| `GET` | `/api/flights/live` | – | Live flight tracker data |
| `POST` | `/api/flights/seed` | admin | Seed sample flight data |
| `POST` | `/api/recovery` | admin | Log unhappy customer |
| `GET` | `/api/recovery` | admin | List recovery cases |
| `GET` | `/api/recovery/stats` | admin | Pipeline counts by stage |
| `PATCH` | `/api/recovery/:id` | admin | Advance case through pipeline |
| `POST` | `/api/route-alerts` | – | Subscribe to route updates |
| `GET` | `/api/route-alerts` | admin | List subscriptions |

---

## Local development

```bash
# Install
npm install

# Start the Express API on :3001
npm run dev:api

# In another terminal, start Vite on :5173 (proxies /api → :3001)
npm run dev

# Visit http://localhost:5173
```

### Environment variables

Copy `.env.example` to `.env` and fill in:

```
MONGODB_URI=mongodb+srv://...@cluster0.xxxxx.mongodb.net/fly91
ADMIN_TOKEN=any-strong-string
```

Get a free MongoDB Atlas cluster (M0) at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas). Whitelist `0.0.0.0/0` for development.

---

## Deployment

Deployed on Vercel with **both** the React frontend and the Express API in one project:

- `vite build` produces static assets in `/dist`
- `api/index.js` deploys as a Node.js serverless function
- `vercel.json` rewrites `/api/*` to the function and serves SPA history routes

After cloning, set these environment variables in the Vercel dashboard:

- `MONGODB_URI`
- `ADMIN_TOKEN`

Every push to `main` triggers an automatic redeploy.

---

## Credits

**Mohammed Thameem** · Lovely Professional University · 12406194
Kalvium Simulated Work · Jan–May 2026
Mentor: Ajay Vishwakarma · Internal supervisor: Dr Gurpreet Singh Shahi

Voice support concept: **Telentir** (the AI voice system this project's team builds).

Not affiliated with Fly91 / Just Udo Aviation Pvt Ltd. All Fly91 brand references used respectfully and for educational purposes.

---

## License

MIT.
