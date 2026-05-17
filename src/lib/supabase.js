import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://cfjbxoytanoqltzkvncd.supabase.co";

const supabaseAnonKey =
  "sb_publishable_zQTdPtzlKzBJziZShF9f-A_hDlG3cAK";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );