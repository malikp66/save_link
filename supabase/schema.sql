-- =========================================================================
-- TALENTPULSE DATABASE SCHEMA FOR SUPABASE
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: categories
create table if not exists categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    color text not null default '#8b5cf6',
    icon text not null default 'tag',
    is_system boolean not null default false,
    created_at timestamptz not null default now()
);

-- 2. Table: saved_links
create table if not exists saved_links (
    id uuid primary key default gen_random_uuid(),
    platform text not null check (platform in ('instagram', 'tiktok')),
    url text not null,
    media_type text not null default 'reel',
    author_username text,
    author_name text,
    author_avatar_url text,
    author_profile_url text,
    title text,
    thumbnail_url text,
    embed_html text,
    audio_title text,
    audio_author text,
    hashtags text[] default '{}',
    views_count bigint default 0,
    likes_count bigint default 0,
    comments_count bigint default 0,
    shares_count bigint default 0,
    engagement_rate numeric(8, 2) default 0.00,
    rating int default 0 check (rating between 0 and 5),
    category_id uuid references categories(id) on delete set null,
    talent_type text,
    tags text[] default '{}',
    hook_type text,
    outreach_status text not null default 'saved' check (
        outreach_status in ('saved', 'shortlisted', 'contacted', 'in_discussion', 'collaborated', 'archived')
    ),
    contact_phone text,
    contact_email text,
    contact_notes text,
    last_contacted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. Trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create or replace trigger set_saved_links_updated_at
before update on saved_links
for each row execute function update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
alter table categories enable row level security;
alter table saved_links enable row level security;

-- Policies for public demo / development (replace with auth-specific policies if using Supabase Auth)
create policy "Allow all operations for anon categories" on categories
    for all using (true) with check (true);

create policy "Allow all operations for anon saved_links" on saved_links
    for all using (true) with check (true);

-- 5. Seed default categories (Niche & Demografi)
insert into categories (name, slug, color, icon, is_system)
values
    ('Chindo', 'chindo', '#ec4899', 'sparkles', true),
    ('Lokal / Indo', 'lokal-indo', '#f59e0b', 'smile', true),
    ('Hijab / Muslimah', 'hijab-muslimah', '#10b981', 'heart', true),
    ('Fienshyt / Edgy', 'fienshyt-edgy', '#8b5cf6', 'flame', true),
    ('Bocil / Remaja', 'bocil-remaja', '#06b6d4', 'star', true),
    ('Fashion & OOTD', 'fashion-ootd', '#ec4899', 'shirt', true),
    ('Beauty & Skincare', 'beauty-skincare', '#f43f5e', 'sparkles', true),
    ('Dance & Trends', 'dance-trends', '#a855f7', 'music', true),
    ('Lifestyle & Vlog', 'lifestyle-vlog', '#06b6d4', 'camera', true)
on conflict (slug) do nothing;
