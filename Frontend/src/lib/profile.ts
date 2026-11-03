import { supabase } from './supabase'
import type { Profile } from '../types/profile'

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

export async function getMyProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await requireSupabase()
    .from('profiles')
    .select('id, display_name, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
    ? {
        id: data.id,
        displayName: data.display_name,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    : null
}

export async function updateMyProfile(userId: string, displayName: string) {
  const { data, error } = await requireSupabase()
    .from('profiles')
    .update({
      display_name: displayName.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, display_name, created_at, updated_at')
    .single()

  if (error) throw error
  return {
    id: data.id,
    displayName: data.display_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } satisfies Profile
}
