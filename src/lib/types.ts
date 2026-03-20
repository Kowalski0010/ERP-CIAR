export type Role = 'Admin' | 'Academico' | 'Financeiro' | 'Comercial' | 'Aluno'

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

export type AuditLog = {
  id: string
  timestamp: string
  user: string
  action: string
  entity: string
}

export type SystemNotification = {
  id: string
  title: string
  message: string
  type: 'Success' | 'Warning' | 'Info'
  date: string
  target: 'Todos' | 'Alunos' | 'Professores' | 'Staff'
  read: boolean
}

export type AttendanceRecord = {
  id: string
  studentId: string
  subject: string
  totalClasses: number
  absences: number
}

export type Employee = {
  id: string
  name: string
  department: string
  position: string
  status: 'Ativo' | 'Inativo'
  email: string
  phone: string
  admissionDate: string
  salary: number
  avatar?: string
}

export type Product = {
  id: string
  sku: string
  name: string
  category: string
  currentQuantity: number
  minQuantity: number
  unit: string
  price: number
}

export type StockMovement = {
  id: string
  productId: string
  productName: string
  type: 'Entrada' | 'Saída'
  quantity: number
  date: string
  user: string
  reason: string
}

export type Supplier = {
  id: string
  name: string
  taxId: string
  contact: string
  email: string
  phone: string
  rating: number
  status: 'Ativo' | 'Inativo'
}

export type PurchaseOrder = {
  id: string
  supplierId: string
  supplierName: string
  date: string
  expectedDelivery: string
  totalAmount: number
  status: 'Rascunho' | 'Enviado' | 'Recebido' | 'Cancelado'
}

export type AppState = {
  currentUserRole: Role
  students: Student[]
  leads: Lead[]
  payments: Payment[]
  teachers: Teacher[]
  classes: ClassRoom[]
  schedules: Schedule[]
  logs: AuditLog[]
  notifications: SystemNotification[]
  attendances: AttendanceRecord[]
  employees: Employee[]
  products: Product[]
  stockMovements: StockMovement[]
  suppliers: Supplier[]
  purchaseOrders: PurchaseOrder[]
}
