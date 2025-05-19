import { createClient } from '@supabase/supabase-js';

export const supabaseServer = createClient(
  "https://qypqyslwwetmjeqfeslb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cHF5c2x3d2V0bWplcWZlc2xiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzU2MjY1MywiZXhwIjoyMDU5MTM4NjUzfQ.x32jefkemrqPOKwMU44GzhmQMhey1_Dz7nae8Fy7eoM"// 🔐 Only on server
);
