CREATE TABLE workout_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Nullable FKs: plan/day may be deleted after session was logged
  plan_id               UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  plan_day_id           UUID REFERENCES workout_plan_days(id) ON DELETE SET NULL,
  -- Snapshots preserve historical display even after plan edits
  plan_day_name_snapshot TEXT,
  status                session_status NOT NULL DEFAULT 'in_progress',
  started_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at          TIMESTAMPTZ,
  duration_seconds      INTEGER,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER workout_sessions_updated_at
  BEFORE UPDATE ON workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX workout_sessions_user_id_idx ON workout_sessions (user_id);
CREATE INDEX workout_sessions_status_idx ON workout_sessions (user_id, status) WHERE status = 'in_progress';
CREATE INDEX workout_sessions_started_at_idx ON workout_sessions (user_id, started_at DESC);

CREATE TABLE session_exercises (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- plan_exercise_id may be null if exercise was added ad-hoc during session
  plan_exercise_id        UUID REFERENCES plan_exercises(id) ON DELETE SET NULL,
  exercise_id             UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  -- Snapshot: name at time of logging, immune to future exercise renames
  exercise_name_snapshot  TEXT NOT NULL,
  exercise_order          INTEGER NOT NULL DEFAULT 0,
  was_skipped             BOOLEAN NOT NULL DEFAULT false,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER session_exercises_updated_at
  BEFORE UPDATE ON session_exercises
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX session_exercises_session_id_idx ON session_exercises (session_id);
CREATE INDEX session_exercises_user_id_idx ON session_exercises (user_id);
CREATE INDEX session_exercises_exercise_id_idx ON session_exercises (exercise_id);

CREATE TABLE exercise_sets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_exercise_id UUID NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  set_number        INTEGER NOT NULL,
  set_type          set_type NOT NULL DEFAULT 'normal',
  weight_kg         NUMERIC(6,2),
  reps              INTEGER,
  duration_seconds  INTEGER, -- for timed sets (planks, etc.)
  rpe               NUMERIC(3,1), -- rate of perceived exertion 1-10
  is_completed      BOOLEAN NOT NULL DEFAULT false,
  logged_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER exercise_sets_updated_at
  BEFORE UPDATE ON exercise_sets
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX exercise_sets_session_exercise_id_idx ON exercise_sets (session_exercise_id);
CREATE INDEX exercise_sets_user_id_idx ON exercise_sets (user_id);

-- RLS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workout_sessions: owner all" ON workout_sessions
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "session_exercises: owner all" ON session_exercises
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exercise_sets: owner all" ON exercise_sets
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
