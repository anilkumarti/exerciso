CREATE TABLE food_database (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  brand           TEXT,
  -- per 100g values
  calories_per_100g   NUMERIC(7,2) NOT NULL,
  protein_per_100g    NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_per_100g      NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_per_100g        NUMERIC(6,2) NOT NULL DEFAULT 0,
  fiber_per_100g      NUMERIC(6,2) NOT NULL DEFAULT 0,
  is_verified     BOOLEAN NOT NULL DEFAULT false,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER food_database_updated_at
  BEFORE UPDATE ON food_database
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX food_database_name_trgm_idx ON food_database USING GIN (name gin_trgm_ops);

CREATE TABLE nutrition_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, logged_date)
);

CREATE TRIGGER nutrition_logs_updated_at
  BEFORE UPDATE ON nutrition_logs
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX nutrition_logs_user_id_idx ON nutrition_logs (user_id, logged_date DESC);

CREATE TABLE food_entries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nutrition_log_id  UUID NOT NULL REFERENCES nutrition_logs(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- nullable: food_db entry may be deleted (user still has their entry)
  food_db_id        UUID REFERENCES food_database(id) ON DELETE SET NULL,
  -- snapshot of name at time of logging
  food_name_snapshot TEXT NOT NULL,
  meal_type         meal_type NOT NULL DEFAULT 'lunch',
  quantity_grams    NUMERIC(7,2) NOT NULL,
  -- calculated at insert time from food_db per-100g values × quantity
  calories          NUMERIC(7,2) NOT NULL,
  protein_g         NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_g           NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_g             NUMERIC(6,2) NOT NULL DEFAULT 0,
  fiber_g           NUMERIC(6,2) NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER food_entries_updated_at
  BEFORE UPDATE ON food_entries
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX food_entries_nutrition_log_id_idx ON food_entries (nutrition_log_id);
CREATE INDEX food_entries_user_id_idx ON food_entries (user_id);

-- RLS
ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Food database: all authenticated users can read; creator can modify their entries
CREATE POLICY "food_database: authenticated read" ON food_database
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "food_database: owner insert" ON food_database
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "food_database: owner update unverified" ON food_database
  FOR UPDATE USING (auth.uid() = created_by AND is_verified = false);

CREATE POLICY "nutrition_logs: owner all" ON nutrition_logs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "food_entries: owner all" ON food_entries
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
