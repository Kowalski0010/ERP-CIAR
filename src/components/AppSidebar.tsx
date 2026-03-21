import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  Star,
  CalendarDays,
  StickyNote,
  Users,
  Printer,
  Mail,
  Newspaper,
  PlayCircle,
  Lock,
  GraduationCap,
  Settings,
  Megaphone,
  DollarSign,
  ChevronRight,
  BookOpen,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
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
      { title: 'Agenda de Aulas', url: '/student/schedule' },
      { title: 'Extrato Financeiro', url: '/student/financial' },
      { title: 'Documentos e Assinaturas', url: '/student/documents' },
    ],
  },
  {
    title: 'ACADÊMICO',
    icon: GraduationCap,
    subGroups: [
      {
        title: 'Controle Acadêmico',
        items: [
          { title: 'Acompanhamento pedagógico', url: '/academic/pedagogical' },
          { title: 'Agenda Acadêmica', url: '/academic/agenda' },
          { title: 'Atribuir professor', url: '/academic/control/alocar-professor' },
          { title: 'Consultar notas', url: '/academic/grades' },
          { title: 'Editar perfil de aluno', url: '/academic/control/editar-aluno' },
          { title: 'Gerenciar disciplinas', url: '/academic/control/vincular-disciplina' },
          { title: 'Gerenciar turma', url: '/academic/control/trocar-turma' },
          { title: 'Lançar frequência', url: '/academic/control/lancar-frequencia' },
          { title: 'Lançar notas', url: '/academic/control/lancar-notas' },
        ],
      },
      {
        title: 'Secretaria',
        items: [
          { title: '2ª via de contrato', url: '/secretaria/2a-via-contrato' },
          { title: 'Bloquear matrícula', url: '/secretaria/bloquear-matricula' },
          { title: 'Cadastrar horário', url: '/secretaria/cadastrar-horario' },
          { title: 'Consultar aluno', url: '/secretaria/consultar-aluno' },
          { title: 'Consultar curso', url: '/secretaria/consultar-curso' },
          { title: 'Consultar matrícula', url: '/secretaria/consultar-matricula' },
          { title: 'Transferência de turma', url: '/secretaria/trocar-aluno-turma' },
        ],
      },
    ],
  },
  {
    title: 'BIBLIOTECA',
    icon: BookOpen,
    items: [
      { title: 'Acervo e Catálogo', url: '/library/catalog' },
      { title: 'Empréstimos e Devoluções', url: '/library/loans' },
    ],
  },
  {
    title: 'COMUNICAÇÃO',
    icon: Mail,
    items: [
      { title: 'Chat Interno', url: '/utilities/chat' },
      { title: 'Mensagens / Avisos', url: '/utilities/messages' },
    ],
  },
  {
    title: 'ADMINISTRAÇÃO DO SISTEMA',
    icon: Settings,
    subGroups: [
      {
        title: 'Cadastro',
        items: [
          { title: 'Avaliações', url: '/admin/registry/avaliacoes' },
          { title: 'Cursos', url: '/admin/registry/curso' },
          { title: 'Convênios', url: '/admin/registry/convenio' },
          { title: 'CEP (Logradouros)', url: '/admin/registry/cep' },
          { title: 'Disciplinas', url: '/admin/registry/disciplina' },
          { title: 'Turmas', url: '/admin/registry/turmas' },
        ],
      },
    ],
  },
  {
    title: 'CRM – COMUNICAÇÃO',
    icon: Megaphone,
    subGroups: [
      {
        title: 'Atendimento',
        items: [{ title: 'Pipeline Comercial', url: '/commercial/leads' }],
      },
    ],
  },
  {
    title: 'FINANCEIRO',
    icon: DollarSign,
    items: [
      { title: 'Gestão de Faturas', url: '/financial/payments' },
      { title: 'Fluxo de Caixa', url: '/financial/cash-flow' },
    ],
  },
]

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const { currentUserRole, logout } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()

  // Filter modules based on RBAC logic
  const filteredModules = appModules.filter((module) => {
    if (currentUserRole === 'Admin' || currentUserRole === 'Gestao') {
      return module.title !== 'PORTAL DO ALUNO'
    }

    if (currentUserRole === 'Aluno') {
      return module.title === 'PORTAL DO ALUNO' || module.title === 'BIBLIOTECA'
    }

    if (currentUserRole === 'Secretaria') {
      return (
        module.title === 'ACADÊMICO' ||
        module.title === 'ADMINISTRAÇÃO DO SISTEMA' ||
        module.title === 'COMUNICAÇÃO' ||
        module.title === 'BIBLIOTECA'
      )
    }

    if (currentUserRole === 'Financeiro') {
      return (
        module.title === 'FINANCEIRO' ||
        module.title === 'ADMINISTRAÇÃO DO SISTEMA' ||
        module.title === 'COMUNICAÇÃO'
      )
    }

    if (currentUserRole === 'Professor') {
      return (
        module.title === 'ACADÊMICO' ||
        module.title === 'COMUNICAÇÃO' ||
        module.title === 'BIBLIOTECA'
      )
    }

    return true
  })

  // Filter subGroups for Secretaria (only show Cadastro in Administração)
  const renderModules = filteredModules.map((module) => {
    if (currentUserRole === 'Secretaria' && module.title === 'ADMINISTRAÇÃO DO SISTEMA') {
      return {
        ...module,
        subGroups: module.subGroups?.filter((sg) => sg.title === 'Cadastro'),
      }
    }
    return module
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
            {currentUserRole !== 'Aluno' && (
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
              {renderModules.map((module) => (
                <Collapsible key={module.title} defaultOpen={false} className="group/root">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="rounded-none h-11 px-4 border-b border-[#3b4f63] text-zinc-200 hover:bg-[#3b4f63] hover:text-white text-[13px] font-medium group-data-[collapsible=icon]:text-zinc-600 group-data-[collapsible=icon]:border-none">
                        <module.icon className="h-[18px] w-[18px]" />
                        <span className="group-data-[collapsible=icon]:hidden">{module.title}</span>
                        {(module.subGroups || module.items) && (
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/root:rotate-90 group-data-[collapsible=icon]:hidden" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="bg-[#1e2b3c] group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSub className="border-none m-0 p-0">
                        {module.subGroups
                          ? module.subGroups.map((subGroup) => (
                              <Collapsible
                                key={subGroup.title}
                                defaultOpen={false}
                                className="group/sub"
                              >
                                <SidebarMenuItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuButton className="rounded-none h-10 pl-11 pr-4 text-zinc-300 hover:bg-[#2d3e50] hover:text-white text-[12px] font-medium border-b border-[#2d3e50]">
                                      <span>{subGroup.title}</span>
                                      <ChevronRight className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/sub:rotate-90" />
                                    </SidebarMenuButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="bg-[#15202b]">
                                    <SidebarMenuSub className="border-none m-0 p-0">
                                      {subGroup.items.map((item) => (
                                        <SidebarMenuSubItem key={item.title}>
                                          <SidebarMenuSubButton
                                            asChild
                                            className="rounded-none h-10 pl-14 pr-4 text-zinc-400 hover:bg-[#2d3e50] hover:text-white text-[11px] font-normal border-none"
                                          >
                                            <Link to={item.url}>{item.title}</Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuItem>
                              </Collapsible>
                            ))
                          : module.items?.map((item) => (
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
