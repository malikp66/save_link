# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project Name: TalentPulse / LinkScout (PWA Content Analyzer & Talent CRM)
**Target Platform:** Progressive Web App (Mobile & Desktop First)  
**Target Niches:** Content Creator Scouting, Instagram & TikTok Analytics, Talent Outreach  
**Author:** AI Product Architect  
**Status:** Ready for Review  
**Date:** September 2026  

---

## 1. Executive Summary & Latar Belakang (Problem Statement)

### 1.1 Latar Belakang Masalah
Saat ini, proses kurasi dan riset konten dari Instagram dan TikTok dilakukan secara konvensional dengan mencatat link mentah di aplikasi Notes (Apple Notes, Google Keep, Notepad, dll). Hal ini menimbulkan masalah kritis:
1. **Zero Visual Context**: Notes hanya berisi teks URL biru tanpa thumbnail, judul, audio, atau preview video.
2. **Sulit Tracking Profil Kreator**: Pengguna harus membuka aplikasi Instagram/TikTok satu per satu hanya untuk melihat siapa pembuatnya, berapa follower-nya, atau apa bio-nya.
3. **Analisis Manual & Tidak Terukur**: Sulit membandingkan performa konten (views, likes, shares, engagement rate) antar link.
4. **Tidak Ada Pipeline Outreach**: Tidak ada cara terstruktur untuk menandai apakah kreator tersebut sudah di-reach out (DM/Email/WA), masih ditinjau, atau sudah ada kesepakatan kerjasama.
5. **Taksonomi Berantakan**: Mengelompokkan niche konten (Fashion, Beauty, Dance, Lifestyle, dll) di Notes sangat kaku dan sulit di-filter.

### 1.2 Tujuan Produk (Product Objective)
Membangun sebuah **Progressive Web App (PWA)** mobile-first yang berfungsi sebagai **"All-in-One Content Intelligence & Talent Outreach Hub"**:
- **Simpan & Preview Seketika**: Menyimpan link IG & TikTok dengan instant rich preview (thumbnail, caption, nama kreator, video playback).
- **Analisis Mendalam & Tren**: Menghitung metrics performa, engagement rate, mendeteksi audio/sound yang sedang tren, serta format konten.
- **Kategorisasi Fleksibel**: Mendukung sistem kategori dinamis (custom tags & folder) sesuai preferensi pengguna.
- **Talent Scouting & Outreach Pipeline (CRM)**: Menyimpan detail kontak kreator, riwayat status follow-up (Baru -> Tertarik -> Kontak -> Deal -> Dilewati), dan reminder.

---

## 2. User Persona & Use Cases

### 2.1 User Persona
- **Peran**: Talent Scout, Influencer Marketing Specialist, Agency Head, atau Content Curator.
- **Kebiasaan**: Scrolling IG Reels dan TikTok setiap hari, menemukan konten berpotensi viral atau kreator bertalenta, lalu menyimpannya untuk kolaborasi/analisis lebih lanjut.
- **Pain Points**: Notes kepenuhan link, sering lupa kenapa link itu disimpan, dan hilang jejak saat ingin menghubungi kreator.

### 2.2 Core Use Cases
1. **Quick Capture saat Scrolling di HP**: Menekan tombol *Share* di IG/TikTok lalu memilih aplikasi PWA (Share Target API) atau copy-paste URL dengan auto-fetch metadata.
2. **Deep Content Breakdown**: Melihat rasio likes/comments, perkiraan engagement, hashtag, dan tren sound.
3. **Talent Profiling & Outreach**: Melihat profil kreator, menyimpan kontak (WhatsApp/Email/DM), dan memindahkan status kartu ke kanban/list outreach.
4. **Filtering & Discovery**: Memfilter daftar konten berdasarkan kategori (contoh: *Fashion/OOTD*, *Dance*, *Beauty*, *Daily Vlog*), platform (IG vs TikTok), atau engagement rate tertinggi.

---

## 3. Fitur Utama & Spesifikasi Fungsional

```
+-------------------------------------------------------------------------------+
|                       TALENTPULSE - PWA ARCHITECTURE                         |
+-------------------------------------------------------------------------------+
| [1. Ingestion Layer]      -> IG Reels/Posts & TikTok Video URL Ingestion      |
| [2. Preview Engine]       -> Embed player, Thumbnail, Audio & Caption Parser  |
| [3. Analytics Engine]     -> Engagement Rate, Trend Score, Virality Signals   |
| [4. Taxonomy & Tagging]   -> Dynamic Custom Categories, Multi-tags, Mood      |
| [5. Talent CRM Pipeline]  -> Contact info, Outreach Status Kanban, Notes      |
| [6. PWA & Offline Engine] -> Local-first cache, Share Target, Home Screen PWA |
+-------------------------------------------------------------------------------+
```

