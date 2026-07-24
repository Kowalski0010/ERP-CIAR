import { supabase } from '@/lib/supabase/client'

export interface StudentStatusChange {
  id: string
  student_id: string
  previous_status: string | null
  new_status: string
  reason: string | null
  changed_by: string
  created_at: string
}

export async function logStudentStatusChange(
  studentId: string,
  previousStatus: string | null,
  newStatus: string,
  reason: string | null,
  changedBy: string,
): Promise<StudentStatusChange> {
  const { data, error } = await supabase
    .from('student_status_changes')
    .insert({
      student_id: studentId,
      previous_status: previousStatus,
      new_status: newStatus,
      reason,
      changed_by: changedBy,
    })
    .select()
    .single()
  if (error) throw error
  return data as StudentStatusChange
}

export async function getStudentStatusChanges(studentId: string): Promise<StudentStatusChange[]> {
  const { data, error } = await supabase
    .from('student_status_changes')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as StudentStatusChange[]
}
