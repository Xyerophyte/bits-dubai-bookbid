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
