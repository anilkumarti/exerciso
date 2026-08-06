CREATE TABLE ai_conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- conversation_id groups multiple turns into one thread
  conversation_id   UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role              TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content           TEXT NOT NULL,
  -- context snapshot passed to AI at time of message
  context_snapshot  JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ai_conversations_user_id_idx ON ai_conversations (user_id, created_at DESC);
CREATE INDEX ai_conversations_conversation_id_idx ON ai_conversations (conversation_id);

-- RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_conversations: owner all" ON ai_conversations
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
