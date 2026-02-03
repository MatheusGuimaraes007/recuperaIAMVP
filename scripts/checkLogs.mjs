import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_KEY;

if (!url || !key) {
  console.error('Missing supabase credentials');
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error, count } = await supabase
  .from('logs_error_n8n')
  .select('*', { count: 'exact' })
  .limit(5);

console.log({ error, count, sample: data });
