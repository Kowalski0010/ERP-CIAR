import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import {
  AppState,
  Student,
  Lead,
  Payment,
  Role,
  Teacher,
  Schedule,
  ClassRoom,
  FinancialPlan,
  AuditLog,
  SystemNotification,
  CommunicationLog,
  AttendanceRecord,
  Employee,
  Product,
  StockMovement,
  Supplier,
  PurchaseOrder,
  ChatMessage,
  Curso,
  Avaliacao,
  Convenio,
  CepRecord,
  Disciplina,
  Book,
  Loan,
  StudentFeedback,
  ApprovalRequest,
  ExtracurricularActivity,
  ExtracurricularEnrollment,
  Candidate,
  SchoolEvent,
  NPSSurvey,
  AcrPatient,
  AcrRecord,
  AcrAppointment,
  SystemUser,
  CashFlowTransaction,
} from '@/lib/types'
import {
  mockStudents,
  mockLeads,
  mockPayments,
  mockTeachers,
  mockClasses,
  mockSchedules,
  mockLogs,
  mockNotifications,
  mockCommunicationLogs,
  mockAttendance,
  mockEmployees,
  mockProducts,
  mockMovements,
  mockSuppliers,
  mockOrders,
  mockChatMessages,
  mockCursos,
  mockAvaliacoes,
  mockConvenios,
  mockCeps,
  mockDisciplinas,
  mockBooks,
  mockLoans,
  mockFeedbacks,
  mockApprovalRequests,
  mockExtracurricularActivities,
  mockExtracurricularEnrollments,
  mockCandidates,
  mockSchoolEvents,
  mockSurveys,
  mockAcrPatients,
  mockAcrRecords,
  mockAcrAppointments,
  mockSystemUsers,
} from '@/lib/mockData'

interface AppContextType extends AppState {
  login: (role?: Role) => void
  logout: () => void
  setCurrentUserRole: (role: Role) => void
  addSystemUser: (user: Omit<SystemUser, 'id'>) => void
  updateSystemUser: (id: string, partial: Partial<SystemUser>) => void
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  updateStudent: (id: string, partial: Partial<Student>) => void
  deleteStudent: (id: string) => void
  suspendStudent: (studentId: string, reason: string) => void
  registerPayment: (payment: Payment) => void
  updatePayment: (id: string, partial: Partial<Payment>) => void
  addManualTransaction: (tx: Omit<CashFlowTransaction, 'id'>) => void
  updateManualTransaction: (id: string, partial: Partial<CashFlowTransaction>) => void
  deleteManualTransaction: (id: string) => void
  addTeacher: (teacher: Teacher) => void
  updateTeacher: (id: string, partial: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void
  addClass: (cls: Partial<ClassRoom>) => void
  updateClass: (id: string, cls: Partial<ClassRoom>) => void
  deleteClass: (id: string) => void
  addSchedule: (schedule: Schedule) => void
  enrollStudent: (student: Student, plan: FinancialPlan, leadId?: string) => void
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
  sendNotification: (notification: Omit<SystemNotification, 'id' | 'date' | 'read'>) => void
  addCommunicationLog: (log: Omit<CommunicationLog, 'id' | 'date' | 'status'>) => void
  generateInvoice: (studentId: string, amount: number) => void
  markNotificationsAsRead: () => void
  markNotificationAsRead: (id: string) => void
  registerOccurrence: (studentId: string, text: string) => void
  generateContract: (studentId: string) => void
  signDocument: (studentId: string, documentId: string) => void
  sendChatMessage: (content: string, receiverId?: string) => void

  addCurso: (data: Partial<Curso>) => void
  updateCurso: (id: string, data: Partial<Curso>) => void
  deleteCurso: (id: string) => void

  addAvaliacao: (data: Partial<Avaliacao>) => void
  updateAvaliacao: (id: string, data: Partial<Avaliacao>) => void
  deleteAvaliacao: (id: string) => void

  addConvenio: (data: Partial<Convenio>) => void
  updateConvenio: (id: string, data: Partial<Convenio>) => void
  deleteConvenio: (id: string) => void

  addCep: (data: Partial<CepRecord>) => void
  updateCep: (id: string, data: Partial<CepRecord>) => void
  deleteCep: (id: string) => void

  addDisciplina: (data: Partial<Disciplina>) => void
  updateDisciplina: (id: string, data: Partial<Disciplina>) => void
  deleteDisciplina: (id: string) => void

  addBook: (book: Omit<Book, 'id'>) => void
  addLoan: (loan: Omit<Loan, 'id' | 'status'>) => void
  returnLoan: (loanId: string) => void

  addFeedback: (fb: Omit<StudentFeedback, 'id' | 'date' | 'status'>) => void
  updateFeedbackStatus: (id: string, status: StudentFeedback['status']) => void
  replyFeedback: (id: string, reply: string) => void

  simulatePaymentReconciliation: () => void

  approveRequest: (id: string) => void
  rejectRequest: (id: string, reason: string) => void

  addExtracurricularActivity: (activity: Omit<ExtracurricularActivity, 'id'>) => void
  enrollInExtracurricular: (studentId: string, activityId: string) => void

  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, partial: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void

  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, partial: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  addCandidate: (candidate: Omit<Candidate, 'id' | 'status' | 'dateApplied'>) => void
  updateCandidateStatus: (id: string, status: Candidate['status']) => void

  addSchoolEvent: (event: Omit<SchoolEvent, 'id' | 'rsvp'>) => void
  addSurvey: (survey: Omit<NPSSurvey, 'id' | 'status' | 'results' | 'comments'>) => void
  rsvpEvent: (id: string, response: 'yes' | 'no') => void

  addAcrPatient: (patient: Omit<AcrPatient, 'id' | 'registrationDate'>) => void
  updateAcrPatient: (id: string, partial: Partial<AcrPatient>) => void
  deleteAcrPatient: (id: string) => void
  addAcrRecord: (record: Omit<AcrRecord, 'id' | 'date' | 'professional'>) => void
  addAcrAppointment: (app: Omit<AcrAppointment, 'id'>) => void
  signAcrRecord: (id: string) => void
  addAcrAttachment: (recordId: string, attachment: Omit<AcrAttachment, 'id' | 'date'>) => void

  bulkImportData: (type: 'students' | 'classes' | 'teachers', data: any[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sio_auth') === 'true'
    } catch {
      return false
    }
  })

