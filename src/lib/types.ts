export type Role =
  | 'Admin'
  | 'Gestao'
  | 'Secretaria'
  | 'Professor'
  | 'Financeiro'
  | 'Comercial'
  | 'Aluno'
  | 'Responsável'
  | 'Paciente'

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

export type DigitalDocument = {
  id: string
  title: string
  status: 'Pendente' | 'Assinado'
  date: string
  type: string
}

export type SystemAttachment = {
  id: string
  name: string
  url: string
  type: string
  date: string
}

export type SystemUser = {
  id: string
  name: string
  email: string
  role: Role
  status: 'Ativo' | 'Inativo'
  lastLogin?: string
}

export type Student = {
  id: string
  registrationCode?: string
  name: string
  email: string
  status: 'Ativo' | 'Inativo' | 'Formado'
  enrollmentDate: string
  course: string
  previousGraduation?: string
  avatar?: string
  phone?: string
  cpf?: string
  rg?: string
  rgIssuer?: string
  nationality?: string
  birthCity?: string
  birthDate?: string
  maritalStatus?: string
  motherName?: string
  fatherName?: string
  address?: Address
  observations?: Observation[]
  documents?: DigitalDocument[]
  attachments?: SystemAttachment[]
}

export type Teacher = {
  id: string
  registrationCode?: string
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
  capacity?: number
  room?: string
  year?: string
  shift?: string
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
  attachments?: SystemAttachment[]
}

export type CashFlowTransaction = {
  id: string
  date: string
  description: string
  type: 'Entrada' | 'Saída'
  amount: number
}

export type FinancialAccount = {
  id: string
  name: string
  type: 'Receita' | 'Despesa'
  description?: string
  createdAt: string
}

export type FinancialTransaction = {
  id: string
  accountId?: string
  accountName?: string
  description: string
  amount: number
  type: 'Receita' | 'Despesa'
  date: string
  status: 'Realizado' | 'Previsto'
  createdAt: string
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
  details?: string
  targetStudent?: string
  oldValue?: string
  newValue?: string
}

export type SystemNotification = {
  id: string
  title: string
  message: string
  type: 'Success' | 'Warning' | 'Info'
  date: string
  target: 'Todos' | 'Alunos' | 'Professores' | 'Staff' | 'Financeiro' | 'Pacientes'
  read: boolean
  userId?: string
}

export type CommunicationLog = {
  id: string
  recipient: string
  channel: 'Email' | 'SMS' | 'WhatsApp'
  subject: string
  status: 'Entregue' | 'Pendente' | 'Falha'
  date: string
  body: string
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
  registrationCode?: string
  name: string
  department: string
  position: string
  status: 'Ativo' | 'Inativo'
  email: string
  phone: string
  admissionDate: string
  salary: number
  avatar?: string
  attachments?: SystemAttachment[]
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

export type ChatMessage = {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  receiverId?: string
  content: string
  timestamp: string
}

export type Curso = {
  id: string
  name: string
  mode: string
  duration: number
  status: string
  date: string
  description?: string
}

export type Avaliacao = {
  id: string
  name: string
  subject: string
  type: string
  date: string
  status: string
}

export type Convenio = {
  id: string
  name: string
  contract: string
  discount: number
  date: string
  status: string
}

export type CepRecord = {
  id: string
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  date: string
  status: string
}

export type Disciplina = {
  id: string
  name: string
  workload: number
  status: string
  date: string
}

export type Book = {
  id: string
  title: string
  author: string
  isbn: string
  totalCopies: number
  availableCopies: number
  coverUrl?: string
}

export type Loan = {
  id: string
  bookId: string
  bookTitle: string
  studentId: string
  studentName: string
  loanDate: string
  expectedReturnDate: string
  returnDate?: string
  status: 'Ativo' | 'Devolvido' | 'Atrasado'
}

export type StudentFeedback = {
  id: string
  studentId: string
  studentName: string
  category: 'Sugestão' | 'Reclamação' | 'Dúvida'
  message: string
  status: 'Novo' | 'Lido' | 'Respondido' | 'Arquivado'
  date: string
  reply?: string
}

export type ApprovalRequest = {
  id: string
  requesterName: string
  type: 'Documento' | 'Mudança de Turma'
  date: string
  details: string
  status: 'Pendente' | 'Aprovado' | 'Rejeitado'
  rejectionReason?: string
}

export type ExtracurricularActivity = {
  id: string
  name: string
  category: string
  instructor: string
  schedule: string
  monthlyFee: number
  status: 'Ativo' | 'Inativo'
}

export type ExtracurricularEnrollment = {
  id: string
  studentId: string
  studentName: string
  activityId: string
  activityName: string
  enrollmentDate: string
  status: 'Ativo' | 'Cancelado'
}

export type Candidate = {
  id: string
  name: string
  email: string
  phone: string
  subjects: string
  status: 'Novo' | 'Em Avaliação' | 'Entrevista' | 'Aprovado' | 'Rejeitado'
  dateApplied: string
}

export type SchoolEvent = {
  id: string
  title: string
  category: string
  date: string
  time: string
  description: string
  rsvp: { yes: number; no: number; pending: number }
}

export type NPSSurvey = {
  id: string
  title: string
  target: string
  triggerBimester: string
  status: 'Ativo' | 'Rascunho' | 'Encerrado'
  results: { score: number; promoters: number; passives: number; detractors: number; total: number }
  comments: { id: string; text: string; date: string }[]
}

export type AcrPatient = {
  id: string
  name: string
  birthDate: string
  email: string
  phone: string
  background: string
  registrationDate: string
  attachments?: SystemAttachment[]
}

export type AcrAttachment = {
  id: string
  name: string
  date: string
  url: string
}

export type AcrRecord = {
  id: string
  patientId: string
  patientName: string
  date: string
  notes: string
  professional: string
  signed?: boolean
  signedAt?: string
  signedBy?: string
  attachments?: AcrAttachment[]
}

export type AcrAppointment = {
  id: string
  patientId: string
  patientName: string
  date: string
  value: number
  paymentMethod: string
  status: 'Realizado' | 'Agendado' | 'Cancelado'
  analysisType?: string
}

export type AppState = {
  isAuthenticated: boolean
  currentUserRole: Role
  systemUsers: SystemUser[]
  students: Student[]
  leads: Lead[]
  payments: Payment[]
  manualTransactions: CashFlowTransaction[]
  teachers: Teacher[]
  classes: ClassRoom[]
  schedules: Schedule[]
  logs: AuditLog[]
  notifications: SystemNotification[]
  communicationLogs: CommunicationLog[]
  attendances: AttendanceRecord[]
  employees: Employee[]
  products: Product[]
  stockMovements: StockMovement[]
  suppliers: Supplier[]
  purchaseOrders: PurchaseOrder[]
  chatMessages: ChatMessage[]
  cursos: Curso[]
  avaliacoes: Avaliacao[]
  convenios: Convenio[]
  ceps: CepRecord[]
  disciplinas: Disciplina[]
  books: Book[]
  loans: Loan[]
  feedbacks: StudentFeedback[]
  approvalRequests: ApprovalRequest[]
  extracurricularActivities: ExtracurricularActivity[]
  extracurricularEnrollments: ExtracurricularEnrollment[]
  candidates: Candidate[]
  schoolEvents: SchoolEvent[]
  surveys: NPSSurvey[]
  acrPatients: AcrPatient[]
  acrRecords: AcrRecord[]
  acrAppointments: AcrAppointment[]
}
