import { supabase } from '@/lib/supabase/client'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  status: string | null
  updated_at: string | null
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles' as any)
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data || []) as Profile[]
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const payload: Record<string, unknown> = {}
  if (updates.full_name !== undefined) payload.full_name = updates.full_name
  if (updates.role !== undefined) payload.role = updates.role
  if (updates.status !== undefined) payload.status = updates.status
  if (updates.email !== undefined) payload.email = updates.email

  const { data, error } = await supabase
    .from('profiles' as any)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

export async function createUserAuth(email: string, fullName: string, role: string) {
  const { data, error } = await supabase.functions.invoke('admin-create-user', {
    body: { email, fullName, role },
  })

  if (error && !data) {
    return { data: null, error: { message: 'Erro de conexão com o servidor.' } }
  }

  if (data?.error) {
    return { data: null, error: { message: data.error } }
  }

  return { data, error: null }
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}
