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
