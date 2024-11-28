"use server"

import { createClient } from '@/utils/supabase/server'

export async function addParticipant(email: string) {
    const supabase = await createClient()

    return await supabase.from('participants').insert([{ email }])
  }

export async function getParticipants() {
    const supabase = await createClient()

    return await supabase.from('participants').select('*').order('created_at', { ascending: false })
  }

export async function deleteParticipant(id: number) {
    const supabase = await createClient()

    return await supabase.from('participants').delete().eq('id', id)
  }