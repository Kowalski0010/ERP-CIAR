import { Link } from 'react-router-dom'
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
  Wrench,
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
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()

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
                isActive
                className="rounded-none h-10 px-4 border-l-4 border-l-[#1e3a8a] bg-zinc-100 text-[#1e3a8a] font-semibold text-[13px] hover:bg-zinc-100"
              >
                <Link to="/">
                  <CalendarDays className="h-[18px] w-[18px]" />
                  <span>AGENDA</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]">
                <StickyNote className="h-[18px] w-[18px]" />
                <span>BLOCO DE NOTAS</span>
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
              <SidebarMenuButton className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]">
                <Mail className="h-[18px] w-[18px]" />
                <span>MENSAGENS</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]">
                <Newspaper className="h-[18px] w-[18px]" />
                <span>NEWS</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleSidebar}
                className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-[#1e3a8a] font-semibold hover:bg-zinc-50 text-[13px]"
              >
                <PlayCircle className="h-[18px] w-[18px]" />
                <span>RECOLHER MENU</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded-none h-10 px-4 border-l-4 border-l-transparent text-zinc-600 hover:bg-zinc-50 text-[13px]">
                <Lock className="h-[18px] w-[18px]" />
                <span>TROCAR SENHA</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Dark Modules Section */}
        <div className="mt-2 bg-[#2d3e50] flex-1 pb-4 group-data-[collapsible=icon]:bg-transparent">
          <SidebarGroup className="p-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="rounded-none h-11 px-4 border-b border-[#3b4f63] text-zinc-200 hover:bg-[#3b4f63] hover:text-white text-[13px] font-medium group-data-[collapsible=icon]:text-zinc-600 group-data-[collapsible=icon]:border-none"
                >
                  <Link to="/academic/students">
                    <GraduationCap className="h-[18px] w-[18px]" />
                    <span>ACADÊMICO</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="rounded-none h-11 px-4 border-b border-[#3b4f63] text-zinc-200 hover:bg-[#3b4f63] hover:text-white text-[13px] font-medium group-data-[collapsible=icon]:text-zinc-600 group-data-[collapsible=icon]:border-none"
                >
                  <Link to="/admin/settings">
                    <Settings className="h-[18px] w-[18px]" />
                    <span>ADMINISTRAÇÃO SISTEMA</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="rounded-none h-11 px-4 border-b border-[#3b4f63] text-zinc-200 hover:bg-[#3b4f63] hover:text-white text-[13px] font-medium group-data-[collapsible=icon]:text-zinc-600 group-data-[collapsible=icon]:border-none"
                >
                  <Link to="/commercial/leads">
                    <Megaphone className="h-[18px] w-[18px]" />
                    <span>CRM - COMUNICAÇÃO</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="rounded-none h-11 px-4 border-b border-[#3b4f63] text-zinc-200 hover:bg-[#3b4f63] hover:text-white text-[13px] font-medium group-data-[collapsible=icon]:text-zinc-600 group-data-[collapsible=icon]:border-none"
                >
                  <Link to="/financial/payments">
                    <DollarSign className="h-[18px] w-[18px]" />
                    <span>FINANCEIRO</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="rounded-none h-11 px-4 border-b border-[#3b4f63] text-zinc-200 hover:bg-[#3b4f63] hover:text-white text-[13px] font-medium group-data-[collapsible=icon]:text-zinc-600 group-data-[collapsible=icon]:border-none">
                  <Wrench className="h-[18px] w-[18px]" />
                  <span>MATHEUS SOLUÇÕES</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
