import { supabase } from '@/lib/supabase/client'

export async function uploadDocument(studentId: string, docType: string, file: File) {
  const ext = file.name.split('.').pop() || 'bin'
  const path = `${studentId}/${docType}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('student-documents').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('student-documents').getPublicUrl(path)
  return {
    url: data.publicUrl,
    path,
    name: file.name,
    type: file.type,
    date: new Date().toISOString(),
  }
}

export async function downloadDocument(path: string) {
  const { data, error } = await supabase.storage.from('student-documents').download(path)
  if (error) throw error
  return data
}
