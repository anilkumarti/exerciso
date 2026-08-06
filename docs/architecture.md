# Exerciso — System Architecture

**Version:** 1.0  
**Status:** Pre-implementation  
**Stack:** Next.js · TypeScript · Supabase · Tailwind CSS · Vercel

---

## Table of Contents

1. [Product Architecture](#1-product-architecture)
2. [Feature Map](#2-feature-map)
3. [Recommended Tech Stack](#3-recommended-tech-stack)
4. [High-Level System Architecture](#4-high-level-system-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Schema](#7-database-schema)
8. [Entity Relationships](#8-entity-relationships)
9. [API & Data Access](#9-api--data-access)
10. [Routing Architecture](#10-routing-architecture)
11. [Component Architecture](#11-component-architecture)
12. [State Management](#12-state-management)
13. [Workout Data Model](#13-workout-data-model)
14. [Exercise & Video Data Model](#14-exercise--video-data-model)
15. [Nutrition Data Model](#15-nutrition-data-model)
16. [Body & Measurement Data Model](#16-body--measurement-data-model)
17. [Progress & Analytics Architecture](#17-progress--analytics-architecture)
18. [AI Coach Architecture](#18-ai-coach-architecture)
19. [Dashboard UX Hierarchy](#19-dashboard-ux-hierarchy)
20. [Mobile UX Strategy](#20-mobile-ux-strategy)
21. [Security Strategy](#21-security-strategy)
22. [Performance Strategy](#22-performance-strategy)
23. [Important Edge Cases](#23-important-edge-cases)
24. [Recommended Folder Structure](#24-recommended-folder-structure)
25. [Implementation Roadmap](#25-implementation-roadmap)
26. [Architecture Risks & Mitigations](#26-architecture-risks--mitigations)
27. [Recommended Final Architecture](#27-recommended-final-architecture)

---

## 1. Product Architecture

### Core Mental Model

```
Plan → Workout → Log → Compare → Improve → Repeat
```

Every feature serves this loop. Nothing exists in isolation.

### Three Data Domains

The app produces data in three independent domains that the Dashboard and Analytics sections consume:

```
Training Domain          Nutrition Domain         Body Domain
─────────────────        ─────────────────        ─────────────────
Workout Plans            Daily Food Logs          Weight Entries
Workout Sessions         Macro Tracking           Body Measurements
Exercise Sets            Calorie Targets          Progress Photos
Personal Records         Meal History             Goal Tracking
Progressive Overload
```

### The Dashboard Rule

> The dashboard is a **consumer** of data, not a producer of it.  
> Build the data-generating features first. Build the dashboard last.

Build order: Workout → Nutrition → Body → PRs → Goals → **Dashboard**

### The Snapshot Principle

> Historical workout records must never be corrupted by future edits to plans or exercises.

When a workout session begins, the system takes **snapshots** of plan and exercise names. All historical display uses these snapshots. Analytics joins still use the stable `exercise_id` FK. This is the most important architectural decision in the schema.

---

## 2. Feature Map

### MVP (Ship First)

| Feature | Notes |
|---|---|
| Authentication (login / signup) | Supabase Auth |
| User profile & units preference | kg vs lbs, timezone |
| Exercise library (read-only, seeded) | 100+ exercises with videos |
| Workout plan creation (PPL / UL / custom) | Plan → Days → Exercises |
| Active workout session | Full-screen mobile experience |
| Set logging (weight + reps per set) | Optimistic UI, fast input |
| Rest timer (presets + custom) | Auto-start after set |
| Workout completion & summary | Volume, sets, duration |
| Workout history & calendar | Per-exercise history |
| PR detection & display | After each set |
| Progressive overload suggestions | Per-exercise, per session |
| Exercise substitution during workout | Bottom sheet search |
| Daily nutrition logging | Manual entry only |
| Macro tracking (P/C/F/cal) | Daily totals vs targets |
| Weight entries & trend chart | Single measurement per entry |
| Goal setting (weight, strength) | Simple target + date |
| Dashboard (consumes all above) | Built last |

### V2 (Post-MVP)

| Feature | Notes |
|---|---|
| Body measurements (full) | Chest, waist, arms, etc. |
| Progress photos | Supabase Storage |
| Food database (searchable) | User-created + USDA seed |
| Barcode scanning (nutrition) | Device camera |
| Workout templates (repeat prev) | Copy session as template |
| Estimated 1RM tracking over time | Chart per exercise |
| Analytics deep-dive screens | Per-muscle volume, etc. |
| Multiple active plans | e.g., strength + cardio |
| Custom exercise creation | User-added exercises |
| PWA offline support | IndexedDB sync |
| Weekly insights engine | Rule-based, data-driven |

### AI Phase (Future)

| Feature | Notes |
|---|---|
| AI Coach chat interface | Requires real stored data |
| Workout modification assistant | "I have 30 min" |
| Nutrition suggestions | Based on remaining macros |
| Plateau detection & solutions | 4+ weeks without progress |
| Smart plan generation | From goals + history |

---

## 3. Recommended Tech Stack

The proposed stack is largely correct. Additions and changes noted below.

### Keep (correct choices)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | Server Components eliminate client data-fetch waterfalls. Server Actions replace a REST API for writes. Route Groups for auth/protected layouts. |
| Language | **TypeScript** | Non-negotiable for a complex domain model with 20+ interrelated types. |
| Styling | **Tailwind CSS** | Mobile-first utility classes. No context switching. Works well with shadcn/ui. |
| Database | **Supabase PostgreSQL** | RLS handles per-user data security at the DB level. Built-in auth. Storage for photos. Realtime for future features. PostgREST for typed queries. |
| Deployment | **Vercel** | First-class Next.js support. Edge functions. Automatic preview deployments. |

### Add (missing from proposed stack)

| Addition | Why |
|---|---|
| **shadcn/ui** | Accessible, unstyled-by-default components (dialogs, sheets, inputs). Copies source into your project — no locked dependency. Essential for the exercise substitution bottom sheet, rest timer modal, etc. |
| **TanStack Query (React Query)** | Server state management: caching, background refetch, optimistic updates, stale-while-revalidate. Without this, you'll rewrite its features manually. |
| **Zustand** | Lightweight client state for the active workout session and rest timer. Persists to `localStorage` via middleware — if the browser crashes mid-workout, state survives. |
| **Zod** | Schema validation that works identically on client and server. Used in Server Actions and API routes to validate all inputs. |
| **Recharts** | Composable chart library. Smaller than Chart.js, easier to theme than D3 for this use case. Used for strength progression, weight trend, macro history. |
| **next-pwa** | Enables PWA mode: home screen installation, service worker, offline asset caching. Critical for gym use — unreliable WiFi should not break workout logging. |

### Avoid

| Avoid | Reason |
|---|---|
| Prisma ORM | Supabase's generated TypeScript types + PostgREST + Server Actions already provide a typed data layer. Prisma adds complexity without benefit here. |
| Redux / Zustand overkill | TanStack Query handles server state. Zustand handles the two pieces of genuine client state (session + timer). Nothing more is needed. |
| tRPC | Unnecessary abstraction over Server Actions for this scale. |

---

## 4. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S DEVICE                           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Next.js App (React 18 + TypeScript)                    │   │
│   │  ┌──────────────────┐  ┌──────────────────────────────┐ │   │
│   │  │  Server Components│  │  Client Components           │ │   │
│   │  │  (data fetching)  │  │  (workout UI, timer, charts) │ │   │
│   │  └──────────────────┘  └──────────────────────────────┘ │   │
│   │  ┌─────────────────────────────────────────────────────┐ │   │
│   │  │  Zustand (session state) + TanStack Query (cache)   │ │   │
│   │  └─────────────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────┘   │
│                    PWA Service Worker (offline cache)            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
                ┌───────────┴───────────┐
                │                       │
     ┌──────────▼──────────┐   ┌────────▼────────┐
     │   Vercel Edge/CDN   │   │   Supabase       │
     │   (Next.js SSR/ISR) │   │                  │
     │   Server Actions    │   │  ┌─────────────┐ │
     │   API Routes        │   │  │ PostgreSQL   │ │
     └─────────────────────┘   │  │ (+ RLS)     │ │
                               │  └─────────────┘ │
                               │  ┌─────────────┐ │
                               │  │ Auth (JWT)  │ │
                               │  └─────────────┘ │
                               │  ┌─────────────┐ │
                               │  │ Storage     │ │
                               │  │ (photos)    │ │
                               │  └─────────────┘ │
                               └──────────────────┘
                                        │ (AI Phase)
                               ┌────────▼────────┐
                               │  Anthropic API  │
                               │  (Claude)       │
                               └─────────────────┘
```

---

## 5. Frontend Architecture

### Rendering Strategy

| Page | Strategy | Reason |
|---|---|---|
| Dashboard | Server Component + Suspense streaming | Multiple independent data sources, SSR for initial paint |
| Exercise Library | Server Component + ISR | Global data, changes rarely, fast cold load |
| Exercise Detail | Server Component + ISR | Same as library |
| Workout History | Server Component | Per-user, SSR for instant first paint |
| Active Workout | Client Component | Real-time state: sets, timer, optimistic updates |
| Rest Timer | Client Component | Pure UI state, no server data |
| Nutrition Log | Server Component + Client mutations | Initial data SSR, entries added via optimistic UI |
| Analytics Charts | Client Component (lazy-loaded) | Chart library is heavy; defer until tab is active |

### Key Architectural Rule

> Server Components fetch data. Client Components manage interaction.  
> Never fetch data in a Client Component when a Server Component can do it.

### Navigation Model

- Bottom tab bar (mobile): Home · Workout · Nutrition · Body · More
- Active workout mode: full-screen overlay, tab bar hidden
- Desktop: sidebar navigation

---

## 6. Backend Architecture

### Data Write Path

All data writes go through **Next.js Server Actions** (not REST API routes). This gives:
- Type safety end-to-end (Zod validation in the action)
- No API layer to maintain
- Server-side Supabase client (service role or user token)
- Progressive enhancement (works without JS for non-workout forms)

```
Client Component
  → calls Server Action
    → validates with Zod
    → executes Supabase query (with RLS)
    → returns typed result
  → TanStack Query invalidates affected cache keys
  → UI updates optimistically or on revalidation
```

### When to Use API Routes Instead

- Webhooks (e.g., Stripe if payments added later)
- AI streaming responses (Server-Sent Events via `/api/ai/coach`)
- Background jobs triggered by cron

### Supabase Access Patterns

| Operation | Client Used | Why |
|---|---|---|
| Read in Server Component | `createServerClient()` (cookie-based) | SSR-safe, respects user session |
| Write in Server Action | `createServerClient()` (cookie-based) | Full RLS enforcement |
| Read in Client Component | `createBrowserClient()` | For live-updating data only |
| Admin operations | Service role client (server-only) | Exercise library seeding |

---

## 7. Database Schema

### Design Principles

1. **Snapshot pattern**: session tables store `_snapshot` fields for names/labels captured at session time. Historical records are immune to future edits.
2. **All weights stored in kg**. Convert to lbs on the frontend based on `profiles.weight_unit`.
3. **All timestamps stored in UTC**. Convert to user's timezone (`profiles.timezone`) on the frontend.
4. **Soft delete exercises**: never hard-delete an exercise from the global library. Set `is_archived = true`. Historical `session_exercises` rows still join correctly.
5. **UUIDs everywhere**: generated client-side before insert. Enables offline-first inserts that sync later.

---

### Global Tables (not user-specific)

#### `exercises`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` NOT NULL | e.g., "Barbell Bench Press" |
| `slug` | `text` UNIQUE NOT NULL | e.g., "barbell-bench-press" |
| `description` | `text` | |
| `category` | `text` | `compound` \| `isolation` |
| `difficulty` | `text` | `beginner` \| `intermediate` \| `advanced` |
| `is_unilateral` | `boolean` | true for single-arm/leg exercises |
| `recommended_sets_min` | `int` | |
| `recommended_sets_max` | `int` | |
| `recommended_reps_min` | `int` | |
| `recommended_reps_max` | `int` | |
| `recommended_rest_seconds` | `int` | |
| `instructions` | `jsonb` | `{step: number, text: string}[]` |
| `form_tips` | `text` | |
| `breathing_tips` | `text` | |
| `common_mistakes` | `jsonb` | `string[]` |
| `safety_notes` | `text` | |
| `is_archived` | `boolean` DEFAULT false | soft delete |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

#### `muscle_groups`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` NOT NULL | e.g., "Pectoralis Major" |
| `common_name` | `text` | e.g., "Chest" |
| `region` | `text` | `upper` \| `lower` \| `core` |

#### `exercise_muscles` (junction)

| Column | Type | Notes |
|---|---|---|
| `exercise_id` | `uuid` FK `exercises.id` | |
| `muscle_group_id` | `uuid` FK `muscle_groups.id` | |
| `role` | `text` | `primary` \| `secondary` |
| PK | `(exercise_id, muscle_group_id)` | |

#### `equipment_types`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` NOT NULL | e.g., "Barbell", "Cable Machine" |
| `category` | `text` | `free_weights` \| `machines` \| `bodyweight` \| `cardio` |

#### `exercise_equipment` (junction)

| Column | Type | Notes |
|---|---|---|
| `exercise_id` | `uuid` FK | |
| `equipment_id` | `uuid` FK | |
| `is_required` | `boolean` | false = optional/alternative piece of equipment |
| PK | `(exercise_id, equipment_id)` | |

#### `exercise_videos`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `exercise_id` | `uuid` FK `exercises.id` | |
| `provider` | `text` | `youtube` \| `vimeo` |
| `video_id` | `text` NOT NULL | YouTube/Vimeo video ID only, not full URL |
| `title` | `text` | |
| `thumbnail_url` | `text` | Cached thumbnail URL |
| `duration_seconds` | `int` | |
| `is_primary` | `boolean` DEFAULT false | Only one primary per exercise |

#### `exercise_alternatives` (self-referential junction)

| Column | Type | Notes |
|---|---|---|
| `exercise_id` | `uuid` FK `exercises.id` | |
| `alternative_exercise_id` | `uuid` FK `exercises.id` | |
| `reason` | `text` | e.g., "no barbell available", "easier variation" |
| PK | `(exercise_id, alternative_exercise_id)` | |

---

### User Profile

#### `profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK = `auth.users.id` | 1:1 with auth user |
| `display_name` | `text` | |
| `date_of_birth` | `date` | |
| `gender` | `text` | `male` \| `female` \| `other` \| `prefer_not_to_say` |
| `height_cm` | `numeric(5,1)` | |
| `weight_unit` | `text` DEFAULT `kg` | `kg` \| `lbs` — display only |
| `height_unit` | `text` DEFAULT `cm` | `cm` \| `ft_in` — display only |
| `timezone` | `text` DEFAULT `UTC` | IANA timezone string |
| `activity_level` | `text` | `sedentary` \| `lightly_active` \| `moderately_active` \| `very_active` |
| `fitness_goal` | `text` | `lose_weight` \| `gain_muscle` \| `maintain` \| `strength` |
| `weekly_workout_target` | `int` | |
| `daily_calorie_target` | `int` | |
| `daily_protein_target_g` | `int` | |
| `daily_carbs_target_g` | `int` | |
| `daily_fat_target_g` | `int` | |
| `starting_weight_kg` | `numeric(5,2)` | Set once on onboarding |
| `goal_weight_kg` | `numeric(5,2)` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

### Workout Plan Tables

#### `workout_plans`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK `auth.users.id` | |
| `name` | `text` NOT NULL | |
| `description` | `text` | |
| `split_type` | `text` | `push_pull_legs` \| `upper_lower` \| `full_body` \| `custom` |
| `days_per_week` | `int` | |
| `is_active` | `boolean` DEFAULT false | The currently-running plan |
| `is_archived` | `boolean` DEFAULT false | |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Constraint**: Only one plan per user can have `is_active = true`. Enforce with a partial unique index or trigger.

#### `workout_plan_days`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `plan_id` | `uuid` FK `workout_plans.id` ON DELETE CASCADE | |
| `name` | `text` NOT NULL | e.g., "Push Day", "Leg Day A" |
| `day_number` | `int` NOT NULL | Position in the plan cycle (1-N) |
| `notes` | `text` | |

#### `plan_exercises`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `plan_day_id` | `uuid` FK `workout_plan_days.id` ON DELETE CASCADE | |
| `exercise_id` | `uuid` FK `exercises.id` | |
| `order_index` | `int` NOT NULL | Display order |
| `target_sets` | `int` NOT NULL DEFAULT 3 | |
| `target_reps_min` | `int` NOT NULL DEFAULT 8 | |
| `target_reps_max` | `int` NOT NULL DEFAULT 12 | |
| `target_weight_kg` | `numeric(6,2)` | Nullable; user can leave blank |
| `target_rpe` | `int` | Rate of Perceived Exertion (1–10), optional |
| `rest_seconds` | `int` DEFAULT 90 | |
| `notes` | `text` | "Pause at bottom", etc. |
| `is_optional` | `boolean` DEFAULT false | |

---

### Workout Session Tables (The Core)

#### `workout_sessions`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Generated client-side before session starts |
| `user_id` | `uuid` FK `auth.users.id` | |
| `plan_id` | `uuid` FK `workout_plans.id` | Nullable (ad-hoc workouts allowed) |
| `plan_day_id` | `uuid` FK `workout_plan_days.id` | Nullable |
| `plan_day_name_snapshot` | `text` | **SNAPSHOT** — copied from `plan_days.name` at session start |
| `started_at` | `timestamptz` NOT NULL | |
| `completed_at` | `timestamptz` | NULL while in progress |
| `duration_seconds` | `int` | Computed on completion |
| `status` | `text` DEFAULT `in_progress` | `in_progress` \| `completed` \| `abandoned` |
| `total_volume_kg` | `numeric(10,2)` | Computed on completion: Σ(weight × reps) |
| `notes` | `text` | Post-workout notes |
| `perceived_difficulty` | `int` | 1–5, set at session end |
| `body_weight_at_time_kg` | `numeric(5,2)` | Auto-filled from latest weight entry |

#### `session_exercises`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `session_id` | `uuid` FK `workout_sessions.id` ON DELETE CASCADE | |
| `exercise_id` | `uuid` FK `exercises.id` | Kept for analytics joins even after exercise rename |
| `exercise_name_snapshot` | `text` NOT NULL | **SNAPSHOT** — copied from `exercises.name` at session start |
| `order_index` | `int` NOT NULL | |
| `plan_exercise_id` | `uuid` FK `plan_exercises.id` | Nullable; NULL for substitutions or ad-hoc |
| `notes` | `text` | |
| `was_substituted` | `boolean` DEFAULT false | |
| `substituted_for_exercise_id` | `uuid` FK `exercises.id` | What exercise this replaced |

#### `exercise_sets`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Generated client-side |
| `session_exercise_id` | `uuid` FK `session_exercises.id` ON DELETE CASCADE | |
| `set_number` | `int` NOT NULL | |
| `set_type` | `text` DEFAULT `working` | `warmup` \| `working` \| `drop_set` \| `failure` |
| `target_reps` | `int` | Pre-filled from plan |
| `target_weight_kg` | `numeric(6,2)` | Pre-filled from last session or plan |
| `actual_reps` | `int` | Logged by user |
| `actual_weight_kg` | `numeric(6,2)` | Logged by user |
| `rpe` | `int` | 1–10, optional |
| `is_completed` | `boolean` DEFAULT false | |
| `is_personal_record` | `boolean` DEFAULT false | Set server-side on completion |
| `completed_at` | `timestamptz` | |
| `rest_seconds_taken` | `int` | Actual rest duration taken |
| `notes` | `text` | |

---

### Personal Records

#### `personal_records`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK `auth.users.id` | |
| `exercise_id` | `uuid` FK `exercises.id` | |
| `pr_type` | `text` | `estimated_1rm` \| `max_weight` \| `max_reps_at_weight` \| `max_volume_session` |
| `value` | `numeric(10,3)` | The PR value |
| `unit` | `text` | `kg` \| `reps` \| `kg_reps` |
| `achieved_at` | `timestamptz` NOT NULL | |
| `session_id` | `uuid` FK `workout_sessions.id` | |
| `set_id` | `uuid` FK `exercise_sets.id` | Nullable (volume PR spans full session) |
| `previous_value` | `numeric(10,3)` | Previous record beaten |

**Design note**: One row per PR type per exercise. When a record is broken, update the existing row and store `previous_value`. Keep a separate `personal_record_history` table if you want the full timeline (optional V2).

---

### Nutrition Tables

#### `nutrition_logs`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK `auth.users.id` | |
| `date` | `date` NOT NULL | The calendar day |
| `calorie_target_override` | `int` | Overrides profile default for this day |
| `protein_target_override_g` | `int` | |
| `carbs_target_override_g` | `int` | |
| `fat_target_override_g` | `int` | |
| `notes` | `text` | |
| UNIQUE | `(user_id, date)` | One log per user per day |

#### `food_entries`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `nutrition_log_id` | `uuid` FK `nutrition_logs.id` ON DELETE CASCADE | |
| `meal_type` | `text` DEFAULT `snack` | `breakfast` \| `lunch` \| `dinner` \| `snack` \| `pre_workout` \| `post_workout` |
| `food_name` | `text` NOT NULL | |
| `brand` | `text` | |
| `quantity` | `numeric(8,2)` NOT NULL | |
| `serving_unit` | `text` NOT NULL DEFAULT `g` | `g` \| `oz` \| `ml` \| `cup` \| `piece` \| `scoop` |
| `calories` | `numeric(8,2)` NOT NULL | |
| `protein_g` | `numeric(7,2)` NOT NULL DEFAULT 0 | |
| `carbs_g` | `numeric(7,2)` NOT NULL DEFAULT 0 | |
| `fat_g` | `numeric(7,2)` NOT NULL DEFAULT 0 | |
| `fiber_g` | `numeric(7,2)` | |
| `sugar_g` | `numeric(7,2)` | |
| `sodium_mg` | `numeric(8,2)` | |
| `food_db_id` | `uuid` FK `food_database.id` | Nullable; manual entries won't have this |
| `logged_at` | `timestamptz` DEFAULT now() | |

#### `food_database`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` NOT NULL | |
| `brand` | `text` | |
| `barcode` | `text` | For future barcode scanning |
| `serving_size_g` | `numeric(8,2)` | Standard serving size in grams |
| `calories_per_100g` | `numeric(8,2)` | Store per-100g, calculate per serving on client |
| `protein_per_100g` | `numeric(7,2)` | |
| `carbs_per_100g` | `numeric(7,2)` | |
| `fat_per_100g` | `numeric(7,2)` | |
| `fiber_per_100g` | `numeric(7,2)` | |
| `source` | `text` DEFAULT `user_created` | `user_created` \| `usda` \| `open_food_facts` |
| `is_verified` | `boolean` DEFAULT false | |
| `created_by` | `uuid` FK `auth.users.id` | For user-created entries |
| `created_at` | `timestamptz` | |

---

### Body Tracking Tables

#### `weight_entries`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK `auth.users.id` | |
| `weight_kg` | `numeric(5,2)` NOT NULL | Always stored in kg |
| `recorded_at` | `timestamptz` NOT NULL DEFAULT now() | |
| `notes` | `text` | |

#### `body_measurements`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK `auth.users.id` | |
| `recorded_at` | `date` NOT NULL | |
| `chest_cm` | `numeric(5,1)` | |
| `waist_cm` | `numeric(5,1)` | |
| `hips_cm` | `numeric(5,1)` | |
| `left_arm_cm` | `numeric(5,1)` | |
| `right_arm_cm` | `numeric(5,1)` | |
| `left_thigh_cm` | `numeric(5,1)` | |
| `right_thigh_cm` | `numeric(5,1)` | |
| `left_calf_cm` | `numeric(5,1)` | |
| `right_calf_cm` | `numeric(5,1)` | |
| `neck_cm` | `numeric(5,1)` | |
| `shoulders_cm` | `numeric(5,1)` | |
| `body_fat_percentage` | `numeric(4,1)` | |
| `custom_measurements` | `jsonb` | `{label: string, value_cm: number}[]` |
| `notes` | `text` | |

#### `progress_photos`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK `auth.users.id` | |
| `storage_path` | `text` NOT NULL | Supabase Storage object path |
| `angle` | `text` DEFAULT `front` | `front` \| `back` \| `side_left` \| `side_right` \| `other` |
| `recorded_at` | `date` NOT NULL | |
| `measurement_id` | `uuid` FK `body_measurements.id` | Optionally linked to a measurement session |
| `notes` | `text` | |

---

### Goals

#### `goals`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK `auth.users.id` | |
| `goal_type` | `text` NOT NULL | `weight_loss` \| `weight_gain` \| `strength_pr` \| `consistency` \| `body_comp` \| `custom` |
| `title` | `text` NOT NULL | |
| `description` | `text` | |
| `target_value` | `numeric(10,2)` | |
| `current_value` | `numeric(10,2)` | Updated periodically |
| `unit` | `text` | `kg` \| `lbs` \| `reps` \| `workouts` \| `%` |
| `start_date` | `date` NOT NULL | |
| `target_date` | `date` | |
| `is_active` | `boolean` DEFAULT true | |
| `completed_at` | `timestamptz` | |
| `created_at` | `timestamptz` | |

---

## 8. Entity Relationships

```
auth.users
  │
  ├── profiles (1:1)
  │
  ├── goals (1:many)
  │
  ├── workout_plans (1:many)
  │     └── workout_plan_days (1:many)
  │           └── plan_exercises (1:many)
  │                 └── exercises (many:1) ←──────────────────┐
  │                                                            │
  ├── workout_sessions (1:many)                               │
  │     └── session_exercises (1:many)                        │
  │           ├── exercises (many:1) ─────────────────────────┘
  │           └── exercise_sets (1:many)
  │
  ├── personal_records (1:many)
  │     └── exercises (many:1)
  │
  ├── nutrition_logs (1:many, 1 per day)
  │     └── food_entries (1:many)
  │           └── food_database (many:1, optional)
  │
  ├── weight_entries (1:many)
  │
  ├── body_measurements (1:many)
  │     └── progress_photos (1:many)
  │
  └── (future) ai_conversations (1:many)

exercises (global)
  ├── exercise_muscles (many:many → muscle_groups)
  ├── exercise_equipment (many:many → equipment_types)
  ├── exercise_videos (1:many)
  └── exercise_alternatives (self-referential many:many)
```

### Critical FK Behaviors

| Relationship | ON DELETE |
|---|---|
| `plan_exercises` → `workout_plan_days` | CASCADE |
| `session_exercises` → `workout_sessions` | CASCADE |
| `exercise_sets` → `session_exercises` | CASCADE |
| `food_entries` → `nutrition_logs` | CASCADE |
| `session_exercises` → `exercises` | RESTRICT (never delete global exercises) |
| `personal_records` → `exercises` | RESTRICT |

---

## 9. API & Data Access

### Data Access Hierarchy

```
1. Server Component (page.tsx)
   └── Supabase server client → direct DB query
       Returns: typed data (via generated Supabase types)

2. Server Action (actions/workout.ts)
   └── Zod validation → Supabase server client → DB mutation
       Returns: { data, error } typed result
       Triggers: revalidatePath() or revalidateTag()

3. Client Component + TanStack Query
   └── queryFn calls Server Action or Supabase browser client
       Returns: cached, background-refreshed data

4. API Routes (app/api/)
   └── Used only for: AI streaming, webhooks
```

### Server Action Examples (not code — illustrative)

| Action | File | Description |
|---|---|---|
| `startWorkoutSession` | `actions/workout.ts` | Creates session row, snapshots plan day name |
| `logSet` | `actions/workout.ts` | Inserts/upserts set, checks for PR, returns updated set |
| `finishWorkout` | `actions/workout.ts` | Marks session complete, calculates total volume |
| `logFoodEntry` | `actions/nutrition.ts` | Upserts daily log, inserts food entry |
| `logWeight` | `actions/body.ts` | Inserts weight entry |
| `detectPR` | `actions/workout.ts` | Internal helper called within `logSet` |

### TanStack Query Key Structure

```
['exercises']                           — full library
['exercises', slug]                     — single exercise detail
['workout-plans', userId]               — user's plans
['workout-sessions', userId]            — session history
['workout-session', sessionId]          — single session detail
['nutrition-log', userId, date]         — daily nutrition
['weight-entries', userId]              — weight history
['personal-records', userId, exerciseId]
['dashboard-stats', userId]             — aggregated dashboard data
```

---

## 10. Routing Architecture

```
app/
├── (auth)/                          # Public routes
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── forgot-password/page.tsx
│
├── (app)/                           # Protected routes
│   ├── layout.tsx                   # Auth guard + bottom nav bar
│   ├── page.tsx                     # Dashboard (/)
│   │
│   ├── workout/
│   │   ├── page.tsx                 # Plans overview + today's card
│   │   ├── plans/
│   │   │   ├── new/page.tsx         # Create new plan
│   │   │   └── [planId]/page.tsx    # Plan detail + edit
│   │   ├── session/
│   │   │   ├── new/page.tsx         # Start workout (plan day selector)
│   │   │   ├── active/page.tsx      # ACTIVE WORKOUT (fullscreen, Client)
│   │   │   └── [sessionId]/page.tsx # Completed session summary
│   │   └── history/page.tsx         # Calendar + session list
│   │
│   ├── exercises/
│   │   ├── page.tsx                 # Library (search + filter)
│   │   └── [slug]/page.tsx          # Exercise detail (video, muscles, PRs)
│   │
│   ├── nutrition/
│   │   ├── page.tsx                 # Today's log (redirect → /nutrition/[today])
│   │   ├── [date]/page.tsx          # Daily log (YYYY-MM-DD)
│   │   └── history/page.tsx         # Trends calendar + charts
│   │
│   ├── body/
│   │   ├── page.tsx                 # Body tracking home
│   │   ├── measurements/
│   │   │   └── new/page.tsx         # Log measurements
│   │   └── photos/page.tsx          # Progress photo gallery
│   │
│   ├── analytics/
│   │   ├── page.tsx                 # Analytics home
│   │   ├── strength/page.tsx        # Per-exercise strength charts
│   │   ├── volume/page.tsx          # Training volume trends
│   │   └── nutrition/page.tsx       # Macro/calorie trends
│   │
│   └── settings/
│       ├── profile/page.tsx
│       └── goals/page.tsx
│
└── api/
    └── ai/
        └── coach/route.ts           # Streaming AI responses (future)
```

### Route Notes

- `/workout/session/active` is a single persistent URL — it reads active session from Zustand store. If no active session, redirects to `/workout`.
- `/nutrition/[date]` accepts `today` as an alias (redirect to actual date in middleware).
- All `(app)` routes check auth in `layout.tsx`. Unauthenticated users redirect to `/login`.

---

## 11. Component Architecture

### Component Categories

```
components/
├── ui/              # shadcn/ui base components (Button, Input, Sheet, Dialog, etc.)
├── layout/          # BottomNav, Sidebar, PageHeader, MobileTopBar
├── workout/         # Domain-specific workout components
├── exercises/       # Exercise library and detail components
├── nutrition/       # Nutrition logging components
├── body/            # Weight chart, measurement form, photo gallery
├── analytics/       # Chart wrappers, stat tiles
├── dashboard/       # Dashboard widgets (consume all domains)
└── shared/          # PRBadge, LoadingSkeleton, EmptyState, ErrorBoundary
```

### Key Components

| Component | Type | Responsibility |
|---|---|---|
| `ActiveWorkoutScreen` | Client | Full-screen session UI. Exercises list, set logger, progress. |
| `SetLogger` | Client | Single set row: target display, actual input, complete button. Most-used component in the app. |
| `RestTimerOverlay` | Client | Fixed-position overlay during workout. Presets + custom input + start/pause/reset. |
| `ExerciseSubstitutionSheet` | Client | Bottom sheet with exercise search. Replaces current exercise in session. |
| `WorkoutSummaryCard` | Server/Client | Post-session: volume, duration, PRs achieved, sets completed. |
| `ExerciseDetailPage` | Server | Video embed, muscle diagram, instructions, user's PR + history. |
| `SetHistoryTable` | Server | Previous sets for this exercise in this user's history. |
| `ProgressChart` | Client | Recharts wrapper. Props: `data`, `metric`, `timeRange`. |
| `MacroRing` | Client | SVG donut for protein/carbs/fat breakdown. |
| `WeightTrendSparkline` | Client | Small weight trend for dashboard. |
| `DashboardInsights` | Server | Computes and renders 3-5 data-driven insight strings. |
| `NutritionEntryForm` | Client | Quick food entry. Name, macros, meal type. |
| `PRBadge` | Client | Animated badge shown when a set breaks a PR. |

### Set Logger — The Core Component

This component handles >50% of the app's actual usage and must be designed with extreme care:

- Displays: Set number · Target (weight × reps) · Actual inputs · Complete button
- Inputs: Large tap targets. Weight and reps use number inputs with `+` / `−` increment buttons. No keyboard for integers — custom numpad optional.
- Completion: Single tap → marks set complete → triggers rest timer → moves focus to next set.
- State: Managed in Zustand `useWorkoutSessionStore`. Each keypress persists immediately.

---

## 12. State Management

### Three Layers

| Layer | Tool | What it manages |
|---|---|---|
| Server state | **TanStack Query** | Data from Supabase: exercises, sessions, nutrition logs, weight history. Cached, background-refreshed. |
| Client state (persistent) | **Zustand + persist middleware** | Active workout session, rest timer, user preferences. Survives browser refresh and crash. |
| UI state | **React `useState`** | Modal open/close, accordion state, tab selection. Not shared, not persisted. |

### Zustand Stores

#### `useWorkoutSessionStore` (persisted to `localStorage`)

```typescript
// Shape — not implementation
{
  sessionId: string | null
  planId: string | null
  planDayId: string | null
  planDayName: string | null
  startedAt: Date | null
  status: 'idle' | 'active' | 'completing'
  exercises: SessionExercise[]          // full exercise list with sets
  currentExerciseIndex: number
  
  // Actions
  startSession(plan, day): Promise<void>
  logSet(exerciseId, setId, data): void  // optimistic update → sync to DB
  completeSet(exerciseId, setId): Promise<void>
  substituteExercise(index, newExercise): void
  finishWorkout(notes, difficulty): Promise<void>
  abandonWorkout(): void
  resetSession(): void
}
```

**Why persist to `localStorage`?** If the user's phone screen locks, the app is backgrounded, or the browser tab crashes mid-workout, the entire session state survives and can be resumed. DB writes happen optimistically; if they fail, the local state is the source of truth until reconnected.

#### `useRestTimerStore` (not persisted — acceptable loss)

```typescript
{
  isRunning: boolean
  duration: number          // target seconds
  remaining: number         // seconds left
  startedAt: Date | null
  presets: number[]         // [60, 90, 120, 180]
  
  // Actions
  start(durationSeconds: number): void
  pause(): void
  reset(): void
  setPreset(seconds: number): void
}
```

#### `usePreferencesStore` (persisted)

```typescript
{
  weightUnit: 'kg' | 'lbs'
  defaultRestSeconds: number
  autoStartTimer: boolean
  theme: 'dark' | 'light' | 'system'
}
```

---

## 13. Workout Data Model

### Session Lifecycle

```
1. User selects plan day → "Start Workout"
   → Generate sessionId (UUID) client-side
   → Write workout_sessions (status: 'in_progress')
   → Copy plan_exercises into Zustand store as session exercises
   → SNAPSHOT: copy exercise names into session_exercises rows

2. For each exercise:
   → Pre-fill target weight from: last session actual weight (or plan target if none)
   → Pre-fill target reps from plan
   → User logs actual weight + reps per set
   → Each set logged: write exercise_sets row, check for PR
   → PR detected: write personal_records, flag set as is_personal_record = true

3. User taps "Finish Workout"
   → Compute: duration_seconds, total_volume_kg
   → Write completed_at, status = 'completed'
   → Clear Zustand session store
   → Show WorkoutSummaryCard

4. Workout session is now immutable (no edits to completed sessions)
```

### Progressive Overload Algorithm

> The goal is intelligent progression, not mechanical weight increases every session.

**At session start (pre-fill logic):**
1. For each plan exercise, query: last completed `workout_session` containing this `exercise_id`.
2. For each set in that previous session, retrieve `actual_weight_kg` and `actual_reps`.
3. Pre-fill `target_weight_kg` and `target_reps` from those actual values.
4. If no previous session exists: use `plan_exercises.target_weight_kg` or blank.

**After an exercise is complete (progression suggestion):**
1. Count total working sets (exclude `warmup`, `failure`).
2. Check: did the user complete ALL working sets at or above `target_reps_max`?
   - **Yes, all reps hit**: suggest `+2.5 kg` (upper body) or `+5 kg` (lower body) next session.
   - **Yes, but short on reps in ≥1 set**: keep same weight, target same reps next time.
   - **No, significant failure**: suggest same or lighter weight, reduce reps target slightly.
3. Never suggest >5 kg increase per session on any exercise.

**Estimated 1RM tracking:**
- After each completed working set: `estimated_1RM = weight × (1 + reps / 30)` (Epley formula).
- Compare against stored `personal_records` row for this exercise, `pr_type = 'estimated_1rm'`.
- If new value > stored value: update record, flag set `is_personal_record = true`.

**PR Types Tracked Per Exercise:**
- `estimated_1rm` — calculated from any set via Epley formula
- `max_weight` — heaviest single weight lifted for ≥1 rep
- `max_reps_at_weight` — most reps ever logged at a given weight bucket
- `max_volume_session` — highest single-session volume for this exercise

---

## 14. Exercise & Video Data Model

### Exercise Data Sources

The exercise library is **seeded data** — populated once via a seed script before launch. Users cannot edit it (only create custom exercises in V2). This ensures quality and consistency.

**MVP Seed Target**: 100+ exercises covering all major movement patterns:
- Horizontal push/pull (bench, row)
- Vertical push/pull (press, pulldown)
- Hip hinge (deadlift, RDL)
- Knee-dominant (squat, lunge)
- Core (planks, ab work)
- Isolation (curl, extension, lateral raise)

### Video Embedding Strategy

```
Storage: Store video_id only (e.g., "dQw4w9WgXcQ"), not full URLs.
         Provider field allows future multi-provider support.

Display: Show thumbnail image first (fast load, no iframe weight).
         On user tap: swap to <iframe> embed.
         URL pattern: https://www.youtube-nocookie.com/embed/{video_id}
         (Privacy-enhanced mode — no YouTube tracking cookies)

Thumbnail: https://img.youtube.com/vi/{video_id}/maxresdefault.jpg
           Cached in Supabase Storage if needed.

Fallback: If video fails to load → show link to video, never blank space.
```

### Exercise Detail Page Data Shape

When rendering an exercise detail page, a single Supabase query (with joins) returns:

```
exercise: {
  name, slug, category, difficulty, is_unilateral,
  description, instructions, form_tips, breathing_tips,
  common_mistakes, safety_notes,
  recommended_sets, recommended_reps, recommended_rest,
  
  muscles: { primary: MuscleGroup[], secondary: MuscleGroup[] },
  equipment: EquipmentType[],
  videos: ExerciseVideo[],           // primary video first
  alternatives: Exercise[],          // denormalized names + slugs
  
  // User-specific (requires auth)
  userPR: PersonalRecord | null,     // their best for this exercise
  recentHistory: SessionSet[]        // last 5 sessions for this exercise
}
```

---

## 15. Nutrition Data Model

### Daily Log Pattern

One `nutrition_logs` row per user per day. All `food_entries` for that day attach to that row. The daily log row also stores optional target overrides (e.g., "rest day — lower calories").

### Macro Computation

Macros are **stored per entry, not aggregated**. Totals are computed at query time:

```sql
SELECT
  SUM(calories)   AS total_calories,
  SUM(protein_g)  AS total_protein,
  SUM(carbs_g)    AS total_carbs,
  SUM(fat_g)      AS total_fat
FROM food_entries
WHERE nutrition_log_id = $1
```

Storing pre-computed totals would require triggers and create stale-data risk. Compute at query time; cache via TanStack Query.

### Calorie Target Resolution

```
effective_target = nutrition_log.calorie_target_override 
                   ?? profile.daily_calorie_target
```

Same pattern applies to macro targets. The override allows per-day adjustments (training vs. rest days).

### Food Entry Flow

**MVP (manual entry)**:
1. User taps "Add Food"
2. Enters: name, quantity (g), calories, protein, carbs, fat
3. Selects meal type (breakfast, lunch, etc.)
4. Submits → creates `food_entry`

**V2 (food database)**:
1. User searches `food_database`
2. Selects item → pre-fills macros
3. User adjusts quantity → macros recalculate client-side
4. Submits → creates `food_entry` with `food_db_id` reference

---

## 16. Body & Measurement Data Model

### Weight Tracking

- Multiple entries per day are allowed (morning, evening).
- For charting: use one value per day. Strategy: earliest entry per day (`MIN(recorded_at)`).
- For the dashboard "current weight" widget: use the most recent entry (`MAX(recorded_at)`).

### Measurement Sessions

`body_measurements` records measurements taken at the same point in time. A user doesn't need to fill every column — measure what's accessible. `custom_measurements` jsonb handles any extra tracked metrics.

Progress photos are optionally linked to a measurement session via `measurement_id`. This lets the user view measurements and photos together in a single "progress check-in" view.

### Progress Photo Storage

```
Supabase Storage bucket: progress-photos (private)
Path structure: {user_id}/{year}/{month}/{uuid}.jpg

Access: signed URLs with short expiry (1 hour)
        Generated server-side in Server Actions
        Never expose raw storage paths to client
```

Photos are private to the user. RLS on the `progress_photos` table prevents other users from seeing metadata. Storage bucket policies prevent unauthenticated access.

---

## 17. Progress & Analytics Architecture

### Analytics Query Strategy

Dashboard and analytics data comes from aggregations over the core tables. For MVP, run these as regular Supabase queries. If performance degrades (sessions > 500, food entries > 5000), promote hot queries to **Postgres views** or **materialized views**.

### Key Aggregations

| Metric | Source Tables | Computed As |
|---|---|---|
| Weight trend | `weight_entries` | Weight vs. date, 7-day moving average |
| Workout frequency | `workout_sessions` | COUNT per week, status = 'completed' |
| Workout streak | `workout_sessions` | Consecutive days with completed session |
| Training volume | `exercise_sets` + `session_exercises` | Σ(actual_weight × actual_reps) per session |
| Strength progression | `exercise_sets` + `session_exercises` | Estimated 1RM over time per exercise |
| Protein average | `food_entries` + `nutrition_logs` | AVG(protein_g) per day, rolling 7d/30d |
| Calorie adherence | `food_entries` + `nutrition_logs` | Days where actual ≤ target, as % |
| PR timeline | `personal_records` | PRs by exercise over time |
| Volume per muscle | `exercise_sets` + `exercise_muscles` | Σ volume JOIN muscle groups |

### Insights Engine (rule-based, MVP)

Before AI is integrated, the dashboard generates insights from simple rules applied to the aggregations above:

```
IF avg_weekly_workouts < weekly_target:
  → "You've hit {n} of {target} workouts this week."

IF protein_7d_avg < daily_protein_target * 0.85:
  → "Your protein has averaged {x}g this week. Target is {t}g."

IF strength_progression[exercise].last_4_weeks.delta == 0:
  → "{Exercise} hasn't moved in 4 weeks. Consider changing rep scheme."

IF weight_trend.direction == 'down' AND goal_type == 'weight_loss':
  → "You're down {n}kg in the last month. On track."

IF latest_pr.achieved_at within last 7 days:
  → "New PR on {exercise}: {value}kg."
```

These rules live in `lib/insights/rules.ts` and are evaluated in a Server Component.

### Suggested Indexes

```sql
-- Workout history queries
CREATE INDEX idx_workout_sessions_user_date 
  ON workout_sessions(user_id, started_at DESC);

-- Per-exercise analytics
CREATE INDEX idx_session_exercises_exercise 
  ON session_exercises(exercise_id, session_id);

-- Nutrition queries
CREATE INDEX idx_food_entries_log_id 
  ON food_entries(nutrition_log_id);

CREATE INDEX idx_nutrition_logs_user_date 
  ON nutrition_logs(user_id, date DESC);

-- Weight trend queries
CREATE INDEX idx_weight_entries_user_date 
  ON weight_entries(user_id, recorded_at DESC);

-- PR lookups
CREATE INDEX idx_personal_records_user_exercise 
  ON personal_records(user_id, exercise_id, pr_type);
```

---

## 18. AI Coach Architecture

> This is a future phase. Design the data layer now so AI can be plugged in later without schema changes.

### Context Architecture

The AI's value comes entirely from accessing **real user data**, not general knowledge. The context pipeline:

```
User query
  → Classify query type (workout advice / nutrition / progress / general)
  → Select relevant context:
      workout_context_view    — last 30 days of sessions + per-exercise progression
      nutrition_context_view  — 7-day macro averages, recent log
      body_context_view       — weight trend, current measurements
      goals_context           — active goals + current progress
  → Format as structured prompt context
  → Call Claude API (claude-sonnet-4-6 or later)
  → Stream response to user
  → Store in ai_conversations
```

### Database additions for AI phase

```sql
-- Conversation history
CREATE TABLE ai_conversations (
  id          uuid PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id),
  role        text NOT NULL,   -- 'user' | 'assistant'
  content     text NOT NULL,
  context_snapshot jsonb,      -- data context sent to AI for this turn
  created_at  timestamptz DEFAULT now()
);

-- Rate limiting
CREATE TABLE ai_usage (
  user_id     uuid REFERENCES auth.users(id),
  date        date NOT NULL,
  query_count int DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
```

### Database Views for AI Context

Build these as Postgres views (non-materialized — always fresh):

```sql
-- workout_context_view: last 30 days, grouped by exercise
-- Returns: exercise name, sessions count, weight progression array, current estimated 1RM

-- nutrition_context_view: 14-day rolling average
-- Returns: avg_calories, avg_protein_g, avg_carbs_g, avg_fat_g, adherence_pct

-- body_context_view: current state
-- Returns: latest_weight, start_weight, goal_weight, weight_delta, trend_direction
```

### AI System Prompt Principle

> The assistant must always cite specific numbers from the user's data. It must refuse to give generic advice when specific data is available. If data is insufficient for a question, it must say so rather than fabricating general guidance.

---

## 19. Dashboard UX Hierarchy

The dashboard answers one question: **"Am I actually progressing?"**

It is not a collection of charts. It is an opinionated summary that surfaces the most important signal first.

### Information Hierarchy (top to bottom)

**Level 1 — Action Prompt** (visible without scrolling)
- "Today is Push Day" + Start button
- Or: "Rest day — logged {n} calories"
- Or: "No plan active — Create your first plan"

**Level 2 — Status Snapshot** (current week)
- Workouts completed vs. target (e.g., "3 / 4 this week")
- Today's calories remaining
- Current weight vs. goal weight
- Active workout streak

**Level 3 — Strength Signal** (the most important progress indicator)
- Recent PRs (last 7 days)
- Strength trend for 3 "key lifts" (user-configurable, defaults to bench/squat/deadlift)
- Mini sparklines — up/down/flat indicator per lift

**Level 4 — Nutrition Summary**
- Weekly protein average vs. target
- Calorie adherence % (days on-target / 7)
- Biggest macro deficit this week

**Level 5 — Body Progress**
- Weight chart (30-day, with trend line)
- Body weight delta since start

**Level 6 — Insights** (computed by rules engine)
- 3–5 single-sentence observations
- Only shown if data is sufficient (not shown for new users)

**Level 7 — Goal Cards**
- Active goals with progress bars
- Estimated completion date

### Dashboard Data Loading Strategy

Use `<Suspense>` streaming with independent suspense boundaries per level:
- Level 1 loads immediately (from Zustand store — no fetch)
- Level 2 loads in parallel with Level 3, 4, 5
- Level 6 (insights) loads last — it depends on all other data

---

## 20. Mobile UX Strategy

The workout experience is the highest-priority mobile surface. Every design decision here optimizes for one-handed use in a gym.

### Navigation

- **Bottom tab bar**: Home · Workout · Nutrition · Body · More (≥5 items go in More)
- Tab icons: large, labeled, thumb-reachable
- **Active workout**: bottom bar hidden. Full-screen. Exit via explicit "Finish" button.
- Header back button: top-left (acceptable reach — not frequently used in workout mode)

### Active Workout Screen Layout

```
┌──────────────────────────────┐
│ Push Day    ⏱ 00:42:11       │  ← Timer + day name, small
├──────────────────────────────┤
│ [REST TIMER BANNER if active]│  ← Sticky, tap to dismiss
├──────────────────────────────┤
│                              │
│  Bench Press          3 / 4  │  ← Exercise name + set progress
│  ──────────────────────────  │
│  Set 1  80kg × 10  ✓         │
│  Set 2  80kg × 10  ✓         │
│  Set 3  80kg × 8   ✓         │
│  ┌─────────────────────────┐ │
│  │Set 4  [80] kg  [10] reps│ │  ← Active set — large targets
│  │        −  +      −  +   │ │  ← Increment/decrement buttons
│  │  ████████  LOG SET  ████│ │  ← Large CTA button
│  └─────────────────────────┘ │
│                              │
│  ↓ Next: Incline DB Press    │  ← Upcoming exercise preview
│                              │
└──────────────────────────────┘
```

### Input Strategy

| Input | Mobile Pattern |
|---|---|
| Weight | Number input + `−2.5` / `+2.5` buttons on each side |
| Reps | Number input + `−1` / `+1` buttons |
| Notes | Full keyboard (optional, secondary action) |
| Food quantity | Number input + common increments (e.g., 50g, 100g buttons) |
| Date selection | Native date picker |
| Exercise search | Full-screen search with keyboard |

### Touch Targets

All interactive elements: minimum **48px × 48px**. Set completion button: full-width, minimum 56px tall.

### Rest Timer

- Appears as a **sticky banner** at the top of the screen immediately after set completion
- Shows large countdown, preset buttons, and a dismiss button
- Background: accent color pulse animation to draw attention
- Haptic feedback on completion (where available via Vibration API)
- Persists across exercise scrolling — the timer must not disappear when user scrolls

### Performance Budget (Mobile)

- First Contentful Paint on `/workout/session/active`: < 1.5s on 4G
- Set log tap → visual confirmation: < 100ms (optimistic update, no wait for DB)
- Page transitions: < 300ms

---

## 21. Security Strategy

### Supabase Row Level Security (RLS)

RLS is the primary security layer. Every user-data table has a policy that enforces `auth.uid() = user_id`.

**Standard pattern** (applied to all user tables):

```sql
-- Enable RLS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users see own sessions"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users insert own sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users update own sessions"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id);
```

**Exercise library** (global, read-only by authenticated users):

```sql
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (is_archived = false);
-- No INSERT/UPDATE/DELETE for regular users
```

**Progress photos** (private, served via signed URLs):

```sql
-- Storage bucket: private (no public access)
-- Signed URLs generated server-side with short expiry
-- RLS on progress_photos table prevents metadata leaks
```

### Client vs Server Key Usage

| Key | Where Used | Never |
|---|---|---|
| Supabase `anon` key | Client components, browser client | — |
| Supabase `service_role` key | Server Actions, Server Components | Never in client bundle |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | — |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (`.env.local`) | Never `NEXT_PUBLIC_` prefix |

### Authentication

- Supabase Auth (JWT-based, stored in cookies via `@supabase/ssr`)
- Session refresh handled automatically by Supabase client
- Middleware checks auth on every `(app)` route — redirects to `/login` if no session
- Password reset via Supabase's built-in email flow

### Additional Security

- All user inputs validated with Zod before any DB operation
- Progress photo filenames: UUIDs only, never user-provided
- No raw SQL in Server Actions — parameterized Supabase query builder throughout
- Content Security Policy headers via Next.js config (restricts video embeds to `youtube-nocookie.com`)

---

## 22. Performance Strategy

### Core Principles

1. **Optimistic UI for set logging** — the most-used interaction. Update UI immediately; sync to DB in background. If DB write fails, roll back with toast notification.
2. **Server Components for all data reads** — eliminates client-side data fetch waterfalls. The page arrives pre-populated.
3. **Lazy-load heavy components** — Recharts, photo gallery, AI chat. Use `next/dynamic` with loading fallback.
4. **Cache aggressively** — TanStack Query with appropriate stale times per data type.

### Stale Time Strategy

| Data | Stale Time | Why |
|---|---|---|
| Exercise library | 24 hours | Changes rarely; seed data |
| Workout plans | 5 minutes | Changes infrequently |
| Active session | 0 (no cache) | Always fresh |
| Dashboard stats | 5 minutes | Expensive query, data moves slowly |
| Nutrition log | 1 minute | Changes frequently during day |
| Weight entries | 5 minutes | Usually entered once daily |
| Personal records | 10 minutes | Only changes during workout |

### PWA Offline Strategy

Using `next-pwa` with a custom service worker:

- **Precache**: app shell, core JS/CSS chunks, exercise library pages (static)
- **Runtime cache**: exercise images, videos (cache-first)
- **Network-first**: all API/data requests (fall back to cache if offline)
- **Offline workout logging**: if DB write fails (offline), write to IndexedDB queue. Service worker syncs when connection restores via Background Sync API.
- **Offline indicator**: banner shown when navigator.onLine === false

### Image & Video Optimization

- All images: `next/image` with automatic WebP conversion and blur placeholder
- Exercise videos: thumbnail shown first (fast load); iframe injected only on user tap
- Progress photos: lazy-loaded with Intersection Observer
- Muscle diagrams: SVG inline (no external request)

### Bundle Optimization

- `next/dynamic` for all chart components (Recharts is ~300kB)
- `next/dynamic` for AI chat interface
- Route-based code splitting (default with App Router)
- No barrel-file re-exports (prevents tree-shaking failures)

---

## 23. Important Edge Cases

| Edge Case | How It's Handled |
|---|---|
| Browser crash mid-workout | Zustand persist middleware saves state to `localStorage` on every change. Session `status = 'in_progress'` in DB. On app reload, detect active session and offer to resume. |
| Same exercise twice in one session | `session_exercises.order_index` differentiates them. Both exist as separate rows; sets attach to their respective `session_exercise_id`. |
| User renames a workout plan day | `workout_sessions.plan_day_name_snapshot` is already written. Old sessions unaffected. |
| User changes target reps in plan | `session_exercises` rows are already committed with `exercise_name_snapshot`. `exercise_sets` have `target_reps` baked in at session start. No retroactive change. |
| Exercise deleted from global library | `exercises.is_archived = true` (soft delete only). `session_exercises` rows retain their `exercise_id` FK and `exercise_name_snapshot`. Analytics still work. |
| User repeats a previous workout | Create new `workout_session`. Copy `session_exercises` structure from old session as template. Do NOT copy `actual_reps`/`actual_weight_kg`. Pre-fill targets from old session's actuals. |
| Bodyweight exercises | `actual_weight_kg` = body weight + additional weight (0 for pure BW). `session.body_weight_at_time_kg` provides the reference. Progressive overload applies to the added weight or rep count. |
| Drop sets | `set_type = 'drop_set'`. Lower weight than previous set is expected — progressive overload logic skips these sets when computing progression suggestions. |
| Failed sets | `is_completed = false`. `actual_reps` may still be recorded (for partial failure tracking). Progression algorithm counts failed sets as not hitting target. |
| PR detected but user edits the set | Re-run PR check on any edit to `exercise_sets.actual_weight_kg` or `actual_reps`. Update or reverse `is_personal_record` accordingly. |
| Weight unit preference changed (kg ↔ lbs) | All data stored in kg. All display converts on client: `kg_value * 2.20462`. No migration needed. |
| Timezone changes | All DB timestamps are UTC. Display converts to `profiles.timezone`. Historical data remains correct — it's still the right point in time. |
| Internet loss mid-workout | Zustand state is in memory + localStorage. Queue DB writes to IndexedDB. Service worker Background Sync API submits them when connection restores. Show offline indicator. |
| No data yet (new user) | Dashboard shows onboarding prompts, not empty chart states. Each widget has an `EmptyState` variant with a CTA to create the relevant data. |
| Multiple weight entries in one day | All entries are stored. Dashboard uses latest entry for "current weight". Charts use all points (shows intraday variance) or one per day (configurable). |
| Very long rest times | `rest_seconds_taken` can be very large. Analytics that use average rest time should cap outliers (e.g., > 20 min = abandoned, exclude from averages). |

---

## 24. Recommended Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx               # Auth guard, bottom nav, session context
│   │   ├── page.tsx                 # Dashboard
│   │   ├── workout/
│   │   │   ├── page.tsx
│   │   │   ├── plans/new/page.tsx
│   │   │   ├── plans/[planId]/page.tsx
│   │   │   ├── session/new/page.tsx
│   │   │   ├── session/active/page.tsx
│   │   │   ├── session/[sessionId]/page.tsx
│   │   │   └── history/page.tsx
│   │   ├── exercises/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── nutrition/
│   │   │   ├── page.tsx
│   │   │   ├── [date]/page.tsx
│   │   │   └── history/page.tsx
│   │   ├── body/
│   │   │   ├── page.tsx
│   │   │   ├── measurements/new/page.tsx
│   │   │   └── photos/page.tsx
│   │   ├── analytics/
│   │   │   ├── page.tsx
│   │   │   ├── strength/page.tsx
│   │   │   ├── volume/page.tsx
│   │   │   └── nutrition/page.tsx
│   │   └── settings/
│   │       ├── profile/page.tsx
│   │       └── goals/page.tsx
│   ├── api/
│   │   └── ai/
│   │       └── coach/route.ts
│   ├── layout.tsx                   # Root layout: providers, fonts
│   └── globals.css
│
├── components/
│   ├── ui/                          # shadcn/ui components (copied, not imported)
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── MobileHeader.tsx
│   │   └── PageWrapper.tsx
│   ├── workout/
│   │   ├── ActiveWorkoutScreen.tsx
│   │   ├── SetLogger.tsx
│   │   ├── RestTimerOverlay.tsx
│   │   ├── ExerciseSubstitutionSheet.tsx
│   │   ├── WorkoutSummaryCard.tsx
│   │   ├── PlanCard.tsx
│   │   └── PRBadge.tsx
│   ├── exercises/
│   │   ├── ExerciseCard.tsx
│   │   ├── ExerciseVideoPlayer.tsx
│   │   ├── MuscleGroupBadges.tsx
│   │   └── SetHistoryTable.tsx
│   ├── nutrition/
│   │   ├── NutritionEntryForm.tsx
│   │   ├── MacroRing.tsx
│   │   ├── FoodEntryCard.tsx
│   │   └── MacroProgressBar.tsx
│   ├── body/
│   │   ├── WeightEntryForm.tsx
│   │   ├── WeightTrendChart.tsx
│   │   └── MeasurementForm.tsx
│   ├── analytics/
│   │   ├── StrengthProgressionChart.tsx
│   │   ├── VolumeChart.tsx
│   │   └── StatTile.tsx
│   ├── dashboard/
│   │   ├── ActionPromptCard.tsx
│   │   ├── WeeklySnapshotRow.tsx
│   │   ├── StrengthSignalCard.tsx
│   │   ├── NutritionSummaryCard.tsx
│   │   ├── WeightProgressCard.tsx
│   │   ├── InsightsPanel.tsx
│   │   └── GoalProgressCard.tsx
│   └── shared/
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client (singleton)
│   │   ├── server.ts                # Server client factory
│   │   └── middleware.ts            # Auth middleware helper
│   ├── actions/
│   │   ├── workout.ts               # startSession, logSet, finishWorkout
│   │   ├── nutrition.ts             # logFood, deleteFood
│   │   ├── body.ts                  # logWeight, logMeasurements
│   │   ├── exercises.ts             # createCustomExercise (V2)
│   │   └── ai.ts                   # AI context assembly (future)
│   ├── queries/
│   │   ├── workout.ts               # TanStack Query hooks for workout data
│   │   ├── nutrition.ts
│   │   ├── body.ts
│   │   ├── exercises.ts
│   │   └── dashboard.ts
│   ├── utils/
│   │   ├── progressive-overload.ts  # Suggestion algorithm
│   │   ├── pr-detection.ts          # PR check logic
│   │   ├── one-rm.ts                # Epley formula + variations
│   │   ├── unit-conversion.ts       # kg ↔ lbs, cm ↔ ft/in
│   │   ├── insights.ts              # Rules engine for dashboard insights
│   │   └── dates.ts                 # Date formatting, timezone helpers
│   └── validations/
│       ├── workout.ts               # Zod schemas for workout actions
│       ├── nutrition.ts
│       └── body.ts
│
├── stores/
│   ├── workout-session.ts           # Zustand (persisted)
│   ├── rest-timer.ts                # Zustand (in-memory)
│   └── preferences.ts              # Zustand (persisted)
│
├── types/
│   ├── database.ts                  # Supabase generated types (npx supabase gen types)
│   ├── workout.ts                   # App-level workout types
│   ├── nutrition.ts
│   ├── analytics.ts
│   └── insights.ts
│
├── hooks/
│   ├── useRestTimer.ts
│   ├── useProgressiveOverload.ts
│   ├── useExercisePR.ts
│   └── useOfflineSync.ts
│
└── middleware.ts                    # Auth route protection
```

---

## 25. Implementation Roadmap

### Phase 1 — Foundation (Week 1–2)
Set up everything that everything else depends on.

- [ ] Next.js 14 + TypeScript + Tailwind + shadcn/ui scaffold
- [ ] Supabase project: auth, DB, storage buckets
- [ ] Database migrations: all tables from this schema
- [ ] Supabase RLS policies on all user tables
- [ ] Supabase TypeScript type generation (`supabase gen types`)
- [ ] Auth: login, signup, session middleware
- [ ] Profile creation on signup (via Supabase trigger)
- [ ] Exercise library: seed script with 50–100 exercises + YouTube IDs
- [ ] Exercise browse page (list + search)
- [ ] Exercise detail page (video, muscles, instructions)
- [ ] Bottom navigation shell

### Phase 2 — Workout Engine (Week 3–5)
The core of the application.

- [ ] Workout plan creation UI (plan → days → exercises)
- [ ] Plan editor: add/reorder/remove exercises, set targets
- [ ] `startWorkoutSession` Server Action
- [ ] Active workout screen (full-screen, Client Component)
- [ ] SetLogger component with +/− buttons
- [ ] Zustand `useWorkoutSessionStore` with `localStorage` persistence
- [ ] Rest timer (Zustand store + overlay component)
- [ ] Exercise substitution (bottom sheet search)
- [ ] `logSet` Server Action (with optimistic update)
- [ ] `finishWorkout` Server Action (volume calculation)
- [ ] Workout summary screen

### Phase 3 — Progressive Overload & PRs (Week 6)

- [ ] Last-session pre-fill logic (query previous session on workout start)
- [ ] PR detection in `logSet` action (Epley 1RM comparison)
- [ ] `personal_records` table writes + PR badge animation
- [ ] Progression suggestion UI (after exercise completion)
- [ ] PR display on exercise detail page
- [ ] Workout history page: calendar + session list
- [ ] Session detail page: sets, volume, PRs achieved

### Phase 4 — Nutrition (Week 7–8)

- [ ] `nutrition_logs` auto-create for today
- [ ] Food entry form (manual: name + macros)
- [ ] Meal-type grouping in daily log
- [ ] Daily macro totals vs. profile targets
- [ ] MacroRing and progress bars
- [ ] Nutrition history page + weekly trend chart
- [ ] Food database search (V2 — add after manual entry works)

### Phase 5 — Body Tracking (Week 9)

- [ ] Weight entry form
- [ ] Weight trend chart (30-day, with 7-day moving average)
- [ ] Body measurements form
- [ ] Measurements history table + per-measurement sparklines
- [ ] Progress photos upload (Supabase Storage + signed URLs)

### Phase 6 — Dashboard (Week 10)

- [ ] Dashboard layout with Suspense streaming
- [ ] ActionPromptCard (today's workout)
- [ ] WeeklySnapshotRow (workouts, calories, streak)
- [ ] StrengthSignalCard (key lifts + sparklines)
- [ ] NutritionSummaryCard (protein adherence)
- [ ] WeightProgressCard (trend + goal delta)
- [ ] InsightsPanel (rules engine)
- [ ] GoalProgressCard

### Phase 7 — Analytics (Week 11)

- [ ] Strength progression page (per-exercise chart)
- [ ] Training volume trends
- [ ] PR timeline
- [ ] Workout consistency calendar
- [ ] Nutrition macro trends

### Phase 8 — Polish & PWA (Week 12)

- [ ] `next-pwa` setup: service worker, manifest
- [ ] Offline indicator + queue
- [ ] Performance audit: Lighthouse, bundle analysis
- [ ] Haptic feedback for set completion (Vibration API)
- [ ] Onboarding flow for new users
- [ ] Loading skeletons for all pages
- [ ] Error boundaries everywhere

### Phase 9 — AI Coach (Future)

- [ ] `user_context_summary` DB view
- [ ] `/api/ai/coach` streaming route
- [ ] AI chat UI component
- [ ] Conversation history store
- [ ] Rate limiting (10 queries/day)
- [ ] System prompt engineering (data-first responses)

---

## 26. Architecture Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Active session state lost on crash** | High | Zustand persist middleware + Supabase autosave every 60s for in-progress sessions |
| **Historical data corruption on plan/exercise edit** | High | Snapshot pattern fully isolates historical sessions from future changes |
| **Dashboard slow queries (N+1 or full-table scans)** | Medium | All aggregation queries analyzed before launch; indexes in place; promote to Postgres views if needed |
| **Exercise library cold start (no content at launch)** | High | Seed script is Phase 1 work. Block launch on having ≥50 exercises with videos. |
| **Video embeds failing (YouTube removes video)** | Medium | Store only `video_id`, not URL. Show graceful fallback (link to search). Monitor broken embeds. |
| **Offline sync conflicts** | Medium | All set IDs are client-generated UUIDs. Upsert (not insert) on reconnect. Last-write-wins is acceptable for personal data. |
| **Progressive overload false positives** | Low | Algorithm checks ALL working sets, excludes warmup/drop sets, never suggests >5kg jump |
| **RLS policy misconfiguration (data leak)** | High | Test every table with `anon` and `authenticated` roles before launch. Use Supabase's built-in RLS testing tools. |
| **Bundle size too large for mobile** | Medium | `next/dynamic` for Recharts and AI chat. Bundle analysis in CI. Target < 200kB initial JS. |
| **AI context window exceeded** | Low (future) | Structured summary views, not raw dumps. Query classification limits context to what's relevant. |
| **PR detection on set edit** | Low | Re-run check any time `actual_weight_kg` or `actual_reps` is mutated on a completed set. |
| **Only one active plan allowed (business rule)** | Low | Enforce with partial unique index: `CREATE UNIQUE INDEX ON workout_plans (user_id) WHERE is_active = true` |

---

## 27. Recommended Final Architecture

### Tech Stack — Final Decisions

| Layer | Decision | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | Server Components + Server Actions cover the data layer. No separate API server needed. |
| Database | Supabase (PostgreSQL + RLS) | Auth, DB, Storage, and RLS in one service. Type generation keeps schema and code in sync. |
| State: server | TanStack Query | Caching, background refetch, optimistic updates — essential for gym UX. |
| State: client | Zustand + persist middleware | Minimal, typed, survives browser crashes. Two stores only: session + preferences. |
| Styling | Tailwind CSS + shadcn/ui | shadcn/ui provides accessible components (sheets, dialogs) without a locked dependency. |
| Validation | Zod | Runs identically client + server. Schemas double as TypeScript types. |
| Charts | Recharts | Composable, React-native, themeable. Load lazily. |
| PWA | next-pwa | Offline-first is a requirement, not a nice-to-have. Gyms have unreliable WiFi. |
| Deployment | Vercel | First-class Next.js, Edge Network, zero config. |
| AI (future) | Claude API (claude-sonnet-4-6) | Access to actual user data context via structured DB views. |

### Schema — Final Decisions

| Decision | Reasoning |
|---|---|
| Snapshot pattern for session names | Historical records must never depend on mutable plan/exercise data |
| Store all weights in kg, all times in UTC | Single canonical format; convert on display. No migration needed when user changes units. |
| Soft-delete exercises only | Historical analytics require stable `exercise_id` FKs |
| UUIDs generated client-side | Enables optimistic inserts that sync asynchronously |
| One `nutrition_logs` row per day | Prevents duplicate daily rows; override targets per day cleanly |
| `personal_records` has one row per (user, exercise, pr_type) | Simple to query "current PR". Keep history in a V2 `personal_record_history` table if needed. |

### Architecture — Final Decisions

| Decision | Reasoning |
|---|---|
| Server Actions for all writes | No API layer to maintain. Zod validation inline. Full TypeScript coverage. |
| Server Components for all reads | No client-side data fetch waterfalls. First paint arrives pre-populated. |
| Zustand only for active session + preferences | All other state is server state (TanStack Query). Avoid over-using Zustand. |
| Dashboard built last | It has zero features of its own — it only aggregates. Must be built after all data producers exist. |
| PWA in Phase 8, not Phase 1 | Get the core workout loop working first. PWA is an enhancement, not a foundation. |
| No Prisma | Supabase's generated types + PostgREST provide the typed data layer. Prisma is redundant here. |

### Implementation Order — Final Decision

```
Phase 1: Foundation (auth, schema, exercise library, seed data)
Phase 2: Workout Engine (the core product — plans, sessions, set logging, timer)
Phase 3: Progressive Overload & PRs
Phase 4: Workout History
Phase 5: Nutrition
Phase 6: Body Tracking
Phase 7: Dashboard (NOW — all data producers exist)
Phase 8: Analytics deep-dive
Phase 9: PWA & Polish
Phase 10: AI Coach
```

> Build what generates data before building what displays it.  
> Get the workout loop production-ready before touching the dashboard.  
> Ship something you can use in the gym by the end of Phase 2.
