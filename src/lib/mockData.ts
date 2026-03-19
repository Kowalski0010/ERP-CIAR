import { Student, Lead, Payment, Teacher, Schedule, ClassRoom } from './types'

const defaultAddress = {
  zipCode: '01001-000',
  street: 'Praça da Sé',
  number: '1',
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    status: 'Ativo',
    enrollmentDate: '2023-02-15',
    course: 'Engenharia de Software',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    address: defaultAddress,
    observations: [
      {
        id: 'obs1',
        date: '2023-10-20T10:00:00Z',
        author: 'Prof. Thiago',
        text: 'Aluna participativa.',
      },
    ],
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.o@email.com',
    status: 'Ativo',
    enrollmentDate: '2023-03-01',
    course: 'Administração',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    phone: '(21) 91234-5678',
    cpf: '098.765.432-11',
    rg: '98.765.432-1',
    address: defaultAddress,
  },
]

export const mockTeachers: Teacher[] = [
  {
    id: 't1',
    name: 'Dr. Roberto Lemos',
    email: 'roberto@edusync.com',
    phone: '(11) 99999-0001',
    cpf: '111.222.333-44',
    rg: '11.222.333-4',
    address: defaultAddress,
    subjects: ['Cálculo I', 'Física'],
    workload: 40,
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=10',
  },
  {
    id: 't2',
    name: 'Profa. Cláudia Dias',
    email: 'claudia@edusync.com',
    phone: '(11) 99999-0002',
    cpf: '555.666.777-88',
    rg: '55.666.777-8',
    address: defaultAddress,
    subjects: ['Design UI/UX'],
    workload: 20,
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=11',
  },
]

export const mockClasses: ClassRoom[] = [
  {
    id: 'T01',
    name: 'Engenharia de Software - 1º Sem',
    course: 'Engenharia',
    semester: '1º Semestre',
  },
  { id: 'T02', name: 'Design Gráfico - 3º Sem', course: 'Design', semester: '3º Semestre' },
]

export const mockSchedules: Schedule[] = [
  {
    id: 's1',
    classId: 'T01',
    subject: 'Cálculo I',
    teacherId: 't1',
    room: 'Sala 101',
    dayOfWeek: 'Segunda',
    startTime: '08:00',
    endTime: '09:40',
  },
  {
    id: 's2',
    classId: 'T02',
    subject: 'Design UI/UX',
    teacherId: 't2',
    room: 'Lab Mac 1',
    dayOfWeek: 'Segunda',
    startTime: '10:00',
    endTime: '11:40',
  },
]

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    name: 'João Pedro',
    phone: '(11) 99999-1111',
    courseInterest: 'Marketing',
    status: 'Novo',
    dateAdded: '2023-10-25',
  },
  {
    id: 'l2',
    name: 'Fernanda Lima',
    phone: '(41) 96666-4444',
    courseInterest: 'Direito',
    status: 'Pendente',
    dateAdded: '2023-10-18',
  },
]

export const mockPayments: Payment[] = [
  {
    id: 'p1',
    studentId: '1',
    studentName: 'Ana Silva',
    amount: 850.0,
    dueDate: '2023-10-05',
    status: 'Pago',
    installmentNumber: 1,
    totalInstallments: 12,
  },
  {
    id: 'p2',
    studentId: '2',
    studentName: 'Carlos Oliveira',
    amount: 720.0,
    dueDate: '2023-10-10',
    status: 'Pendente',
    installmentNumber: 2,
    totalInstallments: 12,
  },
]

export const mockFinancialChart = [
  { month: 'Jan', receitas: 45000, despesas: 32000 },
  { month: 'Fev', receitas: 52000, despesas: 34000 },
]