### 3.1 PWA Core Capabilities
- **Installable App (A2HS - Add to Home Screen)**: Dapat diinstal di iPhone (iOS Safari), Android (Chrome), serta Desktop (Windows/Mac) seperti aplikasi native tanpa lewat Play Store/App Store.
- **Share Target API**: Di Android/iOS, web app terdaftar di menu "Share via..." sehingga pengguna bisa langsung mengirim link dari TikTok/IG ke app ini tanpa repot bolak-balik copy-paste.
- **Offline-First & Local Persistence**: Data tetap bisa dibuka saat sinyal lambat atau offline menggunakan IndexedDB/LocalStorage.

---

### 3.2 Link Ingestion & Rich Visual Preview
- **Multi-Platform Support**:
  - Instagram: Reels, Carousel Posts, Single Posts, Stories (jika link masih aktif).
  - TikTok: Video links, Short URL (`vt.tiktok.com`), Desktop URL.
- **Auto Data Fetching / Parsing**:
  - Thumbnail resolusi tinggi.
  - Video in-app preview/embed (bisa langsung play di web tanpa terlempar keluar).
  - Username & Profile Picture kreator.
  - Caption lengkap + Hashtags list.
  - Audio/Music name & original creator sound.
  - Direct Action: Tombol "Buka di Instagram" & "Buka di TikTok".

---

### 3.3 Sistem Kategori & Custom Tagging
- **Kategori Default**:
  - *Fashion & OOTD*
  - *Beauty & Skincare*
  - *Dance & Trends*
  - *Lifestyle & Daily Vlog*
  - *Fitness & Health*
  - *Comedy & POV*
  - *Cosplay / Aesthetic*
- **Custom Category Builder**:
  - Pengguna bebas membuat kategori baru (Nama, Icon, Warna Label/Badge).
  - Multi-tagging per item (contoh: satu video bisa memiliki tag `Beauty`, `High Engagement`, `Prioritas Kontak`).
  - Star Rating / Score (1 sampai 5 bintang) untuk tingkat ketertarikan.

---

### 3.4 Deep Content & Trend Analytics
Fitur analisis mendalam untuk mengukur potensi dan popularitas konten:

| Indikator Analisis | Deskripsi | Manfaat untuk User |
| :--- | :--- | :--- |
| **Engagement Rate (ER)** | Perhitungan rasio `(Likes + Comments + Shares) / Views` | Mengetahui apakah konten benar-benar aktif atau sekadar views pasif |
| **Virality Index** | Metrik perbandingan kecepatan pertumbuhan likes terhadap rata-rata akun | Mengidentifikasi konten yang sedang *skyrocketing* (naik daun) |
| **Sound / Audio Tracking** | Mendeteksi apakah sound yang digunakan sedang tren atau original sound | Membantu user melihat tren audio apa yang sedang mendongkrak performa |
| **Hashtag Clustered Analysis** | Mengelompokkan hashtag yang paling sering muncul dari konten yang disimpan | Menemukan keyword tren baru di niche tertentu |
| **Hook & Content Format Type** | Labeling tipe hook konten (misal: *GRWM*, *Before-After*, *Storytelling*, *Review Produk*) | Mempelajari pola konten mana yang paling disukai audiens |

---

### 3.5 Talent Profiling & Outreach Pipeline (Touch-Up CRM)
Ini adalah fitur kunci agar pengguna tidak hanya menyimpan link, tapi bisa menindaklanjuti kreator tersebut:

1. **Creator Profile Card**:
   - Handle: `@username`
   - Platform: Instagram / TikTok (atau cross-link jika keduanya tersedia)
   - Estimated Tier: Nano (<10k), Micro (10k-100k), Mid-tier (100k-500k), Macro (500k+)
   - Contact Channels:
     - Direct DM shortcut (klik langsung buka DM IG/TikTok)
     - WhatsApp (input nomor WA + direct template chat)
     - Email (input email bisnis + direct mailto draft)
2. **Outreach Status Kanban / Badges**:
   - 🔵 **Saved** (Baru disimpan, belum dievaluasi)
   - 🟡 **Shortlisted** (Tertarik, masuk daftar prioritas)
   - 🟣 **Contacted** (Sudah dikirimi DM / Email / WA)
   - 🟢 **In Discussion / Deal** (Sedang negosiasi / sudah deal project)
   - ⚪ **Archived / Passed** (Tidak cocok atau belum relevan)
