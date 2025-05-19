import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qypqyslwwetmjeqfeslb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cHF5c2x3d2V0bWplcWZlc2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NjI2NTMsImV4cCI6MjA1OTEzODY1M30.l-j97EzRGlD_D7NIM6OILXCh6Ut67Tp8qWTGIgITj9Y';

export const supabase = createClient(supabaseUrl, supabaseKey);


//test 9 may 12:00
