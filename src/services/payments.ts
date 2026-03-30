import { supabase } from '@/lib/supabase/client'

const mapToDb = (payment: any) => {
  const dbPayment: any = {
    student_id: payment.studentId,
    student_name: payment.studentName,
    amount: payment.amount,
    due_date: payment.dueDate,
    status: payment.status,
    installment_number: payment.installmentNumber,
    total_installments: payment.totalInstallments,
    attachments: payment.attachments || [],
  }

  if (payment.id && !payment.id.startsWith('INV')) {
    dbPayment.id = payment.id
  }

  return dbPayment
}

const mapFromDb = (row: any) => ({
  id: row.id,
  studentId: row.student_id,
  studentName: row.student_name,
  amount: row.amount,
  dueDate: row.due_date,
  status: row.status,
  installmentNumber: row.installment_number,
  totalInstallments: row.total_installments,
  attachments: row.attachments || [],
  createdAt: row.created_at,
})

export const getPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('due_date', { ascending: true })
  if (error) throw error
  return data.map(mapFromDb)
}

export const addPayment = async (payment: any) => {
  const dbPayment = mapToDb(payment)
  const { data, error } = await supabase.from('payments').insert([dbPayment]).select().single()
  if (error) throw error
  return mapFromDb(data)
}

export const updatePayment = async (id: string, payment: any) => {
  const dbPayment = mapToDb(payment)
  const { data, error } = await supabase
    .from('payments')
    .update(dbPayment)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapFromDb(data)
}

export const createInstallments = async (
  studentId: string,
  studentName: string,
  installments: number,
  value: number,
  firstDueDate: string,
) => {
  const payments = []
  const firstDate = new Date(firstDueDate)
  for (let i = 0; i < installments; i++) {
    const dueDate = new Date(firstDate)
    dueDate.setMonth(dueDate.getMonth() + i)
    payments.push({
      student_id: studentId,
      student_name: studentName,
      amount: value,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'Pendente',
      installment_number: i + 1,
      total_installments: installments,
    })
  }
  const { data, error } = await supabase.from('payments').insert(payments).select()
  if (error) throw error
  return data.map(mapFromDb)
}
