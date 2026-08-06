CREATE TABLE weight_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg   NUMERIC(6,2) NOT NULL,
  logged_at   DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One entry per day
CREATE UNIQUE INDEX weight_entries_one_per_day_idx
  ON weight_entries (user_id, logged_at);

CREATE INDEX weight_entries_user_id_idx ON weight_entries (user_id, logged_at DESC);

CREATE TABLE body_measurements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  measured_at     DATE NOT NULL DEFAULT CURRENT_DATE,
  -- all measurements in cm
  chest_cm        NUMERIC(5,2),
  waist_cm        NUMERIC(5,2),
  hips_cm         NUMERIC(5,2),
  left_arm_cm     NUMERIC(5,2),
  right_arm_cm    NUMERIC(5,2),
  left_thigh_cm   NUMERIC(5,2),
  right_thigh_cm  NUMERIC(5,2),
  left_calf_cm    NUMERIC(5,2),
  right_calf_cm   NUMERIC(5,2),
  neck_cm         NUMERIC(5,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX body_measurements_user_id_idx ON body_measurements (user_id, measured_at DESC);

CREATE TABLE progress_photos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- nullable: measurement taken same day but measurement row may be deleted
  measurement_id  UUID REFERENCES body_measurements(id) ON DELETE SET NULL,
  photo_angle     photo_angle NOT NULL,
  storage_path    TEXT NOT NULL, -- supabase storage path
  taken_at        DATE NOT NULL DEFAULT CURRENT_DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX progress_photos_user_id_idx ON progress_photos (user_id, taken_at DESC);

CREATE TABLE goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  target_value    NUMERIC(10,4),
  target_unit     TEXT,
  target_date     DATE,
  is_completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
  -- NOTE: current_value is computed dynamically at query time, not stored
  -- Goal weight is tracked via profiles.goal_weight_kg
);

CREATE TRIGGER goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX goals_user_id_idx ON goals (user_id);

-- RLS
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weight_entries: owner all" ON weight_entries
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "body_measurements: owner all" ON body_measurements
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "progress_photos: owner all" ON progress_photos
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals: owner all" ON goals
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
