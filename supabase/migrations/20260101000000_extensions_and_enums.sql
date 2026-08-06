-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for exercise name search

-- Enums
CREATE TYPE split_type AS ENUM (
  'full_body', 'upper_lower', 'push_pull_legs', 'bro_split', 'custom'
);

CREATE TYPE set_type AS ENUM (
  'normal', 'warmup', 'dropset', 'failure'
);

CREATE TYPE session_status AS ENUM (
  'in_progress', 'completed', 'abandoned'
);

CREATE TYPE pr_type AS ENUM (
  'one_rm', 'max_weight', 'max_reps_at_weight', 'max_volume'
);

CREATE TYPE meal_type AS ENUM (
  'breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'
);

CREATE TYPE photo_angle AS ENUM (
  'front', 'back', 'side_left', 'side_right'
);

CREATE TYPE weight_unit AS ENUM ('kg', 'lbs');
CREATE TYPE height_unit AS ENUM ('cm', 'ft_in');

CREATE TYPE activity_level AS ENUM (
  'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'
);

CREATE TYPE fitness_goal AS ENUM (
  'lose_weight', 'build_muscle', 'maintain', 'improve_endurance', 'increase_strength'
);

CREATE TYPE muscle_group AS ENUM (
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'core', 'glutes', 'quads', 'hamstrings', 'calves', 'full_body'
);

CREATE TYPE equipment_type AS ENUM (
  'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight',
  'kettlebell', 'resistance_band', 'smith_machine', 'other'
);
