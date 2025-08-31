# BookBid System Testing Guide

## Prerequisites

1. **Environment Setup**
   - Ensure `.env.local` has `NEXT_PUBLIC_ADMIN_EMAIL` set to your email
   - Run the SQL scripts in order in your Supabase dashboard:
     ```sql
     -- Run these in your Supabase SQL Editor:
     scripts/001_create_profiles.sql
     scripts/002_create_categories.sql
     scripts/003_create_books.sql
     scripts/004_create_bids.sql
     scripts/005_create_messages.sql
     scripts/006_create_orders.sql
     scripts/007_create_reviews.sql
     scripts/008_create_functions.sql
     scripts/009_enable_realtime.sql
     scripts/010_populate_sample_books.sql  -- NEW: Real textbooks
     ```

## Testing Flow

### Phase 1: Setup and Initial Data

1. **Populate Database with Real Books**
   - Run `010_populate_sample_books.sql` in Supabase SQL Editor
   - This adds real textbooks from BITS Dubai curriculum

2. **Verify Admin Access**
   - Log in with the email set in `NEXT_PUBLIC_ADMIN_EMAIL`
   - Check that you see "Admin" badge in header
   - Verify "Sell Book" button appears

### Phase 2: Browse Books (Real Data Only)

1. **Navigate to Browse Books** (`/books`)
   - Should show real textbooks from the database
   - No more mock/placeholder data
   - Books should include:
     - Campbell Essential Biology
     - Thomas Calculus
     - Elements of Physical Chemistry
     - Engineering Drawing and Design
     - And other curriculum books

2. **Test Filtering**
   - Filter by condition: `new`, `like_new`, `used`
   - Filter by subject: Biology, Chemistry, Mathematics, etc.
   - Search by course codes: MATH F101, CHEM F101, etc.

3. **Verify Data Consistency**
   - Book cards show correct information
   - Condition badges display properly
   - Time remaining shows correctly

### Phase 3: Create New Listing

1. **Access Sell Page** (Admin only)
   - Click "Sell Book" button in header
   - Should see the book listing form

2. **Create a Test Listing**
   - Fill out form with test data:
     ```
     Title: Test Physics Book
     Author: Test Author
     Edition: 1st Edition
     Condition: like_new
     Subject: physics
     Min Bid Price: 500
     Buy Now Price: 800
     Description: Test book for verification
     ```

3. **Submit and Verify**
   - Click "List Book for Sale"
   - Should see success message
   - Should redirect to book detail page
   - Note the book ID from URL

### Phase 4: Verify New Book Appears

1. **Return to Browse Books**
   - Click "Browse Books" or navigate to `/books`
   - Your new test book should appear at the top (newest first)
   - Click refresh button to ensure it loads

2. **Test Book Detail Page**
   - Click on your new book
   - Should load proper detail page with your data
   - No mock data should appear

### Phase 5: Test Bidding System

1. **Place a Bid**
   - On book detail page, enter bid amount
   - Should be higher than starting price + increment
   - Click "Place Bid"

2. **Verify Real-time Updates**
   - Open book detail page in two browser tabs
   - Place bid in one tab
   - Other tab should update automatically
   - Check that bid count increases

3. **Test Auto-bidding** (if enabled)
   - Enable auto-bid toggle
   - Set maximum auto-bid amount
   - Have another user place competing bids
   - System should auto-bid up to your maximum

### Phase 6: Comprehensive Integration Test

1. **Multi-user Testing**
   - Create/use different user accounts
   - Have multiple users bid on the same book
   - Verify real-time updates work for all users

2. **Database Consistency**
   - Check Supabase dashboard to verify:
     - Books table has your new entries
     - Bids table records all bid activity
     - Current_bid and bid_count fields update correctly

## Expected Results

### ✅ Success Criteria

- **No Mock Data**: Only real database data appears
- **New Listings Appear**: Books created through form show up immediately
- **Real-time Bidding**: Bids update across all users instantly
- **Proper Navigation**: Book detail pages load with correct data
- **Admin Controls**: Only admin users can create listings
- **Data Integrity**: Database reflects all user actions correctly

### ❌ Common Issues and Solutions

1. **Books Don't Show Up**
   - Check console for database errors
   - Verify Supabase connection
   - Run `SELECT * FROM books WHERE status = 'active'` in SQL editor

2. **Admin Not Recognized**
   - Check `.env.local` has correct email
   - Restart development server
   - Verify email matches your login

3. **Bidding Not Working**
   - Check if realtime is enabled (`009_enable_realtime.sql`)
   - Verify user profile exists in database
   - Check browser console for errors

4. **Condition Filter Issues**
   - Verify database uses `like_new` (underscore, not hyphen)
   - Check filter options match database values

## Debugging Tips

1. **Console Logging**
   - Check browser console for errors
   - Look for network requests to Supabase
   - Verify real-time subscriptions connect

2. **Database Queries**
   - Use Supabase SQL editor to check data:
     ```sql
     -- Check active books
     SELECT * FROM books WHERE status = 'active' ORDER BY created_at DESC;
     
     -- Check recent bids
     SELECT * FROM bids ORDER BY created_at DESC LIMIT 10;
     
     -- Check user profiles
     SELECT * FROM profiles;
     ```

3. **Network Tab**
   - Monitor API calls in browser DevTools
   - Check for 401 (auth) or 403 (permission) errors
   - Verify WebSocket connections for realtime features

## Performance Testing

1. **Load Testing**
   - Add 20+ books using the populate script
   - Test filtering and sorting with large dataset
   - Verify page load times remain reasonable

2. **Concurrent Users**
   - Have multiple users bid simultaneously
   - Check for race conditions in bidding
   - Verify real-time updates scale properly

## Success Confirmation

When all tests pass, you should have:

- A fully functional book marketplace with real data
- No mock/placeholder content anywhere
- Real-time bidding that works across multiple users
- Proper admin controls for book creation
- Seamless user experience from listing to bidding

The system is now production-ready with your actual BITS Dubai curriculum textbooks!
