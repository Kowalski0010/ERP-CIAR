import { Link } from 'react-router-dom'
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
    title: 'ACADÊMICO',
    icon: GraduationCap,
    subGroups: [
      {
        title: 'Controle Acadêmico',
        items: [
          { title: 'Acompanhamento pedagógico', url: '/academic/pedagogical' },
          { title: 'Consultar notas', url: '/academic/grades' },
          { title: 'Controle de TCC', url: '/academic/control/tcc' },
          { title: 'Dispensar disciplina', url: '/academic/control/dispensa' },
          { title: 'Histórico Escolar', url: '/academic/control/historico' },
          { title: 'Lançar afastamento', url: '/academic/control/afastamento' },
          { title: 'Lançar estágio', url: '/academic/control/estagio' },
          { title: 'Lançar forma de ingresso', url: '/academic/control/forma-ingresso' },
          { title: 'Lançar frequência', url: '/academic/control/lancar-frequencia' },
          { title: 'Lançar notas', url: '/academic/grades' },
          { title: 'Lançar planejamento', url: '/academic/control/planejamento' },
        ],
      },
      {
        title: 'Relatórios',
        items: [
          { title: 'Alunos ingressantes', url: '/reports/alunos-ingressantes' },
          { title: 'Diário de classe', url: '/academic/grades' },
          { title: 'Edital de notas', url: '/reports/edital-notas' },
          { title: 'Documento pendentes', url: '/admin/documents' },
          { title: 'Relação de alunos com faltas', url: '/reports/alunos-faltas' },
          { title: 'Relação de alunos por turma', url: '/academic/classes' },
          { title: 'Relação de aluno bloqueados', url: '/reports/alunos-bloqueados' },
          { title: 'Relação de alunos concluintes', url: '/reports/alunos-concluintes' },
          { title: 'Relação de disciplinas por aluno', url: '/academic/students' },
          { title: 'Relação de turmas', url: '/academic/classes' },
          { title: 'Situação geral do aluno', url: '/academic/students' },
        ],
      },
      {
        title: 'Secretaria',
        items: [
          { title: '2ª via de contrato', url: '/secretaria/2a-via-contrato' },
          { title: 'Bloquear matrícula', url: '/secretaria/bloquear-matricula' },
          { title: 'Trancar matrícula', url: '/secretaria/manutencao-matricula' },
          { title: 'Cadastrar horário', url: '/secretaria/cadastrar-horario' },
          { title: 'Consultar aluno', url: '/secretaria/consultar-aluno' },
          { title: 'Consultar curso', url: '/secretaria/consultar-curso' },
          { title: 'Consultar turma', url: '/secretaria/consultar-horario-curso' },
          { title: 'Consultar matrícula', url: '/secretaria/consultar-matricula' },
          { title: 'Efetuar matrícula na turma', url: '/secretaria/efetuar-matricula-disciplina' },
          { title: 'Manutenção de matrícula', url: '/secretaria/manutencao-matricula' },
          { title: 'Transferência de aluno de turma', url: '/secretaria/trocar-aluno-turma' },
        ],
      },
    ],
  },
  {
    title: 'ADMINISTRAÇÃO DO SISTEMA',
    icon: Settings,
    subGroups: [
      {
        title: 'Cadastro',
        items: [
          { title: 'Alunos', url: '/academic/students' },
          { title: 'Avaliações', url: '/admin/registry/avaliacoes' },
          { title: 'Curso', url: '/admin/registry/curso' },
          { title: 'Convênio', url: '/admin/registry/convenio' },
          { title: 'CEP', url: '/admin/registry/cep' },
          { title: 'Disciplina', url: '/admin/registry/disciplina' },
          { title: 'Documentos', url: '/admin/documents' },
          { title: 'Funcionários', url: '/hr/employees' },
          { title: 'Perfil Professor', url: '/academic/teachers' },
          { title: 'Plano de pagamento do curso', url: '/admin/registry/planos-pagamento' },
          { title: 'Produtos e serviços', url: '/inventory/stock' },
          { title: 'Professores', url: '/academic/teachers' },
          { title: 'Requerimentos', url: '/secretaria/requerimentos' },
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
        items: [
          { title: 'Analise de atendimento', url: '/commercial/leads' },
          { title: 'Cadastro de atendimento', url: '/commercial/leads' },
          { title: 'Relatório de atendimento', url: '/reports/atendimento' },
        ],
      },
    ],
  },
  {
    title: 'FINANCEIRO',
    icon: DollarSign,
    items: [
      { title: 'Manutenção de cancelamento', url: '/financial/payments' },
      { title: 'Manutenção de parcelas', url: '/financial/payments' },
      { title: 'Manutenção de produto', url: '/inventory/stock' },
      { title: 'Relatórios financeiros', url: '/financial/cash-flow' },
    ],
  },
]

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const { currentUserRole } = useAppStore()

  // Filter modules based on RBAC logic
  const filteredModules = appModules.filter((module) => {
    if (currentUserRole === 'Admin' || currentUserRole === 'Gestao') return true

    if (currentUserRole === 'Secretaria') {
      return module.title === 'ACADÊMICO' || module.title === 'ADMINISTRAÇÃO DO SISTEMA'
    }

    if (currentUserRole === 'Financeiro') {
      return module.title === 'FINANCEIRO' || module.title === 'ADMINISTRAÇÃO DO SISTEMA'
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
          {/* Mock CIAR Logo */}
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
          <SidebarGroupLabel className="px-4 py-2 h-auto text-[11px] font-bold text-zinc-500 tracking-wider group-data-[collapsible=icon]:hidden flex items-center gap-2">
            <Star className="h-4 w-4 text-[#1e3a8a] fill-[#1e3a8a]" /> FAVORITOS
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-none h-10 px-4 text-zinc-600 hover:bg-zinc-100 hover:text-[#1e3a8a] text-[13px]"
              >
                <Link to="/secretaria/cadastrar-horario">
                  <span className="group-data-[collapsible=icon]:hidden">Cadastrar Horário</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <div className="h-px bg-zinc-200 my-2 group-data-[collapsible=icon]:hidden" />

        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0">
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
                asChild
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]"
              >
                <Link to="/secretaria/consultar-aluno">
                  <Users className="h-[18px] w-[18px]" />
                  <span>CONSULTA ALUNO</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]"
              >
                <Link to="/secretaria/imprimir-documentos">
                  <Printer className="h-[18px] w-[18px]" />
                  <span>IMPRIMIR</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]"
              >
                <Link to="/utilities/messages">
                  <Mail className="h-[18px] w-[18px]" />
                  <span>MENSAGENS</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]"
              >
                <Link to="/utilities/news">
                  <Newspaper className="h-[18px] w-[18px]" />
                  <span>NEWS</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleSidebar}
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-[#1e3a8a] font-semibold hover:bg-zinc-50 text-[13px] cursor-pointer"
              >
                <PlayCircle className="h-[18px] w-[18px]" />
                <span>RECOLHER MENU</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]"
              >
                <Link to="/utilities/change-password">
                  <Lock className="h-[18px] w-[18px]" />
                  <span>TROCAR SENHA</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Dark Modules Section with Multi-level Navigation */}
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
                                            className="rounded-none h-9 pl-14 pr-4 text-zinc-400 hover:bg-[#2d3e50] hover:text-white text-[11px] font-normal border-none"
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
