CREATE TABLE workout_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  split_type  split_type NOT NULL DEFAULT 'custom',
  is_active   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER workout_plans_updated_at
  BEFORE UPDATE ON workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX workout_plans_user_id_idx ON workout_plans (user_id);

CREATE TABLE workout_plan_days (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id   UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  day_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER workout_plan_days_updated_at
  BEFORE UPDATE ON workout_plan_days
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX workout_plan_days_plan_id_idx ON workout_plan_days (plan_id);
CREATE INDEX workout_plan_days_user_id_idx ON workout_plan_days (user_id);

CREATE TABLE plan_exercises (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_day_id    UUID NOT NULL REFERENCES workout_plan_days(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id    UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  exercise_order INTEGER NOT NULL DEFAULT 0,
  target_sets    INTEGER NOT NULL DEFAULT 3,
  target_reps    TEXT NOT NULL DEFAULT '8-12', -- range like "8-12" or "5"
  target_weight_kg NUMERIC(6,2),
  rest_seconds   INTEGER NOT NULL DEFAULT 90,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER plan_exercises_updated_at
  BEFORE UPDATE ON plan_exercises
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX plan_exercises_plan_day_id_idx ON plan_exercises (plan_day_id);
CREATE INDEX plan_exercises_user_id_idx ON plan_exercises (user_id);

-- RLS
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workout_plans: owner all" ON workout_plans
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workout_plan_days: owner all" ON workout_plan_days
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plan_exercises: owner all" ON plan_exercises
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
