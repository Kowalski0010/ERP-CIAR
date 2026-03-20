import { Link, useLocation } from 'react-router-dom'
import { Building2, ChevronDown } from 'lucide-react'
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
import { navGroups } from '@/lib/nav-config'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export function AppSidebar() {
  const location = useLocation()
  const { currentUserRole } = useAppStore()

  const filteredGroups = navGroups.filter((group) => {
    if (currentUserRole === 'Admin') return true

    if (currentUserRole === 'Academico') {
      return ['Dashboard', 'Acadêmico', 'Secretaria', 'Secretaria Educação'].includes(group.title)
    }
    if (currentUserRole === 'Financeiro') {
      return ['Dashboard', 'Financeiro'].includes(group.title)
    }
    if (currentUserRole === 'Comercial') {
      return ['Dashboard', 'Comercial / CRM'].includes(group.title)
    }

    return false
  })

  const finalGroups = filteredGroups.map((group) => {
    if (group.title === 'Administração' && currentUserRole !== 'Admin') {
      return {
        ...group,
        items: group.items.filter(
          (item) =>
            !['Logs de Auditoria', 'Controle de Acessos', 'Configurações'].includes(item.title),
        ),
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
              ERP Enterprise
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3 gap-2 pt-4">
        {finalGroups.map((group) => {
          const isGroupActive = group.items.some(
            (item) =>
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href)),
          )

          return (
            <Collapsible
              key={group.title}
              defaultOpen={isGroupActive || group.title === 'Dashboard'}
              className="group/collapsible"
            >
              <SidebarGroup className="px-0 py-1">
                <SidebarGroupLabel
                  asChild
                  className="px-3 mb-1 cursor-pointer hover:bg-zinc-200/50"
                >
                  <CollapsibleTrigger className="w-full flex items-center justify-between text-sidebar-foreground/50 text-[10px] font-bold uppercase tracking-widest">
                    {group.title}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0.5">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className={`transition-all duration-200 h-8 rounded-md px-3 border-l-2 ${
                                isActive
                                  ? 'bg-zinc-200/50 border-zinc-900 text-zinc-900 font-medium'
                                  : 'border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                              }`}
                            >
                              <Link to={item.href} className="flex items-center gap-3">
                                <item.icon
                                  className={`h-[14px] w-[14px] ${isActive ? 'text-zinc-900' : 'opacity-70'}`}
                                />
                                <span className="text-[13px]">{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
