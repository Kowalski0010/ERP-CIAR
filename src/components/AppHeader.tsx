import { useAppStore } from '@/contexts/AppContext'
import { Role } from '@/lib/types'
import { Bell, Search, ChevronDown, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppHeader() {
  const { currentUserRole, setCurrentUserRole } = useAppStore()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-4 shadow-sm">
      <SidebarTrigger className="-ml-2 text-zinc-500 hover:text-zinc-900 h-8 w-8" />

      <Separator orientation="vertical" className="h-6" />

      <div className="flex-1 max-w-md hidden sm:block ml-2">
        <div className="relative group">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            type="search"
            placeholder="Buscar registros, alunos ou faturas..."
            className="w-full bg-zinc-100/50 pl-9 h-8 text-xs border-transparent focus-visible:bg-white focus-visible:border-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-200 rounded-md transition-all shadow-none"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
          title="Central de Ajuda"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-zinc-500 hover:text-zinc-900"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-white"></span>
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-2 h-8 px-2 text-xs font-medium text-zinc-600 hover:text-zinc-900"
            >
              <span>{currentUserRole}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Alternar Perfil
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={currentUserRole}
              onValueChange={(v) => setCurrentUserRole(v as Role)}
            >
              <DropdownMenuRadioItem value="Admin" className="text-xs">
                Administrador Master
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Academico" className="text-xs">
                Gestor Acadêmico
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Financeiro" className="text-xs">
                Analista Financeiro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Comercial" className="text-xs">
                Consultor Comercial
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8 border border-zinc-200 shadow-sm">
                <AvatarImage
                  src={`https://img.usecurling.com/ppl/thumbnail?gender=female&seed=${currentUserRole === 'Admin' ? 99 : 50}`}
                  alt="User"
                />
                <AvatarFallback className="bg-zinc-100 text-zinc-900 text-xs font-semibold">
                  {currentUserRole.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3 bg-zinc-50/50 rounded-t-md">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-zinc-900">{currentUserRole} User</p>
                <p className="text-xs text-zinc-500">
                  user@{currentUserRole.toLowerCase()}.totvs.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">Minha Conta</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">Preferências</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive font-medium text-xs">
              Encerrar Sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
