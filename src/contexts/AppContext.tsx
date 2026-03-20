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
  AttendanceRecord,
  Employee,
  Product,
  StockMovement,
  Supplier,
  PurchaseOrder,
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
  mockAttendance,
  mockEmployees,
  mockProducts,
  mockMovements,
  mockSuppliers,
  mockOrders,
} from '@/lib/mockData'

interface AppContextType extends AppState {
  setCurrentUserRole: (role: Role) => void
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  updateStudent: (id: string, partial: Partial<Student>) => void
  registerPayment: (payment: Payment) => void
  addTeacher: (teacher: Teacher) => void
  addSchedule: (schedule: Schedule) => void
  enrollStudent: (student: Student, plan: FinancialPlan, leadId?: string) => void
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
  sendNotification: (notification: Omit<SystemNotification, 'id' | 'date' | 'read'>) => void
  generateInvoice: (studentId: string, amount: number) => void
  markNotificationsAsRead: () => void
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
  const [attendances] = useState<AttendanceRecord[]>(mockAttendance)

  const [employees] = useState<Employee[]>(mockEmployees)
  const [products] = useState<Product[]>(mockProducts)
  const [stockMovements] = useState<StockMovement[]>(mockMovements)
  const [suppliers] = useState<Supplier[]>(mockSuppliers)
  const [purchaseOrders] = useState<PurchaseOrder[]>(mockOrders)

  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }
    setLogs((prev) => [newLog, ...prev])
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

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const addLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev])
    addLog({ user: currentUserRole, action: 'Criou Lead', entity: `Lead: ${lead.name}` })
  }

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    addLog({ user: currentUserRole, action: `Moveu Lead para ${status}`, entity: `Lead ID: ${id}` })
  }

  const updateStudent = (id: string, partial: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)))
    addLog({ user: currentUserRole, action: 'Atualizou Aluno', entity: `Aluno ID: ${id}` })
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

    addLog({ user: currentUserRole, action: 'Realizou Matrícula', entity: student.name })

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
        attendances,
        employees,
        products,
        stockMovements,
        suppliers,
        purchaseOrders,
        addLead,
        updateLeadStatus,
        updateStudent,
        registerPayment,
        addTeacher,
        addSchedule,
        enrollStudent,
        addLog,
        sendNotification,
        generateInvoice,
        markNotificationsAsRead,
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
