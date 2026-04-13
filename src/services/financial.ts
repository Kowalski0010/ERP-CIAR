import { supabase } from '@/lib/supabase/client'
import { FinancialAccount, FinancialTransaction } from '@/lib/types'

export const getFinancialAccounts = async (): Promise<FinancialAccount[]> => {
  const { data, error } = await supabase
    .from('financial_accounts')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error

  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    type: row.type as 'Receita' | 'Despesa',
    description: row.description,
    createdAt: row.created_at,
  }))
}

export const saveFinancialAccount = async (account: Partial<FinancialAccount>) => {
  const payload = {
    name: account.name,
    type: account.type,
    description: account.description,
  }

  if (account.id) {
    const { data, error } = await supabase
      .from('financial_accounts')
      .update(payload)
      .eq('id', account.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('financial_accounts')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const deleteFinancialAccount = async (id: string) => {
  const { error } = await supabase.from('financial_accounts').delete().eq('id', id)
  if (error) throw error
}

export const getFinancialTransactions = async (): Promise<FinancialTransaction[]> => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select(`
      *,
      financial_accounts (name)
    `)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map((row: any) => ({
    id: row.id,
    accountId: row.account_id,
    accountName: row.financial_accounts?.name,
    description: row.description,
    amount: Number(row.amount),
    type: row.type as 'Receita' | 'Despesa',
    date: row.date,
    status: row.status as 'Realizado' | 'Previsto',
    createdAt: row.created_at,
  }))
}

export const saveFinancialTransaction = async (tx: Partial<FinancialTransaction>) => {
  const payload = {
    account_id: tx.accountId,
    description: tx.description,
    amount: tx.amount,
    type: tx.type,
    date: tx.date,
    status: tx.status,
  }

  if (tx.id) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update(payload)
      .eq('id', tx.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const deleteFinancialTransaction = async (id: string) => {
  const { error } = await supabase.from('financial_transactions').delete().eq('id', id)
  if (error) throw error
}
