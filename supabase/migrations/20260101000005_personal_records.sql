CREATE TABLE personal_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  -- exercise_name_snapshot: display label immune to future renames
  exercise_name_snapshot TEXT NOT NULL,
  pr_type         pr_type NOT NULL,
  value           NUMERIC(10,4) NOT NULL, -- 1RM in kg, or max weight, or max reps
  weight_kg       NUMERIC(6,2),           -- raw weight used (for context)
  reps            INTEGER,                -- raw reps used (for context)
  -- session/set that set this PR — nullable if session/set deleted later
  session_id      UUID REFERENCES workout_sessions(id) ON DELETE SET NULL,
  set_id          UUID REFERENCES exercise_sets(id) ON DELETE SET NULL,
  achieved_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one current PR per user × exercise × pr_type
CREATE UNIQUE INDEX personal_records_one_per_type_idx
  ON personal_records (user_id, exercise_id, pr_type);

CREATE INDEX personal_records_user_id_idx ON personal_records (user_id);
CREATE INDEX personal_records_exercise_id_idx ON personal_records (exercise_id);

-- RLS
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "personal_records: owner all" ON personal_records
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
