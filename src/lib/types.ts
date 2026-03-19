export type Role = 'Admin' | 'Academico' | 'Financeiro' | 'Comercial'

export type Observation = {
  id: string
  date: string
  author: string
  text: string
}

export type Student = {
  id: string
  name: string
  email: string
  status: 'Ativo' | 'Inativo' | 'Formado'
  enrollmentDate: string
  course: string
  avatar?: string
  phone?: string
  address?: string
  rg?: string
  cpf?: string
  observations?: Observation[]
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
  currentUserRole: Role
  students: Student[]
  leads: Lead[]
  payments: Payment[]
}
