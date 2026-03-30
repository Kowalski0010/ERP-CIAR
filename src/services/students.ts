import { supabase } from '@/lib/supabase/client'

export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const addStudent = async (student: any) => {
  const { data, error } = await supabase.from('students').insert([student]).select().single()
  if (error) throw error
  return data
}

export const updateStudent = async (id: string, student: any) => {
  const { data, error } = await supabase
    .from('students')
    .update(student)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteStudent = async (id: string) => {
  const { error } = await supabase.from('students').delete().eq('id', id)
  if (error) throw error
}
