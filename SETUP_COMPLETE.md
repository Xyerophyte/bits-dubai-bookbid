# 🚀 BITS Dubai BookBid - Complete Setup Guide

## 📋 Step-by-Step Setup Instructions

### **Step 1: Get Supabase Service Role Key**

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (starts with `eyJhbGciOi...`)
4. This will be your `SUPABASE_SERVICE_ROLE_KEY`

### **Step 2: Set Up Vercel Environment Variables**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your "bid" project**
3. **Go to Settings** → **Environment Variables**
4. **Add these variables** (set for Production, Preview, and Development):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cemopscerinhpreejzix.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbW9wc2NlcmluaHByZWVqeml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1OTQ5MDYsImV4cCI6MjA3MjE3MDkwNn0.9GfXb0h6KfYnRiWA4Sdfe6ZrtyXl_4wbte2qx2uWuXw
SUPABASE_SERVICE_ROLE_KEY=[GET THIS FROM STEP 1]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_PUBLISHABLE_KEY]
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET_KEY]
STRIPE_WEBHOOK_SECRET=[WILL GET THIS IN STEP 5]
NEXT_PUBLIC_APP_URL=https://bitsbid.vercel.app
```

**⚠️ IMPORTANT**: Never commit your actual Stripe secret keys to GitHub. Only add them directly in the Vercel dashboard.

### **Step 3: Execute Database Scripts in Supabase**

1. **Go to your Supabase project** dashboard
2. **Click on SQL Editor**
3. **Execute these scripts in order** (copy and paste each script):

#### Script 1: Create Profiles Table
```sql
-- Create profiles table that extends auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  student_id text unique,
  phone text,
  year_of_study integer check (year_of_study >= 1 and year_of_study <= 4),
  branch text,
  avatar_url text,
  bio text,
  rating numeric(3,2) default 0.00 check (rating >= 0 and rating <= 5),
  total_reviews integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_public"
  on public.profiles for select
  using (true); -- Allow viewing other profiles for seller info

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();
```

#### Script 2: Create Categories Table
```sql
-- Create book categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  parent_id uuid references public.categories(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;

-- RLS Policies
create policy "categories_select_all"
  on public.categories for select
  using (true); -- Allow everyone to view categories

-- Insert default categories
insert into public.categories (name, description) values
('Mathematics', 'Mathematics textbooks and study materials'),
('Physics', 'Physics textbooks and study materials'),
('Chemistry', 'Chemistry textbooks and study materials'),
('Computer Science', 'Computer Science and Programming books'),
('Engineering', 'Engineering textbooks and references'),
('English', 'English language and literature books'),
('Economics', 'Economics and Finance textbooks'),
('Management', 'Management and Business studies'),
('Biology', 'Biology and Life Sciences books'),
('Other', 'Other academic books and materials');
```

#### Script 3: Create Books Table
```sql
-- Create books/listings table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id),
  title text not null,
  author text,
  edition text,
  isbn text,
  course_code text, -- e.g., 'CS F211', 'MATH F111'
  condition text not null check (condition in ('new', 'like_new', 'used')),
  description text,
  images text[], -- Array of image URLs
  listing_type text not null check (listing_type in ('auction', 'buy_now', 'both')),
  starting_price numeric(10,2) not null check (starting_price > 0),
  buy_now_price numeric(10,2) check (buy_now_price > starting_price),
  current_bid numeric(10,2) default 0,
  bid_count integer default 0,
  status text not null default 'active' check (status in ('active', 'sold', 'expired', 'cancelled')),
  auction_end_time timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.books enable row level security;

-- RLS Policies
create policy "books_select_all"
  on public.books for select
  using (true); -- Allow everyone to view active listings

create policy "books_insert_own"
  on public.books for insert
  with check (auth.uid() = seller_id);

create policy "books_update_own"
  on public.books for update
  using (auth.uid() = seller_id);

create policy "books_delete_own"
  on public.books for delete
  using (auth.uid() = seller_id);

