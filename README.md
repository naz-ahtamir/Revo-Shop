# RevoShop

A modern global e-commerce marketplace built with Next.js, featuring real-time product data from the Platzi API.

## Features

- **Product Catalog**: Browse thousands of products from verified sellers with category filtering
- **Real-time Data**: Products fetched from [Platzi API](https://www.escuelajs.com/api-docs/) for up-to-date inventory
- **Shopping Cart**: Persistent cart using localStorage with quantity management
- **User Authentication**: Role-based access (Admin/User) with NextAuth.js
- **Checkout System**: Complete checkout flow with shipping address management
- **Admin Dashboard**: Full CRUD operations for products, orders, users, and settings
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SSR Rendering**: Server-side rendering for SEO and real-time data

## Technology Stack

- **Framework**: Next.js 15.5.19 with App Router (SSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.8
- **Authentication**: NextAuth.js with JWT strategy
- **Icons**: Lucide React
- **Backend**: Platzi Fake Store API + Local JSON storage
- **Package Manager**: Bun

## Live Demo

Access the live application at: https://revo-shop.naz-ahtamir.site/

## Demo Credentials

### Admin Login
- Email: `admin@revoshop.co.id`
- Password: `admin123`

### Customer Login
- Email: `user@example.com`
- Password: `user123`

## Product Categories

Products are dynamically fetched from the Platzi API, including:
- **Electronics** - Gadgets, accessories, and tech products
- **Clothes** - Fashion and apparel for all ages
- **Furniture** - Home and office furniture
- **Shoes** - Various styles and brands
- **Beauty** - Personal care and cosmetics
- **Gaming** - Gaming equipment and accessories

## Project Structure

```
app/
├── admin/              # Admin dashboard pages
│   ├── orders/         # Order management
│   ├── products/       # Product CRUD
│   ├── users/          # User management
│   └── settings/       # Store settings
├── api/               # API routes
│   ├── admin/         # Admin endpoints (products, upload, settings)
│   ├── auth/          # NextAuth route
│   ├── checkout/      # Order processing
│   └── categories/    # Product categories
├── cart/              # Shopping cart page
├── checkout/          # Checkout page with shipping form
├── products/          # Product catalog and details
├── login/             # User login
├── register/          # User registration
├── order-confirmation/[id]/ # Order success page
├── faq/               # Frequently asked questions
├── promo/             # Promotional offers
├── layout.tsx         # Root layout with header/footer
└── page.tsx           # Homepage with hero and featured products

components/
├── admin/             # Admin-specific components
│   ├── AdminSidebar.tsx      # Navigation sidebar
│   ├── ProductAdminClient.tsx # Product CRUD UI
│   └── SettingsForm.tsx      # Settings management
├── Navbar.tsx         # Navigation header with cart
├── Footer.tsx         # Footer with categories
├── ProductCard.tsx    # Product display component
├── ProductDetail.tsx  # Product details page
└── ProductsListing.tsx # Product grid component

lib/
├── cart.ts            # Cart state management
├── data.ts            # Data fetching (Platzi API)
├── format.ts          # Currency and formatting utilities
└── types.ts           # TypeScript type definitions

data/                  # Local data store (for orders/users)
├── orders.json        # Order data
├── users.json         # User credentials (bcrypt hashed)
└── settings.json      # Store settings

scripts/
└── hash-passwords.ts  # Password hashing utility
```

## Available Scripts

```bash
bun dev        # Start development server (http://localhost:3000)
bun build      # Build for production
bun start      # Start production server
bun lint       # Run ESLint
bun seed:passwords  # Hash user passwords from .env.local
```

## API Integration

### Platzi Fake Store API
The application integrates with [Platzi's Fake Store API](https://www.escuelajs.com/api-docs/) for:
- Product listing and details
- Product categories
- User data

### Custom API Routes
- `/api/admin/products` - Product CRUD operations
- `/api/admin/upload-image` - Image upload endpoint
- `/api/admin/settings` - Store settings management
- `/api/checkout` - Order processing
- `/api/categories` - Category listing

## Key Features

### Shopping Experience
- **Free Shipping**: On orders over $50 (or equivalent)
- **Secure Checkout**: Protected with authentication middleware
- **Cart Persistence**: Data saved in localStorage
- **Multi-currency Support**: USD pricing from API

### Admin Panel
- **Product Management**: Create, read, update, delete products
- **Image Upload**: Custom product image uploads
- **User Management**: View all registered users
- **Settings**: Store name, tax rate, shipping options

### Authentication
- **NextAuth.js**: Secure session management
- **JWT Strategy**: Token-based authentication
- **Role-Based Access**: Admin vs Customer roles
- **Password Hashing**: bcrypt for secure storage

## Configuration

### Environment Variables (.env.local)
```env
AUTH_SECRET=your-secret-key
AUTH_URL=http://localhost:3000

# Database (for NextAuth)
NEXTAUTH_URL=http://localhost:3000
```

### External Image Configuration
The app is configured to load images from:
- `api.escuelajs.co` (Platzi API images)
- `imgur.com` (Uploaded images)

## Development

### Running Locally
1. Clone the repository
2. Install dependencies: `bun install`
3. Copy `.env.example` to `.env.local`
4. Hash passwords: `bun seed:passwords`
5. Start dev server: `bun dev`

### Deployment
The app can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting provider

## Grading Criteria

This project fulfills the following assignment requirements:

- ✅ **Data Fetching**: Uses `useEffect()` with `fetch()` API for client-side fetching
- ✅ **Authentication**: Implements NextAuth.js for login and role management
- ✅ **Middleware**: Protects `/checkout` and `/admin/*` routes
- ✅ **Cart System**: Implements localStorage for persistent cart state
- ✅ **CRUD Operations**: Full product management with API routes
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS

## Acknowledgments

- Product data provided by [Platzi Fake Store API](https://www.escuelajs.com/api-docs/)
- UI components inspired by modern e-commerce platforms
- Built as part of RevoU Milestone 3 assignment
