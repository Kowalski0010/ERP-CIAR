export type Student = {
  id: string
  name: string
  email: string
  status: 'Ativo' | 'Inativo' | 'Formado'
  enrollmentDate: string
  course: string
  avatar?: string
}

export type Lead = {
  id: string
  name: string
  phone: string
  courseInterest: string
  status: 'Novo' | 'Contatado' | 'Visita' | 'Pendente' | 'Ganho' | 'Perdido'
  dateAdded: string
}

export type Payment = {
  id: string
  studentId: string
  studentName: string
  amount: number
  dueDate: string
  status: 'Pago' | 'Pendente' | 'Atrasado'
}

export type AppState = {
  students: Student[]
  leads: Lead[]
  payments: Payment[]
}
