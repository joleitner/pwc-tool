"use server";

import { User } from "@/types/index";
import { createServerSupabase } from "@/utils/supabase/supabase.server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getAuthUser = async (select = "*") => {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select(select)
    .eq("id", user?.id!)
    .returns<Partial<User[]>>()
    .single();

  if (error) return null;

  return data as User;
};

export async function adminLogin(email: string, password: string) {
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createServerSupabase();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