  const [currentUserRole, setCurrentUserRoleState] = useState<Role>(() => {
    try {
      return (localStorage.getItem('sio_role') as Role) || 'Admin'
    } catch {
      return 'Admin'
    }
  })

  const setCurrentUserRole = (role: Role) => {
    setCurrentUserRoleState(role)
    try {
      localStorage.setItem('sio_role', role)
    } catch (e) {
      console.warn('LocalStorage unavailable')
    }
  }

  const login = (role?: Role) => {
    setIsAuthenticated(true)
    try {
      localStorage.setItem('sio_auth', 'true')
    } catch (e) {
      console.warn('LocalStorage unavailable')
    }
    if (role) setCurrentUserRole(role)

    addLog({
      user: role || currentUserRole,
      action: 'Acesso ao Sistema',
      entity: 'Autenticação',
      details: 'Login realizado com sucesso.',
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    try {
      localStorage.removeItem('sio_auth')
      localStorage.removeItem('sio_role')
    } catch (e) {
      console.warn('LocalStorage unavailable')
    }
  }

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(mockSystemUsers)
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [classes, setClasses] = useState<ClassRoom[]>(mockClasses)
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules)
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs)
  const [notifications, setNotifications] = useState<SystemNotification[]>(mockNotifications)
  const [communicationLogs, setCommunicationLogs] =
    useState<CommunicationLog[]>(mockCommunicationLogs)
  const [attendances] = useState<AttendanceRecord[]>(mockAttendance)
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockMovements)
  const [suppliers] = useState<Supplier[]>(mockSuppliers)
  const [purchaseOrders] = useState<PurchaseOrder[]>(mockOrders)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)

  const [manualTransactions, setManualTransactions] = useState<CashFlowTransaction[]>([
    {
      id: 'e1',
      date: new Date().toISOString(),
      description: 'Pagamento Fornecedor (Luz/Água)',
      type: 'Saída',
      amount: 450.0,
    },
    {
      id: 'e2',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: 'Manutenção Predial',
      type: 'Saída',
      amount: 150.0,
    },
  ])

  const [cursos, setCursos] = useState<Curso[]>(mockCursos)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(mockAvaliacoes)
  const [convenios, setConvenios] = useState<Convenio[]>(mockConvenios)
  const [ceps, setCeps] = useState<CepRecord[]>(mockCeps)
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(mockDisciplinas)
  const [books, setBooks] = useState<Book[]>(mockBooks)
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>(mockFeedbacks)
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests)
  const [extracurricularActivities, setExtracurricularActivities] = useState<
    ExtracurricularActivity[]
  >(mockExtracurricularActivities)
  const [extracurricularEnrollments, setExtracurricularEnrollments] = useState<
    ExtracurricularEnrollment[]
  >(mockExtracurricularEnrollments)
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [schoolEvents, setSchoolEvents] = useState<SchoolEvent[]>(mockSchoolEvents)
  const [surveys, setSurveys] = useState<NPSSurvey[]>(mockSurveys)
  const [acrPatients, setAcrPatients] = useState<AcrPatient[]>(mockAcrPatients)
  const [acrRecords, setAcrRecords] = useState<AcrRecord[]>(mockAcrRecords)
  const [acrAppointments, setAcrAppointments] = useState<AcrAppointment[]>(mockAcrAppointments)

  const generateId = (prefix: string) => `${prefix}${Math.floor(Math.random() * 10000)}`

  const addSystemUser = (user: Omit<SystemUser, 'id'>) => {
    setSystemUsers((prev) => [{ ...user, id: generateId('USR') }, ...prev])
  }

  const updateSystemUser = (id: string, partial: Partial<SystemUser>) => {
    setSystemUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...partial } : u)))
  }

  const addManualTransaction = (tx: Omit<CashFlowTransaction, 'id'>) => {
    setManualTransactions((prev) => [{ ...tx, id: generateId('TX-') }, ...prev])
  }

  const updateManualTransaction = (id: string, partial: Partial<CashFlowTransaction>) => {
    setManualTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...partial } : t)))
  }

  const deleteManualTransaction = (id: string) => {
    setManualTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const addAcrPatient = (patient: Omit<AcrPatient, 'id' | 'registrationDate'>) => {
    setAcrPatients((prev) => [
      { ...patient, id: generateId('ACR-P'), registrationDate: new Date().toISOString() },
      ...prev,
    ])
  }

  const updateAcrPatient = (id: string, partial: Partial<AcrPatient>) => {
    setAcrPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)))
  }

  const deleteAcrPatient = (id: string) => {
    setAcrPatients((prev) => prev.filter((p) => p.id !== id))
  }

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts((prev) => [{ ...product, id: generateId('PRD') }, ...prev])
  }

  const updateProduct = (id: string, partial: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    setEmployees((prev) => [{ ...emp, id: generateId('EMP') }, ...prev])
  }

  const updateEmployee = (id: string, partial: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...partial } : e)))
  }

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  const updateStudent = (id: string, partial: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)))
  }

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  const addTeacher = (teacher: Teacher) => {
    setTeachers((prev) => [teacher, ...prev])
  }

  const updateTeacher = (id: string, partial: Partial<Teacher>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...partial } : t)))
  }

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id))
  }

  const suspendStudent = (studentId: string, reason: string) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: 'Inativo' } : s)))
  }

  const bulkImportData = (type: 'students' | 'classes' | 'teachers', data: any[]) => {
    if (type === 'students') {
      const newStudents = data.map((d) => ({
        ...d,
        id: generateId('S'),
        status: 'Ativo',
        enrollmentDate: new Date().toISOString(),
      }))
      setStudents((prev) => [...newStudents, ...prev])
    } else if (type === 'classes') {
      const newClasses = data.map((d) => ({ ...d, id: generateId('T') }))
      setClasses((prev) => [...newClasses, ...prev])
    } else if (type === 'teachers') {
      const newTeachers = data.map((d) => ({ ...d, id: generateId('P'), status: 'Ativo' }))
      setTeachers((prev) => [...newTeachers, ...prev])
    }
  }

  const addAcrRecord = (record: Omit<AcrRecord, 'id' | 'date' | 'professional'>) => {
    setAcrRecords((prev) => [
      {
        ...record,
        id: generateId('REC'),
        date: new Date().toISOString(),
        professional: currentUserRole,
        attachments: [],
      },
      ...prev,
    ])
  }

  const signAcrRecord = (id: string) => {
    setAcrRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, signed: true, signedAt: new Date().toISOString(), signedBy: currentUserRole }
          : r,
      ),
    )
  }

  const addAcrAttachment = (recordId: string, attachment: Omit<AcrAttachment, 'id' | 'date'>) => {
    setAcrRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              attachments: [
                ...(r.attachments || []),
                { ...attachment, id: generateId('ATT'), date: new Date().toISOString() },
              ],
            }
          : r,
      ),
    )
  }

  const addAcrAppointment = (app: Omit<AcrAppointment, 'id'>) => {
    setAcrAppointments((prev) => [{ ...app, id: generateId('APP') }, ...prev])
  }

  const addSchoolEvent = (event: Omit<SchoolEvent, 'id' | 'rsvp'>) => {
    setSchoolEvents((prev) => [
      { ...event, id: generateId('EVT'), rsvp: { yes: 0, no: 0, pending: 0 } },
      ...prev,
    ])
  }

  const rsvpEvent = (id: string, response: 'yes' | 'no') => {
    setSchoolEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? {
              ...ev,
              rsvp: {
                ...ev.rsvp,
                yes: response === 'yes' ? ev.rsvp.yes + 1 : ev.rsvp.yes,
                no: response === 'no' ? ev.rsvp.no + 1 : ev.rsvp.no,
                pending: Math.max(0, ev.rsvp.pending - 1),
              },
            }
          : ev,
      ),
    )
  }

  const addSurvey = (survey: Omit<NPSSurvey, 'id' | 'status' | 'results' | 'comments'>) => {
    setSurveys((prev) => [
      {
        ...survey,
        id: generateId('NPS'),
        status: 'Ativo',
        results: { score: 0, promoters: 0, passives: 0, detractors: 0, total: 0 },
        comments: [],
      },
      ...prev,
    ])
  }

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    setStockMovements((prev) => [
      { ...movement, id: generateId('MOV'), date: new Date().toISOString() },
      ...prev,
    ])
    setProducts((prev) =>
      prev.map((p) =>
        p.id === movement.productId
          ? {
              ...p,
              currentQuantity:
                movement.type === 'Entrada'
                  ? p.currentQuantity + movement.quantity
                  : Math.max(0, p.currentQuantity - movement.quantity),
            }
          : p,
      ),
    )
  }

  const addCandidate = (candidate: Omit<Candidate, 'id' | 'status' | 'dateApplied'>) => {
    setCandidates((prev) => [
      {
        ...candidate,
        id: generateId('CAND'),
        status: 'Novo',
        dateApplied: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const updateCandidateStatus = (id: string, status: Candidate['status']) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
  }

  const addCurso = (data: Partial<Curso>) =>
    setCursos((prev) => [
      {
        id: generateId('C'),
        name: data.name!,
        mode: data.mode!,
        duration: data.duration!,
        status: 'Ativo',
        date: new Date().toLocaleDateString(),
        description: data.description,
      },
      ...prev,
    ])
  const updateCurso = (id: string, data: Partial<Curso>) =>
    setCursos((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteCurso = (id: string) => setCursos((prev) => prev.filter((c) => c.id !== id))

  const addAvaliacao = (data: Partial<Avaliacao>) =>
    setAvaliacoes((prev) => [
      {
        id: generateId('A'),
        name: data.name!,
        subject: data.subject!,
        type: data.type!,
        status: 'Ativo',
        date: data.date || new Date().toLocaleDateString(),
      },
      ...prev,
    ])
  const updateAvaliacao = (id: string, data: Partial<Avaliacao>) =>
    setAvaliacoes((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)))
  const deleteAvaliacao = (id: string) => setAvaliacoes((prev) => prev.filter((a) => a.id !== id))

  const addConvenio = (data: Partial<Convenio>) =>
    setConvenios((prev) => [
      {
        id: generateId('CV'),
        name: data.name!,
        contract: data.contract!,
        discount: data.discount!,
        status: 'Ativo',
        date: data.date || new Date().toLocaleDateString(),
      },
      ...prev,
    ])
  const updateConvenio = (id: string, data: Partial<Convenio>) =>
    setConvenios((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteConvenio = (id: string) => setConvenios((prev) => prev.filter((c) => c.id !== id))

  const addCep = (data: Partial<CepRecord>) =>
    setCeps((prev) => [
      {
        id: generateId('CEP'),
        cep: data.cep!,
        street: data.street!,
        neighborhood: data.neighborhood!,
        city: data.city!,
        state: data.state!,
        status: 'Ativo',
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ])
  const updateCep = (id: string, data: Partial<CepRecord>) =>
    setCeps((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteCep = (id: string) => setCeps((prev) => prev.filter((c) => c.id !== id))

  const addDisciplina = (data: Partial<Disciplina>) =>
    setDisciplinas((prev) => [
      {
        id: generateId('D'),
        name: data.name!,
        workload: data.workload!,
        status: 'Ativo',
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ])
  const updateDisciplina = (id: string, data: Partial<Disciplina>) =>
    setDisciplinas((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)))
  const deleteDisciplina = (id: string) => setDisciplinas((prev) => prev.filter((d) => d.id !== id))

  const addClass = (cls: Partial<ClassRoom>) =>
    setClasses((prev) => [
      {
        id: cls.id || generateId('T'),
        name: cls.name!,
        course: cls.course!,
        semester: cls.semester!,
        capacity: cls.capacity,
        room: cls.room,
        year: cls.year,
        shift: cls.shift,
      },
      ...prev,
    ])
  const updateClass = (id: string, partial: Partial<ClassRoom>) =>
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)))
  const deleteClass = (id: string) => setClasses((prev) => prev.filter((c) => c.id !== id))

  const addBook = (book: Omit<Book, 'id'>) =>
    setBooks((prev) => [{ ...book, id: generateId('B') }, ...prev])
  const addLoan = (loan: Omit<Loan, 'id' | 'status'>) => {
    setLoans((prev) => [{ ...loan, id: generateId('L'), status: 'Ativo' }, ...prev])
    setBooks((prev) =>
      prev.map((b) =>
        b.id === loan.bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b,
      ),
    )
  }
  const returnLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          setBooks((booksPrev) =>
            booksPrev.map((b) =>
              b.id === l.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b,
            ),
          )
          return { ...l, status: 'Devolvido', returnDate: new Date().toISOString() }
        }
        return l
      }),
    )
  }

  const addFeedback = (fb: Omit<StudentFeedback, 'id' | 'date' | 'status'>) =>
    setFeedbacks((prev) => [
      { ...fb, id: generateId('FB'), status: 'Novo', date: new Date().toISOString() },
      ...prev,
    ])
  const updateFeedbackStatus = (id: string, status: StudentFeedback['status']) =>
    setFeedbacks((prev) => prev.map((fb) => (fb.id === id ? { ...fb, status } : fb)))
  const replyFeedback = (id: string, reply: string) =>
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, reply, status: 'Respondido' } : fb)),
    )

  const simulatePaymentReconciliation = () => {
    setPayments((prev) =>
      prev.map((p) =>
        p.status === 'Pendente' && Math.random() > 0.4 ? { ...p, status: 'Pago' } : p,
      ),
    )
  }

  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) =>
    setLogs((prev) => [
      { ...log, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() },
      ...prev,
    ])
  const signDocument = (studentId: string, documentId: string) =>
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              documents: s.documents?.map((d) =>
                d.id === documentId ? { ...d, status: 'Assinado' } : d,
              ),
            }
          : s,
      ),
    )
  const sendChatMessage = (content: string, receiverId?: string) =>
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        senderId: 'current',
        senderName: 'Current User',
        senderRole: currentUserRole,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
      },
    ])
  const addCommunicationLog = (log: Omit<CommunicationLog, 'id' | 'date' | 'status'>) =>
    setCommunicationLogs((prev) => [
      {
        ...log,
        id: `EV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().substring(0, 16),
        status: 'Entregue',
      },
      ...prev,
    ])
  const sendNotification = (notification: Omit<SystemNotification, 'id' | 'date' | 'read'>) =>
    setNotifications((prev) => [
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ])
  const generateInvoice = (studentId: string, amount: number) => {
    const student = students.find((s) => s.id === studentId)
    if (student)
      setPayments((prev) => [
        {
          id: `INV-${Math.floor(Math.random() * 10000)}`,
          studentId: student.id,
          studentName: student.name,
          amount,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Pendente',
        },
        ...prev,
      ])
  }
  const registerOccurrence = (studentId: string, text: string) =>
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              observations: [
                ...(s.observations || []),
                {
                  id: Math.random().toString(36).substr(2, 9),
                  date: new Date().toISOString(),
                  author: currentUserRole,
                  text,
                },
              ],
            }
          : s,
      ),
    )
  const generateContract = (studentId: string) => {}
  const markNotificationsAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  const markNotificationAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev])
  const updateLeadStatus = (id: string, status: Lead['status']) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  const registerPayment = (payment: Payment) => setPayments((prev) => [payment, ...prev])
  const updatePayment = (id: string, partial: Partial<Payment>) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)))
  }
  const addSchedule = (slot: Schedule) => setSchedules((prev) => [...prev, slot])
  const enrollStudent = (student: Student, plan: FinancialPlan, leadId?: string) => {
    setStudents((prev) => [student, ...prev])
    if (leadId) updateLeadStatus(leadId, 'Ganho')
    if (plan.installments > 0) {
      const newPayments: Payment[] = []
      const [year, month, day] = plan.firstDueDate.split('-').map(Number)
      let startDate = new Date(year, month - 1, day)
      for (let i = 0; i < plan.installments; i++) {
        const dueDate = new Date(startDate)
        dueDate.setMonth(dueDate.getMonth() + i)
        newPayments.push({
          id: Math.random().toString(36).substr(2, 9),
          studentId: student.id,
          studentName: student.name,
          amount: plan.value,
          dueDate: dueDate.toISOString().split('T')[0],
          status: 'Pendente',
          installmentNumber: i + 1,
          totalInstallments: plan.installments,
        })
      }
      setPayments((prev) => [...newPayments, ...prev])
    }
  }

  const approveRequest = (id: string) =>
    setApprovalRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Aprovado' } : r)))
  const rejectRequest = (id: string, reason: string) =>
    setApprovalRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejeitado', rejectionReason: reason } : r)),
    )
  const addExtracurricularActivity = (activity: Omit<ExtracurricularActivity, 'id'>) =>
    setExtracurricularActivities((prev) => [...prev, { ...activity, id: generateId('EXT') }])
  const enrollInExtracurricular = (studentId: string, activityId: string) => {
    const student = students.find((s) => s.id === studentId)
    const activity = extracurricularActivities.find((a) => a.id === activityId)
    if (student && activity) {
      setExtracurricularEnrollments((prev) => [
        {
          id: generateId('EXM'),
          studentId,
          studentName: student.name,
          activityId,
          activityName: activity.name,
          enrollmentDate: new Date().toISOString(),
          status: 'Ativo',
        },
        ...prev,
      ])
      generateInvoice(studentId, activity.monthlyFee)
    }
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentUserRole,
        setCurrentUserRole,
        systemUsers,
        students,
        leads,
        payments,
        manualTransactions,
        teachers,
        classes,
        schedules,
        logs,
        notifications,
        communicationLogs,
        attendances,
        employees,
        products,
        stockMovements,
        suppliers,
        purchaseOrders,
        chatMessages,
        cursos,
        avaliacoes,
        convenios,
        ceps,
        disciplinas,
        books,
        loans,
        feedbacks,
        approvalRequests,
        extracurricularActivities,
        extracurricularEnrollments,
        candidates,
        schoolEvents,
        surveys,
        acrPatients,
        acrRecords,
        acrAppointments,
        addSystemUser,
        updateSystemUser,
        addLead,
        updateLeadStatus,
        updateStudent,
        deleteStudent,
        suspendStudent,
        registerPayment,
        updatePayment,
        addManualTransaction,
        updateManualTransaction,
        deleteManualTransaction,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        updateClass,
        deleteClass,
        addSchedule,
        enrollStudent,
        addLog,
        sendNotification,
        addCommunicationLog,
        generateInvoice,
        markNotificationsAsRead,
        markNotificationAsRead,
        registerOccurrence,
        generateContract,
        signDocument,
        sendChatMessage,
        addCurso,
        updateCurso,
        deleteCurso,
        addAvaliacao,
        updateAvaliacao,
        deleteAvaliacao,
        addConvenio,
        updateConvenio,
        deleteConvenio,
        addCep,
        updateCep,
        deleteCep,
        addDisciplina,
        updateDisciplina,
        deleteDisciplina,
        addBook,
        addLoan,
        returnLoan,
        addFeedback,
        updateFeedbackStatus,
        replyFeedback,
        simulatePaymentReconciliation,
        approveRequest,
        rejectRequest,
        addExtracurricularActivity,
        enrollInExtracurricular,
        addProduct,
        updateProduct,
        deleteProduct,
        addStockMovement,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addCandidate,
        updateCandidateStatus,
        addSchoolEvent,
        addSurvey,
        rsvpEvent,
        addAcrPatient,
        updateAcrPatient,
        deleteAcrPatient,
        addAcrRecord,
        addAcrAppointment,
        signAcrRecord,
        addAcrAttachment,
        bulkImportData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within an AppProvider')
  return context
}