3. **Internal Notes & Follow-up Log**:
   - Catatan pribadi per kreator (contoh: *"Respon cepat, rate card 500rb per reel, tone konten sangat estetik"*).
   - Log tanggal kapan terakhir kali dihubungi.

---

### 3.6 Search, Filtering & Batch Operations
- **Instant Search**: Pencarian real-time berdasarkan nama kreator, keyword caption, hashtag, atau catatan pribadi.
- **Smart Filter**:
  - Filter by Platform (IG vs TikTok).
  - Filter by Category & Tags.
  - Filter by Outreach Status.
  - Sort by: Terbaru, Engagement Rate Tertinggi, Rating Bintang.
- **Data Export & Import**:
  - **Quick Import from Notes**: Pengguna bisa paste list text berisi ratusan link sekaligus, sistem akan otomatis mengekstrak semua URL dan membuat antrean data.
  - **Export to CSV / Excel / JSON**: Untuk backup atau presentasi tim.

---

## 4. Rencana Teknis (Technical Architecture & Stack)

### 4.1 Recommended Tech Stack
- **Frontend Framework**: **Next.js (App Router)** atau **Vite + React 19**
  - Menggunakan PWA Service Worker (Workbox / Vite PWA plugin).
  - Client-side responsive styling: Vanilla CSS modern dengan Design System Glassmorphism Dark Mode yang mewah.
- **Database & Storage**:
  - Local: **Dexie.js (IndexedDB)** untuk penyimpanan lokal kilat dan bekerja 100% offline.
  - Cloud Sync (Opsional / V2): **Supabase (PostgreSQL)** untuk sinkronisasi antar perangkat (HP & Laptop) dengan otentikasi akun.
- **Data Fetching / Link Parser Strategy**:
  - Instagram oEmbed API / Meta Graph API & OpenGraph metadata scraper.
  - TikTok oEmbed API (`https://www.tiktok.com/oembed?url=...` gratis, resmi, tanpa API key untuk preview, embed video, author, title, thumbnail).
  - Background enrichment scraper untuk metrik views/likes (via lightweight microservice / proxy / RapidAPI fallback).

### 4.2 UI/UX Aesthetics & Design Principles
- **Aesthetic**: Modern Dark Theme (OLED Black `#0a0b10`, Charcoal Card `#141721`, Neon Violet `#8b5cf6` & TikTok Cyan/Pink accents).
- **Layout**:
  - Mobile: Bottom Navigation Bar (Feed, Categories, Analytics, Outreach CRM, Settings).
  - Desktop: Sidebar navigasi + responsive Masonry grid / Kanban view.
- **Micro-animations**: Smooth hover transitions, tactile card drag-and-drop untuk status CRM, skeleton loaders.

---

## 5. Roadmap Implementasi

### Phase 1 (MVP - Quick Win)
- Inisialisasi PWA project (Responsive, Fast, Installable).
- Fitur Simpan Link (Single URL & Bulk Import dari Notes).
- Auto-preview kartu (Thumbnail, Author info, Title, Audio, Embed player via oEmbed).
- Sistem Kategori & Custom Category Builder.
- Creator Card dasar & Status Outreach (`Saved`, `Contacted`, dll).
- Local storage (IndexedDB) & Export/Import JSON.

### Phase 2 (Deep Analytics & Trend Engine)
- Form input & auto-scraper untuk metrik engagement (Likes, Comments, Views, ER calculation).
- Trend Dashboard: Grafik sound terpopuler, hashtag cloud, kategori dengan rata-rata interaksi tertinggi.
- Filter tingkat lanjut & sortir multi-kriteria.

### Phase 3 (Advanced Outreach CRM & Cloud Sync)
- Kanban board untuk Talent Outreach Pipeline.
- Quick WhatsApp & Email templates generator (1-klik kirim penawaran/touch-up).
- Multi-device Cloud Sync (Supabase login).

---

## 6. Pertanyaan & Konfirmasi Kebutuhan (Next Steps)
Sebelum masuk ke tahap pembuatan kode web app:
1. **Penyimpanan Data Awal**: Apakah Anda ingin aplikasi ini berjalan **Local-First** dahulu (bisa langsung dipakai di browser HP/Laptop tanpa perlu setup database cloud), atau langsung dihubungkan ke **Cloud Database (Supabase/Firebase)**?
2. **Bulk Migration**: Apakah ada contoh format kumpulan link dari Notes Anda yang bisa kita siapkan script import-nya agar link yang sudah ada langsung masuk?
3. **Pilihan Framework**: Apakah Anda lebih suka **Vite + React** (sangat ringan, cepat, ideal untuk PWA) atau **Next.js**?
