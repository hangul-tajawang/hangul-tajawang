const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  let query = supabase.from('typing_contents').select('*, profiles!typing_contents_author_id_fkey(nickname, avatar_url), typing_comments(id)').lt('report_count', 10);
  query = query.order('created_at', { ascending: false });
  query = query.limit(200);
  
  console.log("Fetching...");
  const { data, error } = await query;
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Data length:", data.length);
  }
}
test();
