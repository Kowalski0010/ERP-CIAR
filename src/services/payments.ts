import { supabase } from '@/lib/supabase/client'

export const createInstallments = async (
  studentId: string,
  studentName: string,
  installments: number,
  value: number,
  firstDueDate: string,
) => {
  const payments = []
  let currentDate = new Date(firstDueDate)

  for (let i = 1; i <= installments; i++) {
    // Add timezone offset to avoid previous day bug due to UTC conversion
    const dateStr = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0]

    payments.push({
      student_id: studentId,
      student_name: studentName,
      amount: value,
      due_date: dateStr,
      status: 'Pendente',
      installment_number: i,
      total_installments: installments,
    })
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  const { data, error } = await supabase.from('payments').insert(payments).select()
  if (error) throw error
  return data
}

export const getPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('due_date', { ascending: true })
  if (error) throw error
  return data
}

export const addPayment = async (payment: any) => {
  const { data, error } = await supabase.from('payments').insert([payment]).select()
  if (error) throw error
  return data?.[0] || null
}

export const updatePayment = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('payments').update(updates).eq('id', id).select()
  if (error) throw error
  return data?.[0] || null
}
