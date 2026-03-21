import {
  Student,
  Lead,
  Payment,
  Teacher,
  Schedule,
  ClassRoom,
  AuditLog,
  SystemNotification,
  AttendanceRecord,
  Employee,
  Product,
  StockMovement,
  Supplier,
  PurchaseOrder,
  CommunicationLog,
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
} from './types'

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
    documents: [
      {
        id: 'doc1',
        title: 'Contrato de Prestação de Serviços Educacionais',
        status: 'Pendente',
        date: '2023-02-15',
        type: 'Contrato',
      },
      {
        id: 'doc2',
        title: 'Termo de Aceite do Regulamento',
        status: 'Assinado',
        date: '2023-02-16',
        type: 'Termo',
      },
    ],
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
    documents: [
      {
        id: 'doc3',
        title: 'Contrato de Prestação de Serviços Educacionais',
        status: 'Pendente',
        date: '2023-03-01',
        type: 'Contrato',
      },
    ],
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
    capacity: 40,
  },
  {
    id: 'T02',
    name: 'Design Gráfico - 3º Sem',
    course: 'Design',
    semester: '3º Semestre',
    capacity: 30,
  },
  {
    id: 'T03',
    name: 'Administração - 1º Sem',
    course: 'Administração',
    semester: '1º Semestre',
    capacity: 50,
  },
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
  {
    id: 's3',
    classId: 'T01',
    subject: 'Lógica de Programação',
    teacherId: 't1',
    room: 'Lab Info 3',
    dayOfWeek: 'Terça',
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
    id: 'p3',
    studentId: '1',
    studentName: 'Ana Silva',
    amount: 850.0,
    dueDate: '2023-11-05',
    status: 'Pendente',
    installmentNumber: 2,
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
  { month: 'Mar', receitas: 60000, despesas: 36000 },
  { month: 'Abr', receitas: 58000, despesas: 35000 },
]

export const mockLogs: AuditLog[] = [
  {
    id: 'log1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'Admin Master',
    action: 'Atualizou Status',
    entity: 'Lead: João Pedro',
    oldValue: 'Novo',
    newValue: 'Contatado',
  },
  {
    id: 'log2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: 'Gestor Acadêmico',
    action: 'Criou Turma',
    entity: 'Turma: T03 - Administração',
    newValue: 'Capacidade: 50',
  },
  {
    id: 'log3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: 'Analista Financeiro',
    action: 'Confirmou Pagamento',
    entity: 'Fatura: INV-8829',
    oldValue: 'Pendente',
    newValue: 'Pago',
  },
]

export const mockNotifications: SystemNotification[] = [
  {
    id: 'n1',
    title: 'Manutenção Programada',
    message: 'O sistema ficará indisponível no domingo das 02h às 04h.',
    type: 'Warning',
    date: new Date().toISOString(),
    target: 'Todos',
    read: false,
  },
  {
    id: 'n2',
    title: 'Boletos Liberados',
    message: 'As faturas do mês vigente já estão disponíveis no portal.',
    type: 'Info',
    date: new Date(Date.now() - 86400000).toISOString(),
    target: 'Alunos',
    read: true,
  },
]

export const mockCommunicationLogs: CommunicationLog[] = [
  {
    id: 'EV-001',
    recipient: 'Ana Silva',
    channel: 'Email',
    subject: 'Aviso de Matrícula',
    status: 'Entregue',
    date: '2023-10-25 10:30',
    body: 'Olá Ana, sua rematrícula foi processada com sucesso. Acesse o portal...',
  },
]

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', studentId: '1', subject: 'Cálculo I', totalClasses: 40, absences: 2 },
  { id: 'a2', studentId: '1', subject: 'Física', totalClasses: 40, absences: 8 },
]

export const mockEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Márcia Ferreira',
    department: 'Secretaria Acadêmica',
    position: 'Coordenadora',
    status: 'Ativo',
    email: 'marcia@edusync.com',
    phone: '(11) 98888-1111',
    admissionDate: '2019-05-10',
    salary: 5500.0,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=20',
  },
]

export const mockProducts: Product[] = [
  {
    id: 'pr1',
    sku: 'MAT-001',
    name: 'Resma de Papel A4',
    category: 'Material de Escritório',
    currentQuantity: 15,
    minQuantity: 20,
    unit: 'Caixa',
    price: 18.5,
  },
]

export const mockMovements: StockMovement[] = [
  {
    id: 'm1',
    productId: 'pr1',
    productName: 'Resma de Papel A4',
    type: 'Saída',
    quantity: 5,
    date: '2023-10-25T14:30:00Z',
    user: 'Márcia Ferreira',
    reason: 'Uso na Secretaria',
  },
]

export const mockSuppliers: Supplier[] = [
  {
    id: 'sp1',
    name: 'Kalunga Materiais',
    taxId: '43.283.811/0001-50',
    contact: 'Vendas Corporativas',
    email: 'vendas@kalunga.com.br',
    phone: '(11) 3333-4444',
    rating: 5,
    status: 'Ativo',
  },
]

export const mockOrders: PurchaseOrder[] = [
  {
    id: 'PO-1001',
    supplierId: 'sp1',
    supplierName: 'Kalunga Materiais',
    date: '2023-10-20',
    expectedDelivery: '2023-10-27',
    totalAmount: 1540.0,
    status: 'Recebido',
  },
]

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'c1',
    senderId: 'e1',
    senderName: 'Márcia Ferreira',
    senderRole: 'Secretaria',
    content: 'Bom dia equipe, os contratos da turma T01 já estão liberados.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
]

