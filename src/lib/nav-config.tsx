import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  FileSpreadsheet,
  DollarSign,
  PieChart,
  Target,
  Briefcase,
  Package,
  ArrowRightLeft,
  Truck,
  ShoppingCart,
  BellRing,
  BarChart3,
  ShieldAlert,
  Home,
  ClipboardList,
  Wallet,
  UserCircle,
  Settings,
  FileText,
  BookOpen,
  Files,
  Columns,
  Key,
  Mail,
} from 'lucide-react'

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const academicList = [
  'Acompanhamento Pedagógico',
  'Aprovar Atividade Compl.',
  'Consultar Notas',
  'Controle TCC',
  'Dispensar Disciplina',
  'Histórico Escolar',
  'Lançar Afastamento',
  'Lançar Atividade Compl.',
  'Lançar Estágios',
  'Lançar Forma Ingresso',
  'Lançar Frequência',
  'Lançar Notas',
  'Lançar Planejamento',
  'Logística Docente',
  'Ocorrência do docente',
]

export const reportsList = [
  'Alunos Ingressantes',
  'Dcto Integralização Curricular',
  'Diário de Classe',
  'Documentos Pendentes',
  'Edital de Notas',
  'Ficha de Equivalência',
  'Fichas de Cadastro',
  'Forma de Ingresso',
  'Pendência Docente (Frequência)',
  'Pendência Docente (Nota/Freq.)',
  'Performance Frequência',
  'Planilha Acadêmico',
  'Relação Alunos p/ Resultado',
  'Relação de Alunos com Faltas',
  'Relação de Alunos',
  'Relação de Alunos Bloqueados',
  'Relação de Alunos Concluintes',
  'Relação de Atividades Complementares',
  'Relação de Cancelamentos',
  'Relação de Disciplinas por Aluno',
  'Relação de Dispensa',
  'Relação de Notas por Avaliação',
  'Relação de Ocorrências',
  'Relação de Pré-Matrículas',
  'Relação de Turma por Professor',
  'Relação de Turmas',
  'Resumo Acad./Financeiro',
  'Resumo de Notas',
  'Saldo de Hora Aula a Ministrar',
  'Situação Geral do Aluno',
  'Transferências de Turma/Curso',
]

export const navGroups = [
  {
    label: 'Visão Geral',
    items: [{ title: 'Dashboard', icon: LayoutDashboard, url: '/' }],
  },
  {
    label: 'Módulo Acadêmico',
    items: [
      { title: 'Alunos', icon: Users, url: '/academic/students' },
      { title: 'Professores', icon: GraduationCap, url: '/academic/teachers' },
      { title: 'Turmas', icon: CalendarDays, url: '/academic/classes' },
      { title: 'Cronogramas', icon: ClockIcon, url: '/academic/schedules' },
      { title: 'Notas e Frequência', icon: FileSpreadsheet, url: '/academic/grades' },
    ],
  },
  {
    label: 'Controle Acadêmico',
    items: academicList.map((title) => ({
      title,
      icon: BookOpen,
      url: `/academic-control/${slugify(title)}`,
    })),
  },
  {
    label: 'Módulo Financeiro',
    items: [
      { title: 'Gestão de Faturas', icon: DollarSign, url: '/financial/payments' },
      { title: 'Fluxo de Caixa', icon: PieChart, url: '/financial/cash-flow' },
    ],
  },
  {
    label: 'Módulo Comercial',
    items: [{ title: 'CRM de Captação', icon: Target, url: '/commercial/leads' }],
  },
  {
    label: 'Módulo Operacional',
    items: [
      { title: 'Recursos Humanos', icon: Briefcase, url: '/hr/employees' },
      { title: 'Estoque', icon: Package, url: '/inventory/stock' },
      { title: 'Movimentações', icon: ArrowRightLeft, url: '/inventory/movements' },
      { title: 'Fornecedores', icon: Truck, url: '/purchasing/suppliers' },
      { title: 'Pedidos de Compra', icon: ShoppingCart, url: '/purchasing/orders' },
    ],
  },
  {
    label: 'Relatórios',
    items: reportsList.map((title) => ({
      title,
      icon: FileText,
      url: `/reports/${slugify(title)}`,
    })),
  },
  {
    label: 'Administração',
    items: [
      { title: 'Fluxos de Trabalho', icon: Columns, url: '/admin/workflows' },
      { title: 'Documentos (GED)', icon: Files, url: '/admin/documents' },
      { title: 'Central de Alertas', icon: BellRing, url: '/admin/notifications' },
      { title: 'Histórico de Envios', icon: Mail, url: '/admin/communications' },
      { title: 'Relatórios Gerenciais', icon: BarChart3, url: '/admin/reports' },
      { title: 'Controle de Acessos', icon: Key, url: '/admin/rbac' },
      { title: 'Auditoria (Logs)', icon: ShieldAlert, url: '/admin/logs' },
      { title: 'Configurações', icon: Settings, url: '/admin/settings' },
    ],
  },
  {
    label: 'Portal do Aluno',
    items: [
      { title: 'Meu Painel', icon: Home, url: '/student-area' },
      { title: 'Minha Agenda', icon: CalendarDays, url: '/student-area/schedule' },
      { title: 'Frequência', icon: ClipboardList, url: '/student-area/attendance' },
      { title: 'Financeiro', icon: Wallet, url: '/student-area/financial' },
      { title: 'Meu Perfil', icon: UserCircle, url: '/student-area/profile' },
    ],
  },
]

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