-- Create updated_at trigger
create trigger books_updated_at
  before update on public.books
  for each row
  execute function public.handle_updated_at();

-- Create indexes for better performance
create index books_seller_id_idx on public.books(seller_id);
create index books_category_id_idx on public.books(category_id);
create index books_status_idx on public.books(status);
create index books_created_at_idx on public.books(created_at desc);
create index books_auction_end_time_idx on public.books(auction_end_time);
```

#### Script 4: Create Bids Table
```sql
-- Create bids table
create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  bidder_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  is_auto_bid boolean default false,
  max_auto_bid numeric(10,2), -- For auto-bidding feature
  status text not null default 'active' check (status in ('active', 'outbid', 'winning', 'won', 'lost')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bids enable row level security;

-- RLS Policies
create policy "bids_select_book_participants"
  on public.bids for select
  using (
    auth.uid() = bidder_id or 
    auth.uid() in (select seller_id from public.books where id = book_id)
  );

create policy "bids_insert_own"
  on public.bids for insert
  with check (
    auth.uid() = bidder_id and
    auth.uid() != (select seller_id from public.books where id = book_id) -- Can't bid on own items
  );

create policy "bids_update_own"
  on public.bids for update
  using (auth.uid() = bidder_id);

-- Create indexes
create index bids_book_id_idx on public.bids(book_id);
create index bids_bidder_id_idx on public.bids(bidder_id);
create index bids_created_at_idx on public.bids(created_at desc);
create index bids_amount_idx on public.bids(amount desc);

-- Unique constraint to prevent duplicate bids from same user on same book at same amount
create unique index bids_unique_user_book_amount on public.bids(book_id, bidder_id, amount);
```

#### Script 5: Create Messages Table
```sql
-- Create messages table for chat functionality
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- RLS Policies
create policy "messages_select_participants"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "messages_update_recipient"
  on public.messages for update
  using (auth.uid() = recipient_id);

-- Create indexes
create index messages_book_id_idx on public.messages(book_id);
create index messages_sender_id_idx on public.messages(sender_id);
create index messages_recipient_id_idx on public.messages(recipient_id);
create index messages_created_at_idx on public.messages(created_at desc);
```

#### Script 6: Create Orders Table
```sql
-- Create orders table for transaction tracking
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete restrict,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  final_price numeric(10,2) not null check (final_price > 0),
  payment_method text not null check (payment_method in ('stripe', 'paypal')),
  payment_intent_id text, -- Stripe payment intent ID
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'confirmed', 'completed', 'disputed')),
  delivery_method text check (delivery_method in ('pickup', 'delivery')),
  delivery_address text,
  delivery_notes text,
  escrow_released boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;

-- RLS Policies
create policy "orders_select_participants"
  on public.orders for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "orders_insert_buyer"
  on public.orders for insert
  with check (auth.uid() = buyer_id);

create policy "orders_update_participants"
  on public.orders for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Create updated_at trigger
create trigger orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- Create indexes
create index orders_book_id_idx on public.orders(book_id);
create index orders_buyer_id_idx on public.orders(buyer_id);
create index orders_seller_id_idx on public.orders(seller_id);
create index orders_payment_status_idx on public.orders(payment_status);
create index orders_delivery_status_idx on public.orders(delivery_status);
create index orders_created_at_idx on public.orders(created_at desc);
```

#### Script 7: Create Reviews Table
```sql
-- Create reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reviews enable row level security;

-- RLS Policies
create policy "reviews_select_all"
  on public.reviews for select
  using (true); -- Allow everyone to view reviews

create policy "reviews_insert_order_participant"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id and
    auth.uid() in (
      select buyer_id from public.orders where id = order_id
      union
      select seller_id from public.orders where id = order_id
    )
  );

-- Create indexes
create index reviews_order_id_idx on public.reviews(order_id);
create index reviews_reviewer_id_idx on public.reviews(reviewer_id);
create index reviews_reviewee_id_idx on public.reviews(reviewee_id);
create index reviews_created_at_idx on public.reviews(created_at desc);

