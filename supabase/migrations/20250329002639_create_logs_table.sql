-- Create logs table for persistent logging
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  message TEXT NOT NULL,
  context TEXT,
  stack TEXT,
  category TEXT CHECK (category IN ('system', 'auth', 'sync', 'api', 'scraping', 'llm')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS logs_timestamp_idx ON public.logs(timestamp);
CREATE INDEX IF NOT EXISTS logs_level_idx ON public.logs(level);
CREATE INDEX IF NOT EXISTS logs_category_idx ON public.logs(category);
CREATE INDEX IF NOT EXISTS logs_user_id_idx ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS logs_provider_id_idx ON public.logs(provider_id);

-- Add RLS policies
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own logs
CREATE POLICY "Users can view their own logs"
  ON public.logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Allow authenticated users to insert logs
CREATE POLICY "Users can insert logs"
  ON public.logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);