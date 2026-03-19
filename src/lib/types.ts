export type Role = 'Admin' | 'Academico' | 'Financeiro' | 'Comercial'

export type Address = {
  zipCode: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
}

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
  cpf?: string
  rg?: string
  address?: Address
  observations?: Observation[]
}

export type Teacher = {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  rg: string
  address?: Address
  subjects: string[]
  workload: number
  status: 'Ativo' | 'Inativo'
  avatar?: string
}

export type ClassRoom = {
  id: string
  name: string
  course: string
  semester: string
}

export type Schedule = {
  id: string
  classId: string
  subject: string
  teacherId: string
  room: string
  dayOfWeek: string
  startTime: string
  endTime: string
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
  installmentNumber?: number
  totalInstallments?: number
}

export type FinancialPlan = {
  installments: number
  value: number
  firstDueDate: string
}

export type AppState = {
  currentUserRole: Role
  students: Student[]
  leads: Lead[]
  payments: Payment[]
  teachers: Teacher[]
  classes: ClassRoom[]
  schedules: Schedule[]
}
