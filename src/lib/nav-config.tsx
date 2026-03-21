import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Wallet,
  Settings,
  Shield,
  FileText,
  Mail,
  PieChart,
  HardHat,
  Bell,
  Activity,
  Package,
  ShoppingCart,
  TrendingUp,
  Building,
  UserCheck,
  CheckSquare,
  Lock,
  Clock,
  Search,
  DivideCircle,
  UserPlus,
  Printer,
  Wrench,
  AlertCircle,
  RotateCcw,
  Box,
  FileSpreadsheet,
  ArrowRightLeft,
  FileSearch,
  HelpCircle,
  BookCopy,
  BarChart,
  FolderOpen,
  MapPin,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    items: [{ title: 'Visão Geral', href: '/', icon: LayoutDashboard }],
  },
  {
    title: 'Portal do Aluno',
    items: [
      { title: 'Meu Painel', href: '/student/dashboard', icon: LayoutDashboard },
      { title: 'Agenda de Aulas', href: '/student/schedule', icon: Calendar },
      { title: 'Extrato Financeiro', href: '/student/financial', icon: Wallet },
      { title: 'Documentos', href: '/student/documents', icon: FolderOpen },
    ],
  },
  {
    title: 'Acadêmico',
    items: [
      { title: 'Agenda Acadêmica', href: '/academic/agenda', icon: Calendar },
      { title: 'Alunos', href: '/academic/students', icon: Users },
      { title: 'Professores', href: '/academic/teachers', icon: GraduationCap },
      { title: 'Turmas', href: '/academic/classes', icon: BookOpen },
      { title: 'Horários', href: '/academic/schedules', icon: Calendar },
      { title: 'Notas e Frequência', href: '/academic/grades', icon: CheckSquare },
      { title: 'Dashboard de Ocupação', href: '/academic/occupancy', icon: BarChart },
    ],
  },
  {
    title: 'Secretaria',
    items: [
      { title: '2ª via do Contrato', href: '/secretaria/2a-via-contrato', icon: FileText },
      { title: 'Bloquear Matrícula', href: '/secretaria/bloquear-matricula', icon: Lock },
      { title: 'Cadastrar Horário', href: '/secretaria/cadastrar-horario', icon: Clock },
      { title: 'Compartilhar Turma', href: '/secretaria/compartilhar-turma', icon: Users },
      { title: 'Consultar Aluno', href: '/secretaria/consultar-aluno', icon: Search },
      { title: 'Consultar Curso', href: '/secretaria/consultar-curso', icon: BookOpen },
      {
        title: 'Consultar Horário Curso',
        href: '/secretaria/consultar-horario-curso',
        icon: Calendar,
      },
      {
        title: 'Consultar Horário Prof.',
        href: '/secretaria/consultar-horario-prof',
        icon: Calendar,
      },
      { title: 'Consultar Matrícula', href: '/secretaria/consultar-matricula', icon: FileSearch },
      { title: 'Consultar Responsável', href: '/secretaria/consultar-responsavel', icon: Search },
      { title: 'Dividir Turma', href: '/secretaria/dividir-turma', icon: DivideCircle },
      {
        title: 'Efetivar Pré-Matrícula',
        href: '/secretaria/efetivar-pre-matricula',
        icon: UserCheck,
      },
      { title: 'Efetuar Matrícula', href: '/secretaria/efetuar-matricula', icon: UserPlus },
      {
        title: 'Efetuar Matrícula/Disciplina',
        href: '/secretaria/efetuar-matricula-disciplina',
        icon: BookCopy,
      },
      { title: 'Efetuar Pré-Matrícula', href: '/secretaria/efetuar-pre-matricula', icon: UserPlus },
      { title: 'Imprimir Documentos', href: '/secretaria/imprimir-documentos', icon: Printer },
      { title: 'Manutenção Matrícula', href: '/secretaria/manutencao-matricula', icon: Wrench },
      { title: 'Ocorrências do Aluno', href: '/secretaria/ocorrencias-aluno', icon: AlertCircle },
      { title: 'Reabertura de Período', href: '/secretaria/reabertura-periodo', icon: RotateCcw },
      { title: 'Recursos de Aula', href: '/secretaria/recursos-aula', icon: Box },
      { title: 'Requerimentos', href: '/secretaria/requerimentos', icon: HelpCircle },
      {
        title: 'Trocar Aluno de Curso',
        href: '/secretaria/trocar-aluno-curso',
        icon: ArrowRightLeft,
      },
      {
        title: 'Trocar Aluno de Turma',
        href: '/secretaria/trocar-aluno-turma',
        icon: ArrowRightLeft,
      },
    ],
  },
  {
    title: 'Secretaria Educação',
    items: [
      {
        title: 'Relatório Final',
        href: '/secretaria-educacao/relatorio-final',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { title: 'Pagamentos', href: '/financial/payments', icon: Wallet },
      { title: 'Fluxo de Caixa', href: '/financial/cash-flow', icon: TrendingUp },
    ],
  },
  {
    title: 'Comercial / CRM',
    items: [{ title: 'Leads e Oportunidades', href: '/commercial/leads', icon: Target }],
  },
  {
    title: 'Recursos Humanos',
    items: [{ title: 'Funcionários', href: '/hr/employees', icon: Building }],
  },
  {
    title: 'Estoque e Compras',
    items: [
      { title: 'Controle de Estoque', href: '/inventory/stock', icon: Package },
      { title: 'Movimentações', href: '/inventory/movements', icon: ArrowRightLeft },
      { title: 'Pedidos de Compra', href: '/purchasing/orders', icon: ShoppingCart },
      { title: 'Fornecedores', href: '/purchasing/suppliers', icon: Building },
    ],
  },
  {
    title: 'Cadastros Básicos',
    items: [
      { title: 'Avaliações', href: '/admin/registry/avaliacoes', icon: CheckSquare },
      { title: 'Cursos', href: '/admin/registry/curso', icon: BookOpen },
      { title: 'Convênios', href: '/admin/registry/convenio', icon: Users },
      { title: 'CEP (Logradouros)', href: '/admin/registry/cep', icon: MapPin },
      { title: 'Disciplinas', href: '/admin/registry/disciplina', icon: BookCopy },
      { title: 'Turmas', href: '/admin/registry/turmas', icon: Building },
    ],
  },
  {
    title: 'Administração',
    items: [
      { title: 'Controle de Acessos', href: '/admin/access-control', icon: Shield },
      { title: 'Configurações', href: '/admin/settings', icon: Settings },
      { title: 'Logs de Auditoria', href: '/admin/audit-logs', icon: Activity },
      { title: 'Gestão de Documentos', href: '/admin/documents', icon: FileText },
      { title: 'Notificações', href: '/admin/notifications', icon: Bell },
      { title: 'Relatórios Gerenciais', href: '/admin/reports', icon: PieChart },
      { title: 'Workflows', href: '/admin/workflows', icon: HardHat },
      { title: 'Logs de Comunicação', href: '/admin/communication-logs', icon: Mail },
    ],
  },
]

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/rem"
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
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
