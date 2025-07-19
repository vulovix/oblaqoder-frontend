import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_KEY } from "~/configuration";

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_KEY);
