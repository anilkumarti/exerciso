-- Profiles table — extends auth.users 1:1
CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name      TEXT,
  avatar_url        TEXT,
  date_of_birth     DATE,
  weight_unit       weight_unit NOT NULL DEFAULT 'kg',
  height_unit       height_unit NOT NULL DEFAULT 'cm',
  height_cm         NUMERIC(5,2),
  goal_weight_kg    NUMERIC(6,2),
  activity_level    activity_level NOT NULL DEFAULT 'moderately_active',
  fitness_goal      fitness_goal NOT NULL DEFAULT 'build_muscle',
  onboarding_done   BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- updated_at trigger helper (reused across tables)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: owner read" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: owner update" ON profiles
  FOR UPDATE USING (auth.uid() = id);
