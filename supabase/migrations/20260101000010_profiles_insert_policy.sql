-- Allow users to insert their own profile row (needed when the auth trigger
-- didn't fire on signup, or for upsert operations from the app)
CREATE POLICY "profiles: owner insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
