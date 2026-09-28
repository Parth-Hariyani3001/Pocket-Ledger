import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY;

export default createClient<Database>(supabaseUrl, supabaseKey);