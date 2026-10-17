const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_l6ZQBpeSn4ok@ep-quiet-wildflower-a1s7bvt9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const schemaSql = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#8b5cf6',
    icon TEXT NOT NULL DEFAULT 'tag',
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_links (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
    url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'reel',
    author_username TEXT,
    author_name TEXT,
    author_avatar_url TEXT,
    author_profile_url TEXT,
    title TEXT,
    thumbnail_url TEXT,
    embed_html TEXT,
    audio_title TEXT,
    audio_author TEXT,
    hashtags TEXT[] DEFAULT '{}',
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    comments_count BIGINT DEFAULT 0,
    shares_count BIGINT DEFAULT 0,
    engagement_rate NUMERIC(8, 2) DEFAULT 0.00,
    rating INT DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    talent_type TEXT,
    tags TEXT[] DEFAULT '{}',
    hook_type TEXT,
    outreach_status TEXT NOT NULL DEFAULT 'saved' CHECK (
        outreach_status IN ('saved', 'shortlisted', 'contacted', 'in_discussion', 'collaborated', 'archived')
    ),
    contact_phone TEXT,
    contact_email TEXT,
    contact_notes TEXT,
    last_contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_links_url ON saved_links(url);

CREATE TABLE IF NOT EXISTS media_storage (
    id TEXT PRIMARY KEY,
    link_id TEXT REFERENCES saved_links(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL,
    original_url TEXT,
    content_type TEXT DEFAULT 'image/jpeg',
    image_base64 TEXT,
    image_data BYTEA,
    file_size INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed admin user
INSERT INTO app_users (username, password_hash, role)
VALUES ('mafiaBos', 'mafiaBos625', 'admin')
ON CONFLICT (username) DO UPDATE SET password_hash = 'mafiaBos625';

-- Seed default categories
INSERT INTO categories (id, name, slug, color, icon, is_system)
VALUES
    ('cat-chindo', 'Chindo', 'chindo', '#ec4899', 'sparkles', true),
    ('cat-lokal', 'Lokal / Indo', 'lokal-indo', '#f59e0b', 'smile', true),
    ('cat-hijab', 'Hijab / Muslimah', 'hijab-muslimah', '#10b981', 'heart', true),
    ('cat-fienshyt', 'Fienshyt / Edgy', 'fienshyt-edgy', '#8b5cf6', 'flame', true),
    ('cat-bocil', 'Bocil / Remaja', 'bocil-remaja', '#06b6d4', 'star', true),
    ('cat-dokter', 'Dokter & Profesi', 'dokter-profesi', '#14b8a6', 'activity', true),
    ('cat-cosplay', 'Cosplay & Anime', 'cosplay-anime', '#c084fc', 'palette', true),
    ('cat-kampus', 'Kampus & Mahasiswi', 'kampus-mahasiswi', '#3b82f6', 'book-open', true),
    ('cat-penting', 'Penting (Prioritas)', 'penting-prioritas', '#fbbf24', 'star', true),
    ('cat-fashion', 'Fashion & OOTD', 'fashion-ootd', '#ec4899', 'shirt', true),
    ('cat-beauty', 'Beauty & Skincare', 'beauty-skincare', '#f43f5e', 'sparkles', true),
    ('cat-dance', 'Dance & Trends', 'dance-trends', '#a855f7', 'music', true),
    ('cat-lifestyle', 'Lifestyle & Vlog', 'lifestyle-vlog', '#06b6d4', 'camera', true)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon;
`;

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Neon database. Creating tables and seeding categories...');
    await client.query(schemaSql);
    console.log('Schema successfully applied to Neon database!');

    const catRes = await client.query('SELECT count(*) FROM categories;');
    console.log(`Categories count in Neon: ${catRes.rows[0].count}`);

    const userRes = await client.query('SELECT count(*) FROM app_users;');
    console.log(`Users count in Neon: ${userRes.rows[0].count}`);
  } catch (err) {
    console.error('Error setting up Neon database:', err);
  } finally {
    await client.end();
  }
}

main();
