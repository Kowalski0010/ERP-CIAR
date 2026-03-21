import React, { createContext, useContext, useState, ReactNode } from 'react'
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
} from '@/lib/mockData'

interface AppContextType extends AppState {
  login: () => void
  logout: () => void
  setCurrentUserRole: (role: Role) => void
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  updateStudent: (id: string, partial: Partial<Student>) => void
  suspendStudent: (studentId: string, reason: string) => void
  registerPayment: (payment: Payment) => void
  addTeacher: (teacher: Teacher) => void
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
  registerOccurrence: (studentId: string, text: string) => void
  generateContract: (studentId: string) => void
  signDocument: (studentId: string, documentId: string) => void
  sendChatMessage: (content: string) => void

  addCurso: (data: Partial<Curso>) => void
  addAvaliacao: (data: Partial<Avaliacao>) => void
  addConvenio: (data: Partial<Convenio>) => void
  addCep: (data: Partial<CepRecord>) => void
  addDisciplina: (data: Partial<Disciplina>) => void

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
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void

  addCandidate: (candidate: Omit<Candidate, 'id' | 'status' | 'dateApplied'>) => void
  updateCandidateStatus: (id: string, status: Candidate['status']) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<Role>('Admin')
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
  const [employees] = useState<Employee[]>(mockEmployees)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockMovements)
  const [suppliers] = useState<Supplier[]>(mockSuppliers)
  const [purchaseOrders] = useState<PurchaseOrder[]>(mockOrders)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)

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

  const login = () => setIsAuthenticated(true)
  const logout = () => setIsAuthenticated(false)

  const generateId = (prefix: string) => `${prefix}${Math.floor(Math.random() * 10000)}`

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts((prev) => [{ ...product, id: generateId('PRD') }, ...prev])
  }

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    setStockMovements((prev) => [
      { ...movement, id: generateId('MOV'), date: new Date().toISOString() },
      ...prev,
    ])
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === movement.productId) {
          const newQty =
            movement.type === 'Entrada'
              ? p.currentQuantity + movement.quantity
              : Math.max(0, p.currentQuantity - movement.quantity)
          return { ...p, currentQuantity: newQty }
        }
        return p
      }),
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

  const addCurso = (data: Partial<Curso>) => {
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
  }

  const addAvaliacao = (data: Partial<Avaliacao>) => {
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
  }

  const addConvenio = (data: Partial<Convenio>) => {
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
  }

  const addCep = (data: Partial<CepRecord>) => {
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
  }

  const addDisciplina = (data: Partial<Disciplina>) => {
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
  }

  const addClass = (cls: Partial<ClassRoom>) => {
    setClasses((prev) => [
      {
        id: cls.id!,
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
    addLog({
      user: currentUserRole,
      action: 'Criou Nova Turma',
      entity: `Turma: ${cls.name}`,
    })
  }

  const updateClass = (id: string, partial: Partial<ClassRoom>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)))
    addLog({
      user: currentUserRole,
      action: 'Atualizou Turma',
      entity: `Turma: ${partial.name || id}`,
    })
  }

  const deleteClass = (id: string) => {
    const cls = classes.find((c) => c.id === id)
    setClasses((prev) => prev.filter((c) => c.id !== id))
    addLog({
      user: currentUserRole,
      action: 'Excluiu Turma',
      entity: `Turma: ${cls?.name || id}`,
    })
  }

  const addBook = (book: Omit<Book, 'id'>) => {
    setBooks((prev) => [{ ...book, id: generateId('B') }, ...prev])
  }

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
          const isLate = new Date() > new Date(l.expectedReturnDate)
          if (isLate) {
            generateInvoice(l.studentId, 15.0)
            addCommunicationLog({
              recipient: l.studentName,
              channel: 'Email',
              subject: 'Multa de Biblioteca Registrada',
              body: `Prezado aluno, o livro "${l.bookTitle}" foi devolvido com atraso. Uma multa de R$ 15,00 foi adicionada ao seu painel financeiro.`,
            })
          }
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

  const addFeedback = (fb: Omit<StudentFeedback, 'id' | 'date' | 'status'>) => {
    setFeedbacks((prev) => [
      { ...fb, id: generateId('FB'), status: 'Novo', date: new Date().toISOString() },
      ...prev,
    ])
  }

  const updateFeedbackStatus = (id: string, status: StudentFeedback['status']) => {
    setFeedbacks((prev) => prev.map((fb) => (fb.id === id ? { ...fb, status } : fb)))
  }

  const replyFeedback = (id: string, reply: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, reply, status: 'Respondido' } : fb)),
    )
  }

  const simulatePaymentReconciliation = () => {
    let count = 0
    setPayments((prev) =>
      prev.map((p) => {
        if (p.status === 'Pendente' && Math.random() > 0.4) {
          count++
          addLog({
            user: 'Sistema / Gateway',
            action: 'Conciliação de Pagamentos',
            entity: `Fatura: ${p.id}`,
            oldValue: 'Pendente',
            newValue: 'Pago',
          })
          return { ...p, status: 'Pago' }
        }
        return p
      }),
    )
    if (count > 0) {
      sendNotification({
        title: 'Conciliação Concluída',
        message: `${count} faturas foram marcadas como "Pago" através da integração com o Gateway.`,
        target: 'Financeiro',
        type: 'Success',
      })
    }
  }

  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const signDocument = (studentId: string, documentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            documents: s.documents?.map((d) =>
              d.id === documentId ? { ...d, status: 'Assinado' } : d,
            ),
          }
        }
        return s
      }),
    )
  }

  const sendChatMessage = (content: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'current',
      senderName: currentUserRole === 'Aluno' ? students[0]?.name : 'Usuário Atual',
      senderRole: currentUserRole,
      content,
      timestamp: new Date().toISOString(),
    }
    setChatMessages((prev) => [...prev, newMsg])
  }

  const addCommunicationLog = (log: Omit<CommunicationLog, 'id' | 'date' | 'status'>) => {
    const newLog: CommunicationLog = {
      ...log,
      id: `EV-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Entregue',
    }
    setCommunicationLogs((prev) => [newLog, ...prev])
  }

  const sendNotification = (notification: Omit<SystemNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [newNotif, ...prev])
    addLog({
      user: currentUserRole,
      action: 'Enviou Notificação',
      entity: `Público: ${notification.target}`,
    })
  }

  const generateInvoice = (studentId: string, amount: number) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return

    const newPayment: Payment = {
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      studentId: student.id,
      studentName: student.name,
      amount,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pendente',
    }

    setPayments((prev) => [newPayment, ...prev])
    addLog({
      user: currentUserRole,
      action: 'Gerou Fatura Avulsa',
      entity: `Aluno: ${student.name}`,
    })
  }

  const registerOccurrence = (studentId: string, text: string) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return

    const newObs = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      author: currentUserRole,
      text,
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, observations: [...(s.observations || []), newObs] } : s,
      ),
    )
    addLog({
      user: currentUserRole,
      action: 'Registro de Ocorrência',
      entity: `Módulo: Secretaria`,
      targetStudent: student.name,
    })
    addCommunicationLog({
      recipient: student.email,
      channel: 'Email',
      subject: 'Nova Ocorrência',
      body: `Aviso: ${text}`,
    })
  }

  const generateContract = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return
    addLog({
      user: currentUserRole,
      action: 'Emissão de Contrato',
      entity: `Módulo: Secretaria`,
      targetStudent: student.name,
    })
    addCommunicationLog({
      recipient: student.email,
      channel: 'Email',
      subject: 'Contrato',
      body: `Olá ${student.name}, seu contrato...`,
    })
  }

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const addLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev])
    addLog({ user: currentUserRole, action: 'Criou Lead', entity: `Lead: ${lead.name}` })
  }

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    const lead = leads.find((l) => l.id === id)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    addLog({
      user: currentUserRole,
      action: `Atualizou Status do Lead`,
      entity: `Lead ID: ${id}`,
      oldValue: lead?.status,
      newValue: status,
    })
  }

  const updateStudent = (id: string, partial: Partial<Student>) => {
    const student = students.find((s) => s.id === id)
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)))
    addLog({
      user: currentUserRole,
      action: 'Atualizou Aluno',
      entity: `Módulo: Secretaria`,
      targetStudent: student?.name,
    })
  }

  const suspendStudent = (studentId: string, reason: string) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: 'Inativo' } : s)))
    const student = students.find((s) => s.id === studentId)
    sendNotification({
      title: 'Aviso Financeiro: Trancamento',
      message: `A matrícula do aluno ${student?.name} foi trancada.`,
      target: 'Financeiro',
      type: 'Warning',
    })
    addLog({
      user: currentUserRole,
      action: 'Trancamento de Matrícula',
      entity: `Módulo: Secretaria`,
      targetStudent: student?.name,
    })
  }

  const registerPayment = (payment: Payment) => {
    setPayments((prev) => [payment, ...prev])
  }

  const addTeacher = (teacher: Teacher) => {
    setTeachers((prev) => [teacher, ...prev])
    addLog({ user: currentUserRole, action: 'Cadastrou Docente', entity: teacher.name })
  }

  const addSchedule = (slot: Schedule) => {
    setSchedules((prev) => [...prev, slot])
    addLog({ user: currentUserRole, action: 'Alocou Horário', entity: `Turma: ${slot.classId}` })
  }

  const enrollStudent = (student: Student, plan: FinancialPlan, leadId?: string) => {
    setStudents((prev) => [student, ...prev])
    if (leadId) updateLeadStatus(leadId, 'Ganho')
    addLog({
      user: currentUserRole,
      action: 'Realizou Matrícula',
      entity: `Comercial/Secretaria`,
      targetStudent: student.name,
    })

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

  const approveRequest = (id: string) => {
    setApprovalRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Aprovado' } : r)))
    addLog({
      user: currentUserRole,
      action: 'Aprovação de Requerimento',
      entity: `ID: ${id}`,
      newValue: 'Aprovado',
    })
  }

  const rejectRequest = (id: string, reason: string) => {
    setApprovalRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejeitado', rejectionReason: reason } : r)),
    )
    addLog({
      user: currentUserRole,
      action: 'Rejeição de Requerimento',
      entity: `ID: ${id}`,
      newValue: 'Rejeitado',
    })
  }

  const addExtracurricularActivity = (activity: Omit<ExtracurricularActivity, 'id'>) => {
    setExtracurricularActivities((prev) => [...prev, { ...activity, id: generateId('EXT') }])
    addLog({
      user: currentUserRole,
      action: 'Criou Atividade Extracurricular',
      entity: `Atividade: ${activity.name}`,
    })
  }

  const enrollInExtracurricular = (studentId: string, activityId: string) => {
    const student = students.find((s) => s.id === studentId)
    const activity = extracurricularActivities.find((a) => a.id === activityId)
    if (!student || !activity) return

    const newEnrollment: ExtracurricularEnrollment = {
      id: generateId('EXM'),
      studentId,
      studentName: student.name,
      activityId,
      activityName: activity.name,
      enrollmentDate: new Date().toISOString(),
      status: 'Ativo',
    }

    setExtracurricularEnrollments((prev) => [newEnrollment, ...prev])
    generateInvoice(studentId, activity.monthlyFee)

    addLog({
      user: currentUserRole,
      action: 'Matrícula Extracurricular',
      entity: `Atividade: ${activity.name}`,
      targetStudent: student.name,
    })
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentUserRole,
        setCurrentUserRole,
        students,
        leads,
        payments,
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
        addLead,
        updateLeadStatus,
        updateStudent,
        suspendStudent,
        registerPayment,
        addTeacher,
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
        registerOccurrence,
        generateContract,
        signDocument,
        sendChatMessage,
        addCurso,
        addAvaliacao,
        addConvenio,
        addCep,
        addDisciplina,
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
        addStockMovement,
        addCandidate,
        updateCandidateStatus,
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
