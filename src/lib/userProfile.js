import { supabase } from "./supabase";

export async function getUserProfile(userId) {
  try {
    console.log("MENCARI USER =", userId);

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId);

    console.log("DATA =", data);
    console.log("ERROR =", error);

    if (error) {
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.log("CATCH ERROR =", err);
    return null;
  }
}