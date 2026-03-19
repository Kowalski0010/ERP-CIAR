import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AppState, Student, Lead, Payment, Role } from '@/lib/types'
import { mockStudents, mockLeads, mockPayments } from '@/lib/mockData'

interface AppContextType extends AppState {
  setCurrentUserRole: (role: Role) => void
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, partial: Partial<Student>) => void
  registerPayment: (payment: Payment) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUserRole, setCurrentUserRole] = useState<Role>('Admin')
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)

  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev])

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  const addStudent = (student: Student) => setStudents((prev) => [student, ...prev])

  const updateStudent = (id: string, partial: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)))
  }

  const registerPayment = (payment: Payment) => setPayments((prev) => [payment, ...prev])

  return (
    <AppContext.Provider
      value={{
        currentUserRole,
        setCurrentUserRole,
        students,
        leads,
        payments,
        addLead,
        updateLeadStatus,
        addStudent,
        updateStudent,
        registerPayment,
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
