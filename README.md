# Addis Eats — React Frontend for a Food-Ordering App in Addis Ababa

IBT College · CodeOps Full-Stack Software Development Program
**Module 3 — React Mini-Project** (Days 26–35)

A React single-page application for a fictional food-delivery service in Addis Ababa: browse the menu, live-search and filter dishes, build a cart, check out with a validated order form, track order history — plus a guarded **admin area** with dish CRUD and order management.

---

## Quick start

```bash
npm install      
npm run dev       
```

The app runs on **http://localhost:3000**. On first load the catalog is
fetched from `public/menu-data.json` (the stand-in for a real API) and
cached in `localStorage`.

**Admin demo credentials:** `admin` / `addis123` → http://localhost:3000/admin/login

---

## Screens & routes

| Screen | Route | What it does |
|---|---|---|
| Home | `/` | Today's specials, category shortcuts, link into the menu |
| Menu | `/menu` | All dishes with live search + category filter **reflected in the URL** (`?category=pizza`) |
| Dish | `/menu/:id` | Full detail (description, ingredients) + add-to-cart + favorite |
| Cart | `/cart` | Order lines, quantity ±, remove, live ETB total |
| Checkout | `/checkout` | Validated order form, **guarded behind sign-in** |
| Sign in | `/signin` | Customer gate (name + phone) for checkout |
| Favorites | `/favorites` | Saved dishes, toggled from any heart icon |
| Orders | `/orders` | Past orders with one-click **Reorder** |
| Admin Login | `/admin/login` | Username/password gate for the admin area |
| Dashboard | `/admin` | Revenue, order count, average order value, top dishes, status chart |
| Dish Manager | `/admin/menu` | Dish CRUD — search, add, edit, delete (with confirmation) |
| Order Manager | `/admin/orders` | Every order — view details, update status, delete |

## Feature coverage

**Core (1–15):** browse menu · live search · category filter · add to cart ·
quantity ± · remove · live ETB total · cart persistence (localStorage) ·
checkout form · validation · order confirmation · loading states ·
empty states · error handling · responsive mobile-first design.

**Boosters (16–26):** order history · favorites/wishlist · dish detail view ·
reorder · delivery fee calculator · estimated delivery time · dark/light
theme toggle (persisted) · special instructions · cart badge count ·
keyboard accessibility · consistent ETB currency formatting.

**Admin extension (1–17):** admin login · sessionStorage session · dashboard
analytics · top-selling dishes · status distribution · dish CRUD + search ·
order list/status/delete/details · localStorage persistence · seed from
`menu-data.json` on first run · logout.

## State management — where state lives

Each piece of state lives in the lowest component that contains everyone
who reads or writes it:

| State | Where it lives |
|---|---|
| Selected category | **The URL** — shareable, survives refresh |
| Search query | `Menu` component (+ `useDebounce`) |
| Fetched dishes | The components that display them (`useFetch`) |
| The cart | `cart/cartStore.js` — external store + localStorage, read by Menu/Dish/Cart/Checkout |
| Sign-in session | `auth/AuthContext` + localStorage |
| Admin session | `admin/useAdminAuth.js` — Context + **sessionStorage** |
| Checkout form fields | `Checkout` component, nowhere else |
| Modal open state | The component that opens it |
| Favorite dish IDs | `favorites/favoritesStore.js` + localStorage |
| Order history | `orders/orderHistoryStore.js` + localStorage (shared with admin) |
| Theme preference | `theme/ThemeContext` + localStorage → `data-theme` attribute |
| Delivery fee / ETA | **Derived** in Cart/Checkout from the selected area (`utils/deliveryEstimate.js`) |
| Cart badge count | **Derived** from the cart store — no state of its own |

The three stores are tiny external stores built on
`useSyncExternalStore` (`utils/createStore.js`), with optional
persistence — no external state library needed.

## Folder structure (grouped by feature)

```
Addis_Eats_React/
├─ public/menu-data.json      # seed data the app fetches (the "API")
├─ src/
│  ├─ api/dishes.js           # fetch helpers for the dish resource
│  ├─ hooks/                  # useFetch, useDebounce
│  ├─ ui/                     # generic UI only — Button, Spinner, Modal, EmptyState, Toast
│  ├─ utils/                  # createStore, formatCurrency (ETB), deliveryEstimate
│  ├─ home/                   # Home (specials), NotFound
│  ├─ menu/                   # Menu, CategoryBar, DishList, DishCard, Dish, categories
│  ├─ cart/                   # cartStore, Cart, CartPanel, CartBadge
│  ├─ checkout/               # Checkout, validate.js, Field, DeliveryEstimate
│  ├─ favorites/              # favoritesStore, FavoriteButton, Favorites
│  ├─ orders/                 # orderHistoryStore, OrderHistory, OrderHistoryItem
│  ├─ theme/                  # ThemeContext, ThemeToggle
│  ├─ auth/                   # AuthProvider, useAuth, RequireAuth, SignIn
│  ├─ admin/                  # AdminLogin, useAdminAuth, RequireAdmin, AdminLayout,
│  │                          # Dashboard, DishManager, DishForm, OrderManager
│  ├─ App.jsx                 # providers + all routes
│  ├─ Layout.jsx              # customer app shell (header/nav/footer)
│  └─ main.jsx
├─ index.html
├─ vite.config.js
└─ package.json
```

`ui/` is the exception to the feature rule: genuinely generic components
(Button, Spinner, Modal…) live together there. `admin/` follows the same
rule — it is one more feature folder that reuses `ui/`, `hooks/` and
`api/` rather than duplicating them.

## Tech stack

- **React 19** + **Vite**
- **React Router 7** (`react-router-dom`) — nested, dynamic and guarded routes
- Plain CSS design system (`src/index.css`) with light/dark themes via
  `data-theme` custom properties — mobile-first, no CSS framework
- Zero runtime dependencies beyond React + Router

## Keyboard accessibility

Every interactive element (buttons, cards, steppers, forms, the theme
toggle, admin tables) is reachable and operable by keyboard: visible
`:focus-visible` rings, a skip-to-content link, Escape-to-close modals
with focus restore, and labelled controls throughout.
