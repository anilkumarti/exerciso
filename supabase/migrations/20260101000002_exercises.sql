-- Global exercise library (no RLS user filter — all authenticated users can read)
CREATE TABLE exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  instructions    TEXT,
  is_custom       BOOLEAN NOT NULL DEFAULT false,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Full-text search index on exercise names
CREATE INDEX exercises_name_trgm_idx ON exercises USING GIN (name gin_trgm_ops);

CREATE TABLE exercise_muscles (
  exercise_id   UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_group  muscle_group NOT NULL,
  is_primary    BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (exercise_id, muscle_group)
);

CREATE TABLE exercise_equipment (
  exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  equipment_type  equipment_type NOT NULL,
  PRIMARY KEY (exercise_id, equipment_type)
);

CREATE TABLE exercise_videos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id   UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  youtube_id    TEXT NOT NULL,
  title         TEXT,
  is_primary    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one primary video per exercise
CREATE UNIQUE INDEX exercise_videos_one_primary_idx
  ON exercise_videos (exercise_id)
  WHERE is_primary = true;

CREATE TABLE exercise_alternatives (
  exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  alternative_id  UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, alternative_id),
  CHECK (exercise_id <> alternative_id)
);

-- RLS — exercises are globally readable by authenticated users
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_muscles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_alternatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercises: authenticated read all" ON exercises
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercises: owner insert custom" ON exercises
  FOR INSERT WITH CHECK (auth.uid() = created_by AND is_custom = true);

CREATE POLICY "exercises: owner update custom" ON exercises
  FOR UPDATE USING (auth.uid() = created_by AND is_custom = true);

CREATE POLICY "exercise_muscles: authenticated read" ON exercise_muscles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercise_equipment: authenticated read" ON exercise_equipment
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercise_videos: authenticated read" ON exercise_videos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercise_alternatives: authenticated read" ON exercise_alternatives
  FOR SELECT USING (auth.role() = 'authenticated');