-- Ensure only one review per order per reviewer
create unique index reviews_unique_order_reviewer on public.reviews(order_id, reviewer_id);
```

#### Script 8: Create Database Functions
```sql
-- Function to update book current_bid and bid_count
create or replace function public.update_book_bid_info()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Update the book's current bid and bid count
  update public.books
  set 
    current_bid = (
      select coalesce(max(amount), starting_price)
      from public.bids
      where book_id = new.book_id and status = 'active'
    ),
    bid_count = (
      select count(*)
      from public.bids
      where book_id = new.book_id
    ),
    updated_at = timezone('utc'::text, now())
  where id = new.book_id;
  
  return new;
end;
$$;

-- Trigger to update book bid info when a new bid is placed
create trigger update_book_bid_info_trigger
  after insert on public.bids
  for each row
  execute function public.update_book_bid_info();

-- Function to update user ratings
create or replace function public.update_user_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Update the reviewee's rating and review count
  update public.profiles
  set 
    rating = (
      select round(avg(rating)::numeric, 2)
      from public.reviews
      where reviewee_id = new.reviewee_id
    ),
    total_reviews = (
      select count(*)
      from public.reviews
      where reviewee_id = new.reviewee_id
    ),
    updated_at = timezone('utc'::text, now())
  where id = new.reviewee_id;
  
  return new;
end;
$$;

-- Trigger to update user rating when a new review is added
create trigger update_user_rating_trigger
  after insert on public.reviews
  for each row
  execute function public.update_user_rating();

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Trigger to create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
```

### **Step 4: Configure Supabase Authentication**

1. **Go to Authentication** → **Settings**
2. **Site URL**: Set to `https://bitsbid.vercel.app`
3. **Redirect URLs**: Add `https://bitsbid.vercel.app/auth/callback`
4. **Enable Google OAuth** (if desired):
   - Add Google provider
   - Use your Google OAuth credentials
   - Set authorized redirect URI to `https://bitsbid.vercel.app/auth/callback`

### **Step 5: Set Up Stripe Webhook**

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com
2. **Navigate to Developers** → **Webhooks**
3. **Click "Add endpoint"**
4. **Endpoint URL**: `https://bitsbid.vercel.app/api/webhooks/stripe`
5. **Events to send**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. **Copy the webhook signing secret** and add it as `STRIPE_WEBHOOK_SECRET` in Vercel

### **Step 6: Deploy with Custom Domain**

After setting up all environment variables:

1. **Wait for Vercel to redeploy** (automatic after env vars are added)
2. **Go to Vercel Project Settings** → **Domains**
3. **Add domain**: `bitsbid.vercel.app`
4. **Test the application**

---

## 🎯 Final Checklist

- [ ] Get Supabase service role key from dashboard
- [ ] Add all 7 environment variables to Vercel (with your actual Stripe keys)
- [ ] Execute all 8 database scripts in Supabase SQL Editor
- [ ] Configure authentication settings in Supabase
- [ ] Set up Stripe webhook with signing secret
- [ ] Add custom domain `bitsbid.vercel.app`
- [ ] Test user registration and authentication
- [ ] Test book listing and bidding
- [ ] Test payment processing

---

## 🚀 Your Application Features

✅ **Real-time auction bidding**
✅ **Secure payment processing with escrow**
✅ **User authentication with Google OAuth**
✅ **Direct messaging between users**
✅ **Comprehensive book search and filtering**
✅ **User profiles and rating system**
✅ **Mobile-responsive design**
✅ **Admin capabilities**

**Your textbook marketplace is ready to launch! 🎉**

---

## 🔐 Security Note

**Remember**: 
- Never commit actual API keys or secrets to your GitHub repository
- Always use Vercel's environment variables dashboard to securely store sensitive information
- The placeholder values in this guide should be replaced with your actual credentials in the Vercel dashboard only
