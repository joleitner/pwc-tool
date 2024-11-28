"use server";

import { User } from "@/types/index";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getAuthUser = async (select = '*') => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;
  
    const { data, error } = await supabase
      .from('users')
      .select(select)
      .eq('id', user?.id!)
      .returns<Partial<User[]>>()
      .single();

    if (error) return null;
  
    return { email: user?.email, ...data } as User;
  };


export async function adminLogin(email: string, password: string) {
    const supabase = await createClient()
  
    const { error } = await supabase.auth.signInWithPassword({email, password})
  
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/admin')
    redirect('/admin')
  }

export async function logout() {
    const supabase = await createClient()
  
    await supabase.auth.signOut()
  
    revalidatePath('/', 'layout')
    redirect('/')

  }
  
  // export async function signup(formData: FormData) {
  //   const supabase = await createClient()
  
  //   // type-casting here for convenience
  //   // in practice, you should validate your inputs
  //   const data = {
  //     email: formData.get('email') as string,
  //     password: formData.get('password') as string,
  //   }
  
  //   const { error } = await supabase.auth.signUp(data)
  
  //   if (error) {
  //     redirect('/error')
  //   }
  
  //   revalidatePath('/', 'layout')
  //   redirect('/')
  // }