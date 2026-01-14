
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtlipycorweyfrsgomry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bGlweWNvcndleWZyc2dvbXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjkzOTksImV4cCI6MjA3ODA0NTM5OX0.TH7gABKi0B2KXYqoHvacFgM4MgLTAr2hVBw0tzksMpU';

export const supabase = createClient(supabaseUrl, supabaseKey);
