const SUPABASE_URL = "https://foeiwsrzojbzetzfgpfw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0OuLv6dFbLhPQVGN_n3jmg_RpeYumTk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);