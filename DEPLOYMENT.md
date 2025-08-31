# BITS Dubai BookBid - Production Deployment Guide

This guide covers the complete deployment process for the BITS Dubai BookBid platform to Vercel with Supabase backend.

## Prerequisites

- Vercel account
- Supabase project
- Stripe account (for payments)
- Domain access (optional, Vercel domain works fine)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note down your project URL and anon key

### 1.2 Run Database Migrations
Execute the following SQL scripts in your Supabase SQL Editor in order:

1. `scripts/001_create_profiles.sql` - User profiles table
2. `scripts/002_create_categories.sql` - Book categories
3. `scripts/003_create_books.sql` - Book listings table
4. `scripts/004_create_bids.sql` - Bidding system
5. `scripts/005_create_messages.sql` - Chat functionality
6. `scripts/006_create_orders.sql` - Order management
7. `scripts/007_create_reviews.sql` - Review system
8. `scripts/008_create_functions.sql` - Database functions

### 1.3 Configure Authentication
1. Go to Authentication > Settings in Supabase
2. Enable Email authentication
3. Configure Google OAuth (optional):
   - Add Google provider
   - Set authorized domains to include your Vercel domain
4. Set up email templates for confirmation emails

## Step 2: Stripe Setup

### 2.1 Create Stripe Account
1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete account verification
3. Enable payments for UAE (required for BITS Dubai)

### 2.2 Get API Keys
1. Go to Developers > API Keys
2. Copy your Publishable Key and Secret Key
3. Create a webhook endpoint for payment confirmations

### 2.3 Configure Webhooks
1. Go to Developers > Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook signing secret

## Step 3: Environment Variables

Set up the following environment variables in your Vercel project:

### Supabase Variables
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### Stripe Variables
\`\`\`
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

### App Configuration
\`\`\`
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

## Step 4: Vercel Deployment

### 4.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings (Next.js should be auto-detected)

### 4.2 Configure Environment Variables
1. Go to Project Settings > Environment Variables
2. Add all the environment variables listed above
3. Make sure to set them for Production, Preview, and Development

### 4.3 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Step 5: Post-Deployment Configuration

### 5.1 Update Supabase Settings
1. Go to Supabase > Authentication > Settings
2. Add your Vercel domain to "Site URL"
3. Add your domain to "Redirect URLs"

### 5.2 Update Stripe Settings
1. Update webhook endpoint URL to your production domain
2. Test webhook delivery
3. Verify payment flow in production

### 5.3 Test Core Functionality
- [ ] User registration with BITS Dubai email
- [ ] Google OAuth login
- [ ] Book listing creation
- [ ] Bidding functionality
- [ ] Payment processing
- [ ] Real-time notifications
- [ ] Chat functionality

## Step 6: Domain Configuration (Optional)

If using a custom domain:

### 6.1 Add Custom Domain
1. Go to Vercel Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 6.2 Update Environment Variables
1. Update `NEXT_PUBLIC_APP_URL` to your custom domain
2. Update Supabase and Stripe settings with new domain

## Monitoring & Maintenance

### Analytics
- Vercel Analytics is already integrated
- Monitor performance and user behavior

### Error Tracking
- Check Vercel Function logs for API errors
- Monitor Supabase logs for database issues
- Set up Stripe webhook monitoring

### Database Maintenance
- Regular backups via Supabase
- Monitor database performance
- Clean up old data as needed

## Troubleshooting

### Common Issues

**Authentication not working:**
- Check Supabase site URL configuration
- Verify redirect URLs include your domain
- Ensure email templates are configured

**Payments failing:**
- Verify Stripe webhook endpoint
- Check webhook signing secret
- Ensure Stripe account is activated for UAE

**Real-time features not working:**
- Check Supabase Realtime is enabled
- Verify RLS policies allow subscriptions
- Check browser console for WebSocket errors

**Build failures:**
- Check environment variables are set
- Verify all dependencies are installed
- Review build logs for specific errors

## Security Checklist

- [ ] All environment variables are secure
- [ ] RLS policies are properly configured
- [ ] Stripe webhooks are verified
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Rate limiting is in place

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase project logs
3. Verify Stripe webhook delivery
4. Contact support if needed

---

**Production URL:** https://bits-dubai-bookbid.vercel.app
**Last Updated:** January 2025
