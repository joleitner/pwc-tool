"use server";

import { User } from "@/types/index";
import { createAdminSupabase } from "@/utils/supabase/supabase.admin";
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

  return { email: user?.email, ...data } as User;
};

export async function adminLogin(email: string, password: string) {
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createServerSupabase();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}

export async function inviteParticipant(email: string) {
  const supabase = await createAdminSupabase();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) return { error };

  return await supabase
    .from("participants")
    .insert([{ id: data.user.id, email }]);

  // return await supabase.auth.signInWithOtp({
  //   email,
  // });
}

export async function resendOTPLink(email: string, redirectTo?: string) {
  const supabase = await createServerSupabase();

  return await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: redirectTo,
    },
  });
}
