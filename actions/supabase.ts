"use server"

import { createClient } from '@/utils/supabase/server'

export async function addParticipant(email: string) {
    const supabase = await createClient()

    return await supabase.from('participants').insert([{ email }])
  }