"use server";

import { createServerSupabase } from "@/utils/supabase/supabase.server";

export async function getHelper() {
  const supabase = await createServerSupabase();

  return await supabase.from("users").select("*").eq("role", "helper");
}

export async function removeHelper(id: string) {
  const supabase = await createServerSupabase();

  return await supabase
    .from("users")
    .update({ role: "participant" })
    .eq("id", id);
}

export async function createNewSuggestion(data: any) {
  const supabase = await createServerSupabase();

  return await supabase.from("suggestions").insert(data).select().single();
}

export async function updateSuggestion(id: number, data: any) {
  const supabase = await createServerSupabase();

  return await supabase.from("suggestions").update(data).eq("id", id);
}
