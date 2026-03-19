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
} from '@/lib/types'
import {
  mockStudents,
  mockLeads,
  mockPayments,
  mockTeachers,
  mockClasses,
  mockSchedules,
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

  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev])

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  const updateStudent = (id: string, partial: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)))
  }

  const registerPayment = (payment: Payment) => setPayments((prev) => [payment, ...prev])

  const addTeacher = (teacher: Teacher) => setTeachers((prev) => [teacher, ...prev])

  const addSchedule = (slot: Schedule) => {
    const conflict = schedules.find(
      (s) =>
        s.teacherId === slot.teacherId &&
        s.dayOfWeek === slot.dayOfWeek &&
        ((slot.startTime >= s.startTime && slot.startTime < s.endTime) ||
          (slot.endTime > s.startTime && slot.endTime <= s.endTime) ||
          (slot.startTime <= s.startTime && slot.endTime >= s.endTime)),
    )
    if (conflict) {
      throw new Error(`O professor já possui aula na turma ${conflict.classId} neste horário.`)
    }
    setSchedules((prev) => [...prev, slot])
  }

  const enrollStudent = (student: Student, plan: FinancialPlan, leadId?: string) => {
    setStudents((prev) => [student, ...prev])

    if (leadId) {
      updateLeadStatus(leadId, 'Ganho')
    }

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
        addLead,
        updateLeadStatus,
        updateStudent,
        registerPayment,
        addTeacher,
        addSchedule,
        enrollStudent,
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
