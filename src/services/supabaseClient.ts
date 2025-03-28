import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjaqsgljdtmaltkgiaje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqYXFzZ2xqZHRtYWx0a2dpYWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDQwMDcsImV4cCI6MjA1ODQyMDAwN30.np-ydMHylbWo3mUfKKnuIIo5KX__exyLMYYMAMrwGK0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);