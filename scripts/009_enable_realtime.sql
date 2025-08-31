-- Enable Realtime for bidding tables
-- Run these commands in your Supabase dashboard

-- Enable realtime on the bids table
alter table public.bids replica identity full;
select supabase_realtime.prepare_table('public.bids');

-- Enable realtime on the books table for bid count updates
alter table public.books replica identity full;
select supabase_realtime.prepare_table('public.books');

-- Enable realtime on messages table for chat
alter table public.messages replica identity full;
select supabase_realtime.prepare_table('public.messages');

-- Create a function to handle automatic bidding logic
create or replace function public.handle_auto_bidding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    competing_auto_bids record;
    next_bid_amount numeric;
begin
    -- Only process if this is a new bid (INSERT) and auction is still active
    if TG_OP = 'INSERT' then
        -- Check for auto-bids that should respond to this new bid
        for competing_auto_bids in 
            select * from public.bids 
            where book_id = new.book_id 
            and bidder_id != new.bidder_id
            and is_auto_bid = true 
            and max_auto_bid > new.amount
            and status = 'active'
            order by max_auto_bid desc, created_at asc -- Higher max bid wins, earlier registration wins ties
            limit 1
        loop
            -- Calculate next bid amount (current bid + increment)
            select starting_price + 25 into next_bid_amount from public.books where id = new.book_id;
            next_bid_amount := greatest(next_bid_amount, new.amount + 25);
            
            -- Don't exceed the max auto bid
            if next_bid_amount <= competing_auto_bids.max_auto_bid then
                -- Place the auto-bid
                insert into public.bids (
                    book_id, 
                    bidder_id, 
                    amount, 
                    is_auto_bid, 
                    max_auto_bid,
                    status
                ) values (
                    new.book_id,
                    competing_auto_bids.bidder_id,
                    next_bid_amount,
                    true,
                    competing_auto_bids.max_auto_bid,
                    'active'
                );
                
                -- Mark previous bids as outbid
                update public.bids 
                set status = 'outbid' 
                where book_id = new.book_id 
                and id != lastval() 
                and status = 'active';
            end if;
        end loop;
        
        -- Update all other bids for this book to 'outbid' status except the highest
        update public.bids 
        set status = 'outbid'
        where book_id = new.book_id 
        and amount < new.amount
        and status = 'active';
    end if;
    
    return new;
end;
$$;

-- Create trigger for auto-bidding (runs after the book bid info is updated)
drop trigger if exists handle_auto_bidding_trigger on public.bids;
create trigger handle_auto_bidding_trigger
    after insert on public.bids
    for each row
    execute function public.handle_auto_bidding();

-- Create notification function for bid alerts
create or replace function public.notify_bid_placed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    book_title text;
    seller_id uuid;
begin
    -- Get book info
    select title, seller_id into book_title, seller_id from public.books where id = new.book_id;
    
    -- Notify seller about new bid
    insert into public.notifications (
        user_id,
        type,
        title,
        message,
        metadata,
        created_at
    ) values (
        seller_id,
        'new_bid',
        'New Bid Received',
        format('Someone bid ₹%s on your book "%s"', new.amount, book_title),
        json_build_object(
            'book_id', new.book_id,
            'bid_id', new.id,
            'bid_amount', new.amount,
            'book_title', book_title
        ),
        now()
    );
    
    return new;
end;
$$;

-- Create notifications table if it doesn't exist
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    type text not null,
    title text not null,
    message text not null,
    metadata jsonb,
    read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;

create policy "notifications_select_own"
    on public.notifications for select
    using (auth.uid() = user_id);

create policy "notifications_update_own"
    on public.notifications for update
    using (auth.uid() = user_id);

-- Enable realtime on notifications
alter table public.notifications replica identity full;
select supabase_realtime.prepare_table('public.notifications');

-- Create trigger for bid notifications
drop trigger if exists notify_bid_placed_trigger on public.bids;
create trigger notify_bid_placed_trigger
    after insert on public.bids
    for each row
    execute function public.notify_bid_placed();

-- Create function to check auction end time and update status
create or replace function public.check_auction_end()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    -- Update expired auctions
    update public.books
    set status = 'expired'
    where status = 'active'
    and auction_end_time < now();
    
    -- Mark winning bids
    with highest_bids as (
        select distinct on (book_id) 
            id as bid_id,
            book_id,
            bidder_id,
            amount
        from public.bids
        where book_id in (
            select id from public.books where status = 'expired'
        )
        and status = 'active'
        order by book_id, amount desc, created_at asc
    )
    update public.bids
    set status = 'won'
    where id in (select bid_id from highest_bids);
    
    -- Mark losing bids
    update public.bids
    set status = 'lost'
    where book_id in (select id from public.books where status = 'expired')
    and status = 'active';
end;
$$;

-- You can set up a cron job to run this function periodically
-- For now, it can be called manually or through a scheduled function
