-- Create reviews table for user ratings
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
  using (true); -- Reviews are public

create policy "reviews_insert_reviewer"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id and
    -- Can only review after a completed order
    exists (
      select 1 from public.orders 
      where id = order_id 
      and (buyer_id = auth.uid() or seller_id = auth.uid())
      and delivery_status = 'completed'
    )
  );

-- Prevent duplicate reviews for the same order
create unique index reviews_unique_order_reviewer on public.reviews(order_id, reviewer_id);

-- Create indexes
create index reviews_reviewee_id_idx on public.reviews(reviewee_id);
create index reviews_rating_idx on public.reviews(rating);
create index reviews_created_at_idx on public.reviews(created_at desc);
