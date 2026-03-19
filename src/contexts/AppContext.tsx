import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AppState, Student, Lead, Payment } from '@/lib/types'
import { mockStudents, mockLeads, mockPayments } from '@/lib/mockData'

interface AppContextType extends AppState {
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  addStudent: (student: Student) => void
  registerPayment: (payment: Payment) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)

  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev])

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  const addStudent = (student: Student) => setStudents((prev) => [student, ...prev])

  const registerPayment = (payment: Payment) => setPayments((prev) => [payment, ...prev])

  return (
    <AppContext.Provider
      value={{ students, leads, payments, addLead, updateLeadStatus, addStudent, registerPayment }}
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
