import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  CalendarDays,
  StickyNote,
  Mail,
  GraduationCap,
  Settings,
  DollarSign,
  ChevronRight,
  LogOut,
  Plus,
  Users,
  Briefcase,
  Package,
  Activity,
  UserCircle,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'

const appModules = [
  {
    title: 'PORTAL DO ALUNO',
    icon: GraduationCap,
    items: [
      { title: 'Meu Painel', url: '/' },
      { title: 'Meu Perfil', url: '/student/profile' },
      { title: 'Agenda de Aulas', url: '/student/schedule' },
      { title: 'Extrato Financeiro', url: '/student/financial' },
      { title: 'Documentos', url: '/student/documents' },
      { title: 'Feedback / Suporte', url: '/student/feedback' },
    ],
  },
  {
    title: 'PORTAL DO RESPONSÁVEL',
    icon: Users,
    items: [{ title: 'Meu Painel', url: '/' }],
  },
  {
    title: 'PORTAL DO PACIENTE',
    icon: UserCircle,
    items: [{ title: 'Meu Painel Clínico', url: '/' }],
  },
  {
    title: 'ACR (CLÍNICA)',
    icon: Activity,
    items: [
      { title: 'Pacientes', url: '/acr/patients' },
      { title: 'Agenda e Sessões', url: '/acr/agenda' },
      { title: 'Prontuários', url: '/acr/records' },
      { title: 'Dashboard Clínico', url: '/acr/analytics' },
    ],
  },
  {
    title: 'CADASTROS',
    icon: Plus,
    items: [
      { title: 'Usuários do Sistema', url: '/admin/users' },
      { title: 'Alunos', url: '/academic/students' },
      { title: 'Professores', url: '/academic/teachers' },
      { title: 'Cursos', url: '/admin/registry/curso' },
      { title: 'Turmas (Cadastro)', url: '/admin/registry/turmas' },
      { title: 'Disciplinas', url: '/admin/registry/disciplina' },
      { title: 'Ativ. Extra-Curriculares', url: '/academic/extracurricular' },
      { title: 'Auditoria de Acessos', url: '/admin/audit-logs' },
      { title: 'Backups do Sistema', url: '/admin/backup' },
      { title: 'Importação em Massa', url: '/admin/data-import' },
    ],
  },
  {
    title: 'PEDAGÓGICO',
    icon: GraduationCap,
    items: [
      { title: 'Dashboard de Performance', url: '/academic/performance' },
      { title: 'Mapa de Ocupação', url: '/academic/room-occupancy' },
      { title: 'Chamada Digital', url: '/academic/roll-call' },
      { title: 'Acomp. Pedagógico', url: '/academic/pedagogical' },
      { title: 'Controle de Notas', url: '/academic/grades' },
      { title: 'Relatórios e Atas', url: '/reports/custom' },
      { title: 'Aprovações Pendentes', url: '/admin/approvals' },
      { title: 'Biblioteca Central', url: '/library/dashboard' },
      { title: 'Efetuar Matrícula', url: '/secretaria/efetuar-matricula' },
      { title: 'Manutenção Matrícula', url: '/secretaria/manutencao-matricula' },
      { title: 'Emissão de Certificados', url: '/secretaria/certificados' },
      { title: 'Imprimir Documentos', url: '/secretaria/imprimir-documentos' },
      { title: 'Consulta de Alunos', url: '/secretaria/consultar-aluno' },
    ],
  },
  {
    title: 'GESTÃO E FINANCEIRO',
    icon: DollarSign,
    items: [
      { title: 'Pagamentos e Faturas', url: '/financial/payments' },
      { title: 'Fluxo de Caixa', url: '/financial/cash-flow' },
      { title: 'Análise Financeira (BI)', url: '/financial/analytics' },
      { title: 'Monitoramento CFTV', url: '/admin/security' },
      { title: 'Integrações Oficiais', url: '/admin/integrations' },
    ],
  },
  {
    title: 'RECURSOS HUMANOS',
    icon: Briefcase,
    items: [
      { title: 'Colaboradores', url: '/hr/employees' },
      { title: 'Recrutamento de Docentes', url: '/hr/recruitment' },
    ],
  },
  {
    title: 'INVENTÁRIO E PATRIMÔNIO',
    icon: Package,
    items: [
      { title: 'Estoque Atual', url: '/inventory/stock' },
      { title: 'Movimentações', url: '/inventory/movements' },
      { title: 'Pedidos de Compra', url: '/purchasing/orders' },
      { title: 'Fornecedores', url: '/purchasing/suppliers' },
    ],
  },
  {
    title: 'COMUNICAÇÃO',
    icon: Mail,
    items: [
      { title: 'Chat Interno', url: '/utilities/chat' },
      { title: 'Caixa de Feedback', url: '/secretaria/feedback' },
      { title: 'Pesquisas de Satisfação', url: '/admin/surveys' },
      { title: 'Eventos e RSVP', url: '/admin/events' },
      { title: 'Notificações WhatsApp', url: '/admin/communication-settings' },
      { title: 'Agenda e Calendário', url: '/academic/agenda' },
      { title: 'Alertas em Massa', url: '/admin/notifications' },
    ],
  },
]

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const { currentUserRole, logout } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()

  const filteredModules = appModules
    .map((module) => {
      // Hide administrative options from Pedagogical menu if user is a Teacher
      if (currentUserRole === 'Professor' && module.title === 'PEDAGÓGICO') {
        const restrictedForProfessor = [
          'Relatórios e Atas',
          'Aprovações Pendentes',
          'Efetuar Matrícula',
          'Manutenção Matrícula',
          'Emissão de Certificados',
          'Imprimir Documentos',
          'Consulta de Alunos',
        ]
        return {
          ...module,
          items: module.items?.filter((item) => !restrictedForProfessor.includes(item.title)),
        }
      }
      return module
    })
    .filter((module) => {
      if (currentUserRole === 'Admin' || currentUserRole === 'Gestao') {
        return (
          module.title !== 'PORTAL DO ALUNO' &&
          module.title !== 'PORTAL DO RESPONSÁVEL' &&
          module.title !== 'PORTAL DO PACIENTE'
        )
      }

      if (currentUserRole === 'Aluno') return module.title === 'PORTAL DO ALUNO'
      if (currentUserRole === 'Responsável') return module.title === 'PORTAL DO RESPONSÁVEL'
      if (currentUserRole === 'Paciente') return module.title === 'PORTAL DO PACIENTE'

      if (currentUserRole === 'Secretaria') {
        return (
          module.title === 'CADASTROS' ||
          module.title === 'GESTÃO E FINANCEIRO' ||
          module.title === 'COMUNICAÇÃO' ||
          module.title === 'PEDAGÓGICO' ||
          module.title === 'INVENTÁRIO E PATRIMÔNIO' ||
          module.title === 'RECURSOS HUMANOS' ||
          module.title === 'ACR (CLÍNICA)'
        )
      }

      if (currentUserRole === 'Financeiro') {
        return module.title === 'GESTÃO E FINANCEIRO' || module.title === 'COMUNICAÇÃO'
      }

      if (currentUserRole === 'Professor') {
        return module.title === 'COMUNICAÇÃO' || module.title === 'PEDAGÓGICO'
      }

      return true
    })

  return (
    <Sidebar className="border-r border-border bg-card shadow-sm font-sans" collapsible="icon">
      <SidebarHeader className="p-0 border-b-0">
        <div className="flex flex-col items-center justify-center pt-8 pb-4 group-data-[collapsible=icon]:hidden">
          <div className="relative flex items-center justify-center h-20 w-20 mb-2">
            <div className="absolute w-12 h-12 rounded-full bg-primary top-0 left-2 opacity-90 mix-blend-multiply flex items-center justify-center">
              <div className="w-4 h-4 bg-background rounded-full absolute -top-1 -right-1" />
            </div>
            <div className="absolute w-14 h-14 rounded-full bg-emerald-500 bottom-0 right-1 opacity-90 mix-blend-multiply flex items-center justify-center">
              <div className="w-5 h-5 bg-background rounded-full absolute -top-1 -left-1" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-primary tracking-[0.2em] mt-1">CIAR</span>
        </div>
        <div className="px-4 pb-4 pt-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="pl-3 pr-8 h-9 text-xs border-input bg-background focus-visible:ring-primary"
            />
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0 gap-0">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0">
            {currentUserRole !== 'Aluno' &&
              currentUserRole !== 'Responsável' &&
              currentUserRole !== 'Paciente' && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`rounded-none h-10 px-4 border-l-4 font-semibold text-[13px] ${
                      location.pathname === '/'
                        ? 'border-l-primary bg-muted/50 text-primary'
                        : 'border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <Link to="/">
                      <CalendarDays className="h-[18px] w-[18px]" />
                      <span>DASHBOARD</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

            {currentUserRole === 'Aluno' && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-none h-10 px-4 border-l-4 font-semibold text-[13px] ${
                    location.pathname === '/' || location.pathname.includes('/student/dashboard')
                      ? 'border-l-primary bg-muted/50 text-primary'
                      : 'border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Link to="/">
                    <CalendarDays className="h-[18px] w-[18px]" />
                    <span>MEU PAINEL</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {currentUserRole === 'Responsável' && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-none h-10 px-4 border-l-4 font-semibold text-[13px] ${
                    location.pathname === '/' || location.pathname.includes('/parent/dashboard')
                      ? 'border-l-primary bg-muted/50 text-primary'
                      : 'border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Link to="/">
                    <Users className="h-[18px] w-[18px]" />
                    <span>PORTAL DA FAMÍLIA</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {currentUserRole === 'Paciente' && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-none h-10 px-4 border-l-4 font-semibold text-[13px] ${
                    location.pathname === '/' || location.pathname.includes('/portal')
                      ? 'border-l-primary bg-muted/50 text-primary'
                      : 'border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Link to="/">
                    <UserCircle className="h-[18px] w-[18px]" />
                    <span>MEU PAINEL CLÍNICO</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground text-[13px]"
              >
                <Link to="/utilities/notepad">
                  <StickyNote className="h-[18px] w-[18px]" />
                  <span>BLOCO DE NOTAS</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-destructive font-semibold hover:bg-destructive/10 text-[13px] cursor-pointer"
              >
                <LogOut className="h-[18px] w-[18px]" />
                <span>SAIR DO SISTEMA</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <div className="mt-2 bg-zinc-900 dark:bg-zinc-950 flex-1 pb-4 group-data-[collapsible=icon]:bg-transparent overflow-y-auto">
          <SidebarGroup className="p-0">
            <SidebarMenu className="gap-0">
              {filteredModules.map((module) => (
                <Collapsible key={module.title} defaultOpen={false} className="group/root">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="rounded-none h-11 px-4 border-b border-zinc-800 dark:border-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-900 text-[13px] font-medium group-data-[collapsible=icon]:text-muted-foreground group-data-[collapsible=icon]:border-none">
                        <module.icon className="h-[18px] w-[18px]" />
                        <span className="group-data-[collapsible=icon]:hidden">{module.title}</span>
                        {module.items && (
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/root:rotate-90 group-data-[collapsible=icon]:hidden" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="bg-zinc-950 dark:bg-zinc-900/50 group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSub className="border-none m-0 p-0">
                        {module.items?.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="rounded-none h-10 pl-11 pr-4 text-zinc-400 hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-800/50 text-[12px] font-medium border-b border-zinc-900 dark:border-zinc-800"
                            >
                              <Link to={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
