import { supabase } from '@/lib/supabase/client'
import { Disciplina, ClassRoom, AcrPatient, Payment } from '@/lib/types'

// ---------------------------------------------------------
// Disciplinas
// ---------------------------------------------------------
export const getDisciplinas = async (): Promise<Disciplina[]> => {
  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data as Disciplina[]
}

export const addDisciplina = async (d: Partial<Disciplina>) => {
  const { data, error } = await supabase
    .from('disciplinas')
    .insert([
      {
        name: d.name,
        workload: d.workload,
        status: d.status || 'Ativo',
        teacher: d.teacher,
        course: d.course,
        observations: d.observations,
      },
    ])
    .select()
    .single()
  if (error) throw error
  return data as Disciplina
}

export const updateDisciplina = async (id: string, d: Partial<Disciplina>) => {
  const { data, error } = await supabase
    .from('disciplinas')
    .update({
      name: d.name,
      workload: d.workload,
      status: d.status,
      teacher: d.teacher,
      course: d.course,
      observations: d.observations,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Disciplina
}

// ---------------------------------------------------------
// Classes (Turmas)
// ---------------------------------------------------------
export const getClasses = async (): Promise<ClassRoom[]> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as ClassRoom[]
}

export const addClass = async (c: Partial<ClassRoom>) => {
  const { data, error } = await supabase
    .from('classes')
    .insert([
      {
        name: c.name,
        course: c.course,
        semester: c.semester,
        capacity: c.capacity,
        room: c.room,
        year: c.year,
        shift: c.shift,
      },
    ])
    .select()
    .single()
  if (error) throw error
  return data as ClassRoom
}

export const updateClass = async (id: string, c: Partial<ClassRoom>) => {
  const { data, error } = await supabase
    .from('classes')
    .update({
      name: c.name,
      course: c.course,
      semester: c.semester,
      capacity: c.capacity,
      room: c.room,
      year: c.year,
      shift: c.shift,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as ClassRoom
}

// ---------------------------------------------------------
// ACR Patients (Clínica)
// ---------------------------------------------------------
export const getAcrPatients = async (): Promise<AcrPatient[]> => {
  const { data, error } = await supabase
    .from('acr_patients')
    .select('*')
    .order('registration_date', { ascending: false })
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    birthDate: row.birth_date,
    background: row.background,
    registrationDate: row.registration_date,
    attachments: row.attachments || [],
  })) as AcrPatient[]
}

export const addAcrPatient = async (p: Partial<AcrPatient>) => {
  const { data, error } = await supabase
    .from('acr_patients')
    .insert([
      {
        name: p.name,
        email: p.email,
        phone: p.phone,
        birth_date: p.birthDate,
        background: p.background,
        attachments: p.attachments || [],
      },
    ])
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    birthDate: data.birth_date,
    background: data.background,
    registrationDate: data.registration_date,
    attachments: data.attachments || [],
  } as AcrPatient
}

export const updateAcrPatient = async (id: string, p: Partial<AcrPatient>) => {
  const payload: any = {}
  if (p.name !== undefined) payload.name = p.name
  if (p.email !== undefined) payload.email = p.email
  if (p.phone !== undefined) payload.phone = p.phone
  if (p.birthDate !== undefined) payload.birth_date = p.birthDate
  if (p.background !== undefined) payload.background = p.background
  if (p.attachments !== undefined) payload.attachments = p.attachments

  const { data, error } = await supabase
    .from('acr_patients')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    birthDate: data.birth_date,
    background: data.background,
    registrationDate: data.registration_date,
    attachments: data.attachments || [],
  } as AcrPatient
}

export const deleteAcrPatient = async (id: string) => {
  const { error } = await supabase.from('acr_patients').delete().eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------
// Payments (Financeiro)
// ---------------------------------------------------------
export const getPayments = async (): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    amount: row.amount,
    dueDate: row.due_date,
    status: row.status,
    installmentNumber: row.installment_number,
    totalInstallments: row.total_installments,
    attachments: row.attachments || [],
  })) as Payment[]
}

export const addPayment = async (p: Partial<Payment>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        student_id: p.studentId,
        student_name: p.studentName,
        amount: p.amount,
        due_date: p.dueDate,
        status: p.status || 'Pendente',
        installment_number: p.installmentNumber,
        total_installments: p.totalInstallments,
        attachments: p.attachments || [],
      },
    ])
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    studentId: data.student_id,
    studentName: data.student_name,
    amount: data.amount,
    dueDate: data.due_date,
    status: data.status,
    installmentNumber: data.installment_number,
    totalInstallments: data.total_installments,
    attachments: data.attachments || [],
  } as Payment
}

export const updatePayment = async (id: string, p: Partial<Payment>) => {
  const payload: any = {}
  if (p.studentId !== undefined) payload.student_id = p.studentId
  if (p.studentName !== undefined) payload.student_name = p.studentName
  if (p.amount !== undefined) payload.amount = p.amount
  if (p.dueDate !== undefined) payload.due_date = p.dueDate
  if (p.status !== undefined) payload.status = p.status
  if (p.installmentNumber !== undefined) payload.installment_number = p.installmentNumber
  if (p.totalInstallments !== undefined) payload.total_installments = p.totalInstallments
  if (p.attachments !== undefined) payload.attachments = p.attachments

  const { data, error } = await supabase
    .from('payments')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    studentId: data.student_id,
    studentName: data.student_name,
    amount: data.amount,
    dueDate: data.due_date,
    status: data.status,
    installmentNumber: data.installment_number,
    totalInstallments: data.total_installments,
    attachments: data.attachments || [],
  } as Payment
}

export const deletePayment = async (id: string) => {
  const { error } = await supabase.from('payments').delete().eq('id', id)
  if (error) throw error
}
