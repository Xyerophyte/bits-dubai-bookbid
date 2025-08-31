-- Create messages table for chat functionality
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- RLS Policies - Users can only see messages they sent or received
create policy "messages_select_participants"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "messages_update_receiver"
  on public.messages for update
  using (auth.uid() = receiver_id); -- For marking as read

-- Create indexes
create index messages_book_id_idx on public.messages(book_id);
create index messages_sender_id_idx on public.messages(sender_id);
create index messages_receiver_id_idx on public.messages(receiver_id);
create index messages_created_at_idx on public.messages(created_at desc);
create index messages_is_read_idx on public.messages(is_read);
