import { Student, Lead, Payment } from './types'

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
    address: 'Rua das Flores, 123, São Paulo - SP',
    rg: '12.345.678-9',
    cpf: '123.456.789-00',
    observations: [
      {
        id: 'obs1',
        date: '2023-10-20T10:00:00Z',
        author: 'Prof. Thiago',
        text: 'Aluna muito participativa nas aulas de laboratório.',
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
    address: 'Av. Brasil, 456, Rio de Janeiro - RJ',
    rg: '98.765.432-1',
    cpf: '098.765.432-11',
  },
  {
    id: '3',
    name: 'Beatriz Souza',
    email: 'bia.souza@email.com',
    status: 'Inativo',
    enrollmentDate: '2022-08-10',
    course: 'Direito',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
    phone: '(31) 99999-8888',
    address: 'Rua da Paz, 789, Belo Horizonte - MG',
  },
  {
    id: '4',
    name: 'Marcos Santos',
    email: 'marcos.s@email.com',
    status: 'Formado',
    enrollmentDate: '2019-01-20',
    course: 'Ciência da Computação',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
  },
]

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'João Pedro',
    phone: '(11) 99999-1111',
    courseInterest: 'Marketing',
    status: 'Novo',
    dateAdded: '2023-10-25',
  },
  {
    id: '2',
    name: 'Mariana Costa',
    phone: '(21) 98888-2222',
    courseInterest: 'Design Gráfico',
    status: 'Contatado',
    dateAdded: '2023-10-24',
  },
  {
    id: '3',
    name: 'Lucas Pereira',
    phone: '(31) 97777-3333',
    courseInterest: 'Engenharia',
    status: 'Visita',
    dateAdded: '2023-10-20',
  },
  {
    id: '4',
    name: 'Fernanda Lima',
    phone: '(41) 96666-4444',
    courseInterest: 'Direito',
    status: 'Pendente',
    dateAdded: '2023-10-18',
  },
]

export const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Ana Silva',
    amount: 850.0,
    dueDate: '2023-10-05',
    status: 'Pago',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Carlos Oliveira',
    amount: 720.0,
    dueDate: '2023-10-10',
    status: 'Pendente',
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Beatriz Souza',
    amount: 900.0,
    dueDate: '2023-09-15',
    status: 'Atrasado',
  },
]

export const mockFinancialChart = [
  { month: 'Jan', receitas: 45000, despesas: 32000 },
  { month: 'Fev', receitas: 52000, despesas: 34000 },
  { month: 'Mar', receitas: 48000, despesas: 31000 },
  { month: 'Abr', receitas: 61000, despesas: 36000 },
  { month: 'Mai', receitas: 59000, despesas: 35000 },
  { month: 'Jun', receitas: 65000, despesas: 38000 },
]
