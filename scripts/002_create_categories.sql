-- Create categories/subjects table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique, -- e.g., 'CS', 'EE', 'ME'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;

-- Allow everyone to read categories
create policy "categories_select_all"
  on public.categories for select
  using (true);

-- Insert default categories
insert into public.categories (name, code, description) values
  ('Computer Science', 'CS', 'Computer Science and Engineering courses'),
  ('Electrical Engineering', 'EE', 'Electrical and Electronics Engineering courses'),
  ('Mechanical Engineering', 'ME', 'Mechanical Engineering courses'),
  ('Civil Engineering', 'CE', 'Civil Engineering courses'),
  ('Chemical Engineering', 'CHE', 'Chemical Engineering courses'),
  ('Mathematics', 'MATH', 'Mathematics and Applied Mathematics courses'),
  ('Physics', 'PHY', 'Physics courses'),
  ('Chemistry', 'CHEM', 'Chemistry courses'),
  ('Biology', 'BIO', 'Biological Sciences courses'),
  ('Economics', 'ECON', 'Economics courses'),
  ('Management', 'MGMT', 'Management and Business courses'),
  ('General Education', 'GEN', 'General Education and Elective courses')
on conflict (code) do nothing;
