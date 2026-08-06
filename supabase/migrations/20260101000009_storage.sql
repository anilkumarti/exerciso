-- Progress photos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'progress-photos',
  'progress-photos',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (storage.objects table)

-- Users can upload to their own folder: progress-photos/{user_id}/*
CREATE POLICY "progress-photos: owner insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Users can read their own photos
CREATE POLICY "progress-photos: owner select" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'progress-photos' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Users can delete their own photos
CREATE POLICY "progress-photos: owner delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'progress-photos' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );
