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
      { title: 'Meu Painel', url: '/student/dashboard' },
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
    items: [{ title: 'Meu Painel', url: '/parent/dashboard' }],
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
      { title: 'Alunos', url: '/academic/students' },
      { title: 'Professores', url: '/academic/teachers' },
      { title: 'Cursos', url: '/admin/registry/curso' },
      { title: 'Turmas (Cadastro)', url: '/admin/registry/turmas' },
      { title: 'Disciplinas', url: '/admin/registry/disciplina' },
      { title: 'Ativ. Extra-Curriculares', url: '/academic/extracurricular' },
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
    ],
  },
  {
    title: 'GESTÃO E FINANCEIRO',
    icon: DollarSign,
    items: [
      { title: 'Aprovações Pendentes', url: '/admin/approvals' },
      { title: 'Pagamentos e Faturas', url: '/financial/payments' },
      { title: 'Fluxo de Caixa', url: '/financial/cash-flow' },
      { title: 'Análise Financeira (BI)', url: '/financial/analytics' },
      { title: 'Biblioteca Central', url: '/library/dashboard' },
      { title: 'Auditoria de Acessos', url: '/admin/audit-logs' },
      { title: 'Monitoramento CFTV', url: '/admin/security' },
      { title: 'Backups do Sistema', url: '/admin/backup' },
      { title: 'Importação em Massa', url: '/admin/data-import' },
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
  {
    title: 'OPERAÇÕES SECRETARIA',
    icon: Settings,
    items: [
      { title: 'Efetuar Matrícula', url: '/secretaria/efetuar-matricula' },
      { title: 'Manutenção Matrícula', url: '/secretaria/manutencao-matricula' },
      { title: 'Emissão de Certificados', url: '/secretaria/certificados' },
      { title: 'Imprimir Documentos', url: '/secretaria/imprimir-documentos' },
      { title: 'Consulta de Alunos', url: '/secretaria/consultar-aluno' },
    ],
  },
]

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const { currentUserRole, logout } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()

  const filteredModules = appModules.filter((module) => {
    if (currentUserRole === 'Admin' || currentUserRole === 'Gestao') {
      return module.title !== 'PORTAL DO ALUNO' && module.title !== 'PORTAL DO RESPONSÁVEL'
    }

    if (currentUserRole === 'Aluno') {
      return module.title === 'PORTAL DO ALUNO'
    }

    if (currentUserRole === 'Responsável') {
      return module.title === 'PORTAL DO RESPONSÁVEL'
    }

    if (currentUserRole === 'Secretaria') {
      return (
        module.title === 'CADASTROS' ||
        module.title === 'GESTÃO E FINANCEIRO' ||
        module.title === 'COMUNICAÇÃO' ||
        module.title === 'OPERAÇÕES SECRETARIA' ||
        module.title === 'INVENTÁRIO E PATRIMÔNIO' ||
        module.title === 'RECURSOS HUMANOS' ||
        module.title === 'ACR (CLÍNICA)'
      )
    }

    if (currentUserRole === 'Financeiro') {
      return module.title === 'GESTÃO E FINANCEIRO' || module.title === 'COMUNICAÇÃO'
    }

    if (currentUserRole === 'Professor') {
      return (
        module.title === 'COMUNICAÇÃO' ||
        module.title === 'PEDAGÓGICO' ||
        module.title === 'ACR (CLÍNICA)'
      )
    }

    return true
  })

  return (
    <Sidebar className="border-r border-zinc-200 bg-white shadow-sm font-sans" collapsible="icon">
      <SidebarHeader className="p-0 border-b-0">
        <div className="flex flex-col items-center justify-center pt-8 pb-4 group-data-[collapsible=icon]:hidden">
          <div className="relative flex items-center justify-center h-20 w-20 mb-2">
            <div className="absolute w-12 h-12 rounded-full bg-[#1e3a8a] top-0 left-2 opacity-90 mix-blend-multiply flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full absolute -top-1 -right-1" />
            </div>
            <div className="absolute w-14 h-14 rounded-full bg-[#00a651] bottom-0 right-1 opacity-90 mix-blend-multiply flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full absolute -top-1 -left-1" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-[#1e3a8a] tracking-[0.2em] mt-1">CIAR</span>
        </div>
        <div className="px-4 pb-4 pt-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="pl-3 pr-8 h-9 text-xs border-zinc-300 rounded-sm focus-visible:ring-[#1e3a8a]"
            />
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0 gap-0">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0">
            {currentUserRole !== 'Aluno' && currentUserRole !== 'Responsável' && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`rounded-none h-10 px-4 border-l-4 font-semibold text-[13px] ${
                    location.pathname === '/'
                      ? 'border-l-[#1e3a8a] bg-zinc-100 text-[#1e3a8a]'
                      : 'border-l-transparent text-zinc-600 hover:bg-zinc-50'
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
                    location.pathname.includes('/student/dashboard')
                      ? 'border-l-[#1e3a8a] bg-zinc-100 text-[#1e3a8a]'
                      : 'border-l-transparent text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Link to="/student/dashboard">
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
                    location.pathname.includes('/parent/dashboard')
                      ? 'border-l-[#1e3a8a] bg-zinc-100 text-[#1e3a8a]'
                      : 'border-l-transparent text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Link to="/parent/dashboard">
                    <Users className="h-[18px] w-[18px]" />
                    <span>PORTAL DA FAMÍLIA</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]"
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
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-rose-600 font-semibold hover:bg-rose-50 text-[13px] cursor-pointer"
              >
                <LogOut className="h-[18px] w-[18px]" />
                <span>SAIR DO SISTEMA</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <div className="mt-2 bg-[#2d3e50] flex-1 pb-4 group-data-[collapsible=icon]:bg-transparent">
          <SidebarGroup className="p-0">
            <SidebarMenu className="gap-0">
              {filteredModules.map((module) => (
                <Collapsible key={module.title} defaultOpen={false} className="group/root">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="rounded-none h-11 px-4 border-b border-[#3b4f63] text-zinc-200 hover:bg-[#3b4f63] hover:text-white text-[13px] font-medium group-data-[collapsible=icon]:text-zinc-600 group-data-[collapsible=icon]:border-none">
                        <module.icon className="h-[18px] w-[18px]" />
                        <span className="group-data-[collapsible=icon]:hidden">{module.title}</span>
                        {module.items && (
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/root:rotate-90 group-data-[collapsible=icon]:hidden" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="bg-[#1e2b3c] group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSub className="border-none m-0 p-0">
                        {module.items?.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="rounded-none h-10 pl-11 pr-4 text-zinc-300 hover:bg-[#2d3e50] hover:text-white text-[12px] font-medium border-b border-[#2d3e50]"
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
