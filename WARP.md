# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install
# or
pnpm install

# Development server
npm run dev

# Build for production
npm run build

# Production server (after build)
npm run start

# Lint code
npm run lint
```

### Database Setup
Execute SQL scripts in Supabase SQL Editor in this order:
1. `scripts/001_create_profiles.sql` - User profiles table
2. `scripts/002_create_categories.sql` - Book categories
3. `scripts/003_create_books.sql` - Book listings table  
4. `scripts/004_create_bids.sql` - Bidding system
5. `scripts/005_create_messages.sql` - Chat functionality
6. `scripts/006_create_orders.sql` - Order management
7. `scripts/007_create_reviews.sql` - Review system
8. `scripts/008_create_functions.sql` - Database functions and triggers

### Testing Commands
```bash
# Run a single test (if test suite exists)
npm test -- --testNamePattern="specific test"

# Run all tests 
npm test

# Watch mode for tests
npm run test:watch
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe with escrow-style transactions
- **Deployment**: Vercel

### Core Architecture Patterns

#### Real-time System Architecture
- Uses Supabase Realtime subscriptions for live bidding updates
- Custom hook `useRealtimeBids` manages WebSocket connections and state
- Database triggers automatically update bid counts and current prices
- Real-time notifications push updates to bidders instantly

#### Authentication & Security
- Row Level Security (RLS) policies control data access at database level
- Middleware enforces authentication on protected routes (`/dashboard`, `/profile`, `/sell`, `/checkout`)
- BITS Dubai email domain restriction for user registration
- Rate limiting implemented in middleware (50 requests per 15 minutes for API routes)
- Security headers and CSP configured in `middleware.ts` and `next.config.mjs`

#### Database Schema Design
- **Profiles**: Extended user data linked to Supabase auth.users
- **Books**: Auction/buy-now listings with status tracking
- **Bids**: Real-time bidding with auto-bid capability
- **Messages**: Direct messaging between buyers/sellers
- **Orders**: Transaction tracking with payment status
- **Reviews**: User rating system with automatic aggregation

#### Payment Processing Flow
1. `create-payment-intent` API route creates Stripe PaymentIntent
2. Metadata includes escrow transaction details
3. Webhook handling for payment confirmation (endpoint configured in Stripe)
4. AED currency for UAE-based transactions

### Key Components

#### Real-time Components
- `components/bidding-interface.tsx` - Live auction bidding with countdown timers
- `components/real-time-chat.tsx` - Direct messaging between users
- `hooks/use-realtime-bids.ts` - WebSocket subscription management
- `hooks/use-realtime-notifications.ts` - Push notification system

#### UI Component System
- Built on shadcn/ui with custom theme in `tailwind.config.ts`
- Custom animations: fade-in, slide-in, bounce-gentle
- Responsive design with mobile-first approach
- Dark/light mode support via `next-themes`

### Environment Variables Required
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

### Route Protection Strategy
Protected routes are enforced in `lib/supabase/middleware.ts`:
- `/dashboard` - User dashboard (requires auth)
- `/profile` - User profile management (requires auth)  
- `/sell` - Book listing creation (requires auth)
- `/checkout` - Payment processing (requires auth)

### Real-time Data Flow
1. User actions trigger database changes via Supabase client
2. Database functions update related records (bid counts, current prices)
3. Supabase Realtime broadcasts changes to subscribed clients
4. React components update automatically via custom hooks
5. UI reflects changes instantly across all connected users

### Key Business Logic
- **Auction System**: Time-based bidding with automatic outbid detection
- **Auto-bidding**: Users set maximum bid amounts for automatic bidding
- **Escrow Payments**: Stripe holds funds until transaction completion
- **Domain Restriction**: Only @dubai.bits-pilani.ac.in emails allowed
- **Rating System**: Automatic calculation after transaction completion

### Common Development Patterns
- Use `createClient()` from `@/lib/supabase/client` for browser-side operations
- Use `createClient()` from `@/lib/supabase/server` for API routes and server components
- All database operations should respect RLS policies
- Real-time subscriptions should be cleaned up in useEffect return functions
- Form validation using react-hook-form with zod schemas (where implemented)

### Security Considerations
- Never expose service role key in client-side code
- All API routes validate user authentication
- Database RLS policies prevent unauthorized data access
- CSRF protection via SameSite cookies
- Rate limiting on all API endpoints
- Content Security Policy configured for Stripe integration

### Performance Optimizations
- Database indexes on frequently queried columns (user_id, book_id, created_at)
- Image optimization configured in Next.js
- Real-time subscriptions are scoped to specific resources
- Pagination implemented for large data sets
- Static generation for public pages

This is a student-focused textbook marketplace with emphasis on secure, real-time auction functionality restricted to BITS Pilani Dubai campus community.
