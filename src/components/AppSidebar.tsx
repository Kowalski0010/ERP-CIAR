import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  FileSpreadsheet,
  DollarSign,
  PieChart,
  Target,
  Building2,
  Clock,
  ShieldAlert,
  BarChart3,
  BellRing,
  Home,
  ClipboardList,
  Wallet,
  UserCircle,
  Briefcase,
  Package,
  ArrowRightLeft,
  Truck,
  ShoppingCart,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useAppStore } from '@/contexts/AppContext'

const navGroups = [
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
      { title: 'Cronogramas', icon: Clock, url: '/academic/schedules' },
      { title: 'Notas e Frequência', icon: FileSpreadsheet, url: '/academic/grades' },
    ],
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
    label: 'Administração',
    items: [
      { title: 'Central de Alertas', icon: BellRing, url: '/admin/notifications' },
      { title: 'Relatórios (BI)', icon: BarChart3, url: '/admin/reports' },
      { title: 'Auditoria (Logs)', icon: ShieldAlert, url: '/admin/logs' },
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

export function AppSidebar() {
  const location = useLocation()
  const { currentUserRole } = useAppStore()

  const filteredGroups = navGroups.filter((group) => {
    if (currentUserRole === 'Aluno') {
      return group.label === 'Portal do Aluno'
    }

    if (group.label === 'Portal do Aluno') return false // Hide portal from staff

    if (currentUserRole === 'Admin') return true

    if (
      currentUserRole === 'Academico' &&
      ['Visão Geral', 'Módulo Acadêmico', 'Administração'].includes(group.label)
    ) {
      return true
    }
    if (
      currentUserRole === 'Financeiro' &&
      ['Visão Geral', 'Módulo Financeiro', 'Administração'].includes(group.label)
    )
      return true
    if (
      currentUserRole === 'Comercial' &&
      ['Visão Geral', 'Módulo Comercial'].includes(group.label)
    )
      return true

    return false
  })

  const finalGroups = filteredGroups.map((group) => {
    if (group.label === 'Administração' && currentUserRole !== 'Admin') {
      return {
        ...group,
        items: group.items.filter((item) => item.title !== 'Auditoria (Logs)'),
      }
    }
    return group
  })

  return (
    <Sidebar className="border-r border-sidebar-border shadow-md bg-zinc-50">
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="bg-zinc-900 flex items-center justify-center p-2 rounded text-zinc-50 shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] leading-tight text-sidebar-foreground tracking-tight">
              TOTVS Edu
            </span>
            <span className="text-[10px] font-semibold text-sidebar-foreground/60 uppercase tracking-widest mt-0.5">
              {currentUserRole === 'Aluno' ? 'Portal do Aluno' : 'ERP Enterprise'}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3 gap-6 pt-6">
        {finalGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-0 py-0">
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-2 px-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`transition-all duration-200 h-9 rounded-md px-3 border-l-2 ${
                          isActive
                            ? 'bg-zinc-200/50 border-zinc-900 text-zinc-900 font-medium'
                            : 'border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon
                            className={`h-[16px] w-[16px] ${isActive ? 'text-zinc-900' : 'opacity-70'}`}
                          />
                          <span className="text-[13px]">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
