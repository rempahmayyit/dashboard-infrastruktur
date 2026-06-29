import { supabase } from "./supabase";

export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId);

    if (error) {
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.log("CATCH ERROR =", err);
    return null;
  }
}
