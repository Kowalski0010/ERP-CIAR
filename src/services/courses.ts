import { supabase } from '@/lib/supabase/client'

export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const addCourse = async (course: any) => {
  const { data, error } = await supabase.from('courses').insert([course]).select().single()
  if (error) throw error
  return data
}

export const updateCourse = async (id: string, course: any) => {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteCourse = async (id: string) => {
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw error
}
