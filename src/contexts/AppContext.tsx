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
} from '@/lib/mockData'

interface AppContextType extends AppState {
  setCurrentUserRole: (role: Role) => void
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  updateStudent: (id: string, partial: Partial<Student>) => void
  suspendStudent: (studentId: string, reason: string) => void
  registerPayment: (payment: Payment) => void
  addTeacher: (teacher: Teacher) => void
  addSchedule: (schedule: Schedule) => void
  enrollStudent: (student: Student, plan: FinancialPlan, leadId?: string) => void
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
  sendNotification: (notification: Omit<SystemNotification, 'id' | 'date' | 'read'>) => void
  addCommunicationLog: (log: Omit<CommunicationLog, 'id' | 'date'>) => void
  generateInvoice: (studentId: string, amount: number) => void
  markNotificationsAsRead: () => void
  registerOccurrence: (studentId: string, text: string) => void
  generateContract: (studentId: string) => void
  signDocument: (studentId: string, documentId: string) => void
  sendChatMessage: (content: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
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
  const [products] = useState<Product[]>(mockProducts)
  const [stockMovements] = useState<StockMovement[]>(mockMovements)
  const [suppliers] = useState<Supplier[]>(mockSuppliers)
  const [purchaseOrders] = useState<PurchaseOrder[]>(mockOrders)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)

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

    const student = students.find((s) => s.id === studentId)
    const doc = student?.documents?.find((d) => d.id === documentId)

    addLog({
      user: currentUserRole,
      action: 'Assinatura Digital',
      entity: `Documento: ${doc?.title}`,
      targetStudent: student?.name,
      oldValue: 'Pendente',
      newValue: 'Assinado',
    })
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

  const addCommunicationLog = (log: Omit<CommunicationLog, 'id' | 'date'>) => {
    const newLog: CommunicationLog = {
      ...log,
      id: `EV-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
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
        s.id === studentId
          ? {
              ...s,
              observations: [...(s.observations || []), newObs],
            }
          : s,
      ),
    )

    addLog({
      user: currentUserRole,
      action: 'Registro de Ocorrência',
      entity: `Módulo: Secretaria`,
      targetStudent: student.name,
      details: `Nova ocorrência registrada: "${text}"`,
    })

    addCommunicationLog({
      recipient: student.email,
      channel: 'Email',
      subject: 'Nova Ocorrência Registrada',
      status: 'Entregue',
      body: `Prezado(a) responsável, informamos que uma nova ocorrência foi registrada para o(a) aluno(a) ${student.name}: \n\n${text}`,
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
      details: `Novo contrato letivo gerado e enviado por email.`,
    })

    addCommunicationLog({
      recipient: student.email,
      channel: 'Email',
      subject: 'Confirmação de Matrícula e Contrato',
      status: 'Entregue',
      body: `Olá ${student.name}, sua matrícula foi efetivada. Segue em anexo a cópia do seu contrato de prestação de serviços educacionais.`,
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

    const oldStr = student ? JSON.stringify(student).substring(0, 20) + '...' : undefined
    const newStr = JSON.stringify({ ...student, ...partial }).substring(0, 20) + '...'

    addLog({
      user: currentUserRole,
      action: 'Atualizou Aluno',
      entity: `Módulo: Secretaria`,
      targetStudent: student?.name,
      details: `Campos atualizados: ${Object.keys(partial).join(', ')}`,
      oldValue: oldStr,
      newValue: newStr,
    })
  }

  const suspendStudent = (studentId: string, reason: string) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: 'Inativo' } : s)))
    const student = students.find((s) => s.id === studentId)

    sendNotification({
      title: 'Aviso Financeiro: Trancamento de Matrícula',
      message: `A matrícula do aluno ${student?.name} (ID: ${student?.id}) foi trancada. Motivo: ${reason}. Favor revisar as faturas pendentes.`,
      target: 'Financeiro',
      type: 'Warning',
    })

    addLog({
      user: currentUserRole,
      action: 'Trancamento de Matrícula',
      entity: `Módulo: Secretaria`,
      targetStudent: student?.name,
      oldValue: 'Ativo',
      newValue: 'Inativo',
      details: `Motivo: ${reason}. Fluxo automático disparado.`,
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

    if (leadId) {
      updateLeadStatus(leadId, 'Ganho')
    }

    addLog({
      user: currentUserRole,
      action: 'Realizou Matrícula',
      entity: `Módulo: Comercial/Secretaria`,
      targetStudent: student.name,
      details: `Nova matrícula no curso: ${student.course}`,
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

  return (
    <AppContext.Provider
      value={{
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
        addLead,
        updateLeadStatus,
        updateStudent,
        suspendStudent,
        registerPayment,
        addTeacher,
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
