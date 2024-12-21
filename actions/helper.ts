"use server";

import { Suggestion } from "@/types";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return await supabase
    .from("suggestions")
    .insert([{ user: user!.id, ...data }])
    .select("*")
    .single();
}

export async function updateSuggestion(id: number, data: any) {
  const supabase = await createServerSupabase();

  return await supabase.from("suggestions").update(data).eq("id", id);
}

export async function deleteSuggestion(id: number) {
  const supabase = await createServerSupabase();

  return await supabase.from("suggestions").delete().eq("id", id);
}

export async function getSuggestions() {
  const supabase = await createServerSupabase();

  return await supabase
    .from("suggestions")
    .select("*, user(name)")
    .returns<Suggestion[]>();
}

export async function getSuggestion(id: number) {
  const supabase = await createServerSupabase();

  return await supabase
    .from("suggestions")
    .select("*, user(name)")
    .eq("id", id)
    .returns<Suggestion[]>()
    .single();
}
