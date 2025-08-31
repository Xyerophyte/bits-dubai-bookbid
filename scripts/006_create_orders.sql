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
