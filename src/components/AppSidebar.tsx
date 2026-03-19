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
]

export function AppSidebar() {
  const location = useLocation()
  const { currentUserRole } = useAppStore()

  const filteredGroups = navGroups.filter((group) => {
    if (currentUserRole === 'Admin') return true
    if (
      currentUserRole === 'Academico' &&
      (group.label === 'Visão Geral' || group.label === 'Módulo Acadêmico')
    )
      return true
    if (
      currentUserRole === 'Financeiro' &&
      (group.label === 'Visão Geral' || group.label === 'Módulo Financeiro')
    )
      return true
    if (
      currentUserRole === 'Comercial' &&
      (group.label === 'Visão Geral' || group.label === 'Módulo Comercial')
    )
      return true
    return false
  })

  return (
    <Sidebar className="border-r border-sidebar-border shadow-sm">
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="bg-primary flex items-center justify-center p-2 rounded text-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] leading-tight text-sidebar-foreground">
              TOTVS Edu
            </span>
            <span className="text-[11px] font-medium text-sidebar-foreground/60 uppercase tracking-wider">
              ERP System
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 gap-4">
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-0">
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] font-bold uppercase tracking-wider mb-1 px-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`transition-colors duration-200 h-9 rounded-md px-3 ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon
                            className={`h-[18px] w-[18px] ${isActive ? 'text-primary' : 'opacity-70'}`}
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
