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
  Building,
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
    items: [{ title: 'Painel (Dashboard)', icon: LayoutDashboard, url: '/' }],
  },
  {
    label: 'Acadêmico',
    items: [
      { title: 'Alunos', icon: Users, url: '/academic/students' },
      { title: 'Professores', icon: GraduationCap, url: '/academic/teachers' },
      { title: 'Turmas e Horários', icon: CalendarDays, url: '/academic/classes' },
      { title: 'Lançar Notas', icon: FileSpreadsheet, url: '/academic/grades' },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { title: 'Pagamentos', icon: DollarSign, url: '/financial/payments' },
      { title: 'Fluxo de Caixa', icon: PieChart, url: '/financial/cash-flow' },
    ],
  },
  {
    label: 'Comercial',
    items: [{ title: 'Leads / CRM', icon: Target, url: '/commercial/leads' }],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { currentUserRole } = useAppStore()

  const filteredGroups = navGroups.filter((group) => {
    if (currentUserRole === 'Admin') return true
    if (
      currentUserRole === 'Academico' &&
      (group.label === 'Visão Geral' || group.label === 'Acadêmico')
    )
      return true
    if (
      currentUserRole === 'Financeiro' &&
      (group.label === 'Visão Geral' || group.label === 'Financeiro')
    )
      return true
    if (
      currentUserRole === 'Comercial' &&
      (group.label === 'Visão Geral' || group.label === 'Comercial')
    )
      return true
    return false
  })

  return (
    <Sidebar className="border-r border-sidebar-border shadow-sm">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Building className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg leading-tight tracking-tight text-sidebar-foreground">
              EduSync
            </span>
            <span className="text-xs text-sidebar-foreground/60">ERP Educacional</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="transition-all duration-200"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
