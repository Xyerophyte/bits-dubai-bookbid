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
