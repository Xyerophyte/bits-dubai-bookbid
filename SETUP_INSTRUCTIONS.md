# BITS Dubai BookBid - Setup and Testing Instructions

## Overview
The application now has admin-restricted selling functionality and real-time bidding capabilities. Only admin users can create book listings, while all authenticated users can participate in bidding.

## Initial Setup

### 1. Environment Variables Setup
Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Configuration - REPLACE WITH YOUR EMAIL
NEXT_PUBLIC_ADMIN_EMAIL=your_email@dubai.bits-pilani.ac.in
```

**Important**: Replace `your_email@dubai.bits-pilani.ac.in` with your actual admin email address.

### 2. Database Setup
Execute the SQL scripts in your Supabase SQL Editor in this exact order:

1. `scripts/001_create_profiles.sql`
2. `scripts/002_create_categories.sql`
3. `scripts/003_create_books.sql`
4. `scripts/004_create_bids.sql`
5. `scripts/005_create_messages.sql`
6. `scripts/006_create_orders.sql`
7. `scripts/007_create_reviews.sql`
8. `scripts/008_create_functions.sql`
9. `scripts/009_enable_realtime.sql` (**NEW** - enables real-time features)

### 3. Supabase Realtime Setup
In your Supabase dashboard:
1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `bids`
   - `books`
   - `messages`
   - `notifications`

### 4. Authentication Setup
In your Supabase dashboard:
1. Go to **Authentication** → **Settings**
2. Set **Site URL**: `http://localhost:3000` (or your domain)
3. Add **Redirect URLs**: `http://localhost:3000/auth/callback`
4. Configure email domain restriction to `@dubai.bits-pilani.ac.in` (optional)

## Admin Access Testing

### Testing Admin Functionality

1. **Create Admin Account**:
   - Sign up with the email address you set in `NEXT_PUBLIC_ADMIN_EMAIL`
   - Verify this matches exactly (case-insensitive)

2. **Admin Features to Test**:
   - ✅ Admin badge appears in navigation
   - ✅ "Sell Book" button is visible and functional
   - ✅ Can access `/sell` page without restrictions
   - ✅ Sell form works properly
   - ✅ Admin indicators appear on all pages

3. **Non-Admin User Testing**:
   - Sign up with a different email address
   - ✅ No admin badge in navigation
   - ✅ No "Sell Book" button visible
   - ✅ Attempting to visit `/sell` shows "Access Denied" page
   - ✅ Dashboard shows appropriate messaging for listings tab

## Real-time Bidding Testing

### Testing Real-time Features

1. **Setup Multiple Browser Sessions**:
   - Open 2-3 different browsers or incognito windows
   - Sign up different users in each
   - Navigate to the same book detail page (`/books/1`)

2. **Test Real-time Bid Updates**:
   - Place a bid in one browser
   - ✅ Bid should appear instantly in all other browsers
   - ✅ Current bid amount updates everywhere
   - ✅ Bid count increments
   - ✅ Bid history updates in real-time

3. **Test Auto-bidding**:
   - Set up auto-bid with maximum amount in one browser
   - Place manual bids from another browser
   - ✅ Auto-bid should respond automatically
   - ✅ UI should show auto-bid indicators

4. **Test Countdown Timers**:
   - ✅ Timer counts down in real-time
   - ✅ Urgency indicators appear (red for < 5 min, orange for < 1 hour)
   - ✅ Progress bars show time urgency

5. **Test Chat Functionality**:
   - Click "Chat with Seller" button
   - ✅ Chat window opens
   - ✅ Messages appear in real-time
   - ✅ Unread message count updates
   - ✅ Typing indicators work (simulated)

## Error Handling Testing

### Test Error Scenarios

1. **Network Issues**:
   - Disconnect internet while placing a bid
   - ✅ Error message appears
   - ✅ Bid doesn't get stuck in loading state
   - ✅ User can retry when connection returns

2. **Concurrent Bidding**:
   - Have two users bid at exactly the same time
   - ✅ Only valid bid is accepted
   - ✅ Error handling for invalid bids
   - ✅ Real-time updates resolve conflicts

3. **Validation Testing**:
   - Try to bid below minimum amount
   - ✅ Validation error appears
   - ✅ Bid button is disabled for invalid amounts
   - ✅ Clear error messaging

4. **Authentication Testing**:
   - Try to bid while logged out
   - ✅ Appropriate error handling
   - ✅ Redirect to auth page if needed

## Mobile Responsiveness Testing

### Test on Different Screen Sizes

1. **Mobile Devices (< 768px)**:
   - ✅ Navigation collapses appropriately
   - ✅ Bidding interface is usable on mobile
   - ✅ Chat interface works on mobile
   - ✅ Images and layout adapt

2. **Tablet (768px - 1024px)**:
   - ✅ Grid layouts adjust properly
   - ✅ All functionality accessible
   - ✅ Touch interactions work

3. **Desktop (> 1024px)**:
   - ✅ Full feature set available
   - ✅ Multi-column layouts work
   - ✅ All interactive elements accessible

## Performance Testing

### Areas to Monitor

1. **Real-time Connections**:
   - Monitor WebSocket connections
   - Check for memory leaks in long sessions
   - Verify subscriptions clean up properly

2. **Database Performance**:
   - Monitor query performance with multiple concurrent users
   - Check that indexes are being used efficiently
   - Verify triggers execute quickly

3. **Loading Times**:
   - Page load times should be under 2 seconds
   - Real-time updates should appear within 100ms
   - Image loading should be optimized

## Common Issues and Solutions

### Admin Access Not Working
- **Issue**: Admin badge not showing
- **Solution**: Verify `NEXT_PUBLIC_ADMIN_EMAIL` exactly matches user's email
- **Check**: Case sensitivity, typos, domain name

### Real-time Updates Not Working
- **Issue**: Bids not appearing in real-time
- **Solution**: Check Supabase Realtime is enabled for tables
- **Check**: Network connectivity, browser WebSocket support

### Authentication Issues
- **Issue**: Users can't sign up/sign in
- **Solution**: Check Supabase auth settings and redirect URLs
- **Check**: Email verification settings, domain restrictions

### Database Errors
- **Issue**: SQL errors when running scripts
- **Solution**: Run scripts in exact order specified
- **Check**: Previous scripts completed successfully

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Next Steps

1. **Deploy to Production**:
   - Update environment variables for production
   - Configure production domains in Supabase
   - Set up production Stripe webhooks

2. **Additional Features**:
   - Email notifications for bid updates
   - Push notifications via service worker
   - Advanced search and filtering
   - User profile enhancements

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor real-time connection health
   - Track user engagement metrics

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure database scripts ran successfully
4. Check Supabase dashboard for configuration issues

For deployment guidance, see `DEPLOYMENT.md`.
For architecture details, see `WARP.md`.