export const mockCursos: Curso[] = [
  {
    id: 'C01',
    name: 'Engenharia de Software',
    mode: 'Presencial',
    duration: 3600,
    status: 'Ativo',
    date: '2023-01-10',
  },
  {
    id: 'C02',
    name: 'Direito',
    mode: 'Presencial',
    duration: 4000,
    status: 'Ativo',
    date: '2023-01-12',
  },
]

export const mockAvaliacoes: Avaliacao[] = [
  {
    id: 'A01',
    name: 'Prova N1',
    subject: 'Cálculo Avançado',
    type: 'Prova Escrita',
    date: '2023-04-15',
    status: 'Ativo',
  },
]

export const mockConvenios: Convenio[] = [
  {
    id: 'CV01',
    name: 'Sindicato dos Bancários',
    contract: 'CONV-2023',
    discount: 15,
    date: '2023-02-01',
    status: 'Ativo',
  },
]

export const mockCeps: CepRecord[] = [
  {
    id: 'CEP01',
    cep: '01310-100',
    street: 'Avenida Paulista',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    date: '2023-05-10',
    status: 'Ativo',
  },
]

export const mockDisciplinas: Disciplina[] = [
  { id: 'D01', name: 'Banco de Dados', workload: 80, status: 'Ativo', date: '2023-01-15' },
]

export const mockBooks: Book[] = [
  {
    id: 'B001',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    totalCopies: 5,
    availableCopies: 3,
    coverUrl: 'https://img.usecurling.com/p/200/300?q=code&color=blue',
  },
  {
    id: 'B002',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '978-0201616224',
    totalCopies: 3,
    availableCopies: 0,
    coverUrl: 'https://img.usecurling.com/p/200/300?q=code&color=purple',
  },
  {
    id: 'B003',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '978-0201633610',
    totalCopies: 4,
    availableCopies: 1,
    coverUrl: 'https://img.usecurling.com/p/200/300?q=design&color=red',
  },
  {
    id: 'B004',
    title: 'Direito Constitucional',
    author: 'Alexandre de Moraes',
    isbn: '978-8522400001',
    totalCopies: 6,
    availableCopies: 2,
    coverUrl: 'https://img.usecurling.com/p/200/300?q=law&color=gray',
  },
]

export const mockLoans: Loan[] = [
  {
    id: 'L001',
    bookId: 'B001',
    bookTitle: 'Clean Code',
    studentId: '1',
    studentName: 'Ana Silva',
    loanDate: '2023-10-01',
    expectedReturnDate: new Date(Date.now() - 86400000 * 5).toISOString(), // Atrasado 5 dias
    status: 'Ativo',
  },
  {
    id: 'L002',
    bookId: 'B002',
    bookTitle: 'The Pragmatic Programmer',
    studentId: '2',
    studentName: 'Carlos Oliveira',
    loanDate: new Date().toISOString(),
    expectedReturnDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    status: 'Ativo',
  },
  {
    id: 'L003',
    bookId: 'B003',
    bookTitle: 'Design Patterns',
    studentId: '2',
    studentName: 'Carlos Oliveira',
    loanDate: new Date(Date.now() - 86400000 * 20).toISOString(),
    expectedReturnDate: new Date(Date.now() - 86400000 * 6).toISOString(), // Atrasado 6 dias
    status: 'Ativo',
  },
  {
    id: 'L004',
    bookId: 'B001',
    bookTitle: 'Clean Code',
    studentId: '2',
    studentName: 'Carlos Oliveira',
    loanDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    expectedReturnDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'Ativo',
  },
  {
    id: 'L005',
    bookId: 'B004',
    bookTitle: 'Direito Constitucional',
    studentId: '1',
    studentName: 'Ana Silva',
    loanDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    expectedReturnDate: new Date(Date.now() - 86400000 * 16).toISOString(), // Atrasado 16 dias
    status: 'Ativo',
  },
]

export const mockFeedbacks: StudentFeedback[] = [
  {
    id: 'f1',
    studentId: '1',
    studentName: 'Ana Silva',
    category: 'Dúvida',
    message: 'Gostaria de saber quando começam as provas N2 do curso de Engenharia.',
    status: 'Novo',
    date: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'f2',
    studentId: '2',
    studentName: 'Carlos Oliveira',
    category: 'Reclamação',
    message: 'O ar condicionado da sala T02 está com defeito há 3 dias.',
    status: 'Lido',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: 'REQ-A01',
    requesterName: 'Ana Silva',
    type: 'Documento',
    date: new Date(Date.now() - 3600000).toISOString(),
    details: 'Emissão de Histórico Escolar Parcial',
    status: 'Pendente',
  },
  {
    id: 'REQ-A02',
    requesterName: 'Carlos Oliveira',
    type: 'Mudança de Turma',
    date: new Date(Date.now() - 86400000).toISOString(),
    details: 'Transferência da Turma T01 para T02 (Noturno)',
    status: 'Pendente',
  },
  {
    id: 'REQ-A03',
    requesterName: 'Beatriz Souza',
    type: 'Documento',
    date: new Date(Date.now() - 172800000).toISOString(),
    details: 'Declaração de Vínculo com Grade',
    status: 'Aprovado',
  },
]
