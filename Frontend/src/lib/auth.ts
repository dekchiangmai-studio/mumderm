import { reactive, readonly } from 'vue'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

const state = reactive({
  session: null as Session | null,
  user: null as User | null,
  isLoading: true,
  errorMessage: '',
})

let initialized = false
let initialization: Promise<void> | null = null

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  return supabase
}

function setSession(session: Session | null) {
  state.session = session
  state.user = session?.user ?? null
}

export async function initializeAuth() {
  if (initialization) return initialization

  initialization = (async () => {
    try {
      const client = requireSupabase()
      const { data, error } = await client.auth.getSession()
      if (error) throw error
      setSession(data.session)
      client.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
        setSession(session)
        if (event === 'SIGNED_OUT') state.errorMessage = ''
      })
      initialized = true
    } catch (error) {
      state.errorMessage =
        error instanceof Error
          ? error.message
          : 'ไม่สามารถตรวจสอบสถานะผู้ใช้ได้'
    } finally {
      state.isLoading = false
    }
  })()

  return initialization
}

export function useAuth() {
  if (!initialized && !initialization) void initializeAuth()
  return readonly(state)
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
) {
  const client = requireSupabase()
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const client = requireSupabase()
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const client = requireSupabase()
  const { error } = await client.auth.signOut()
  if (error) throw error
}
