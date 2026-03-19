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
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border/50 bg-background px-4 shadow-subtle">
      <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground h-8 w-8" />
      <Separator orientation="vertical" className="h-6 opacity-50" />

      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Pesquisar registros..."
            className="w-full bg-muted/40 pl-9 h-8 text-sm border-transparent focus-visible:bg-background focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-md transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Ajuda"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background"></span>
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1 opacity-50 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-2 h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <span>{currentUserRole}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
              Alternar Visão
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={currentUserRole}
              onValueChange={(v) => setCurrentUserRole(v as Role)}
            >
              <DropdownMenuRadioItem value="Admin">Administrador Master</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Academico">Gestor Acadêmico</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Financeiro">Analista Financeiro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Comercial">Consultor Comercial</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-1 p-0">
              <Avatar className="h-8 w-8 border border-border/50 shadow-sm">
                <AvatarImage
                  src={`https://img.usecurling.com/ppl/thumbnail?gender=female&seed=${currentUserRole === 'Admin' ? 99 : 50}`}
                  alt="User"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  {currentUserRole} User
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@{currentUserRole.toLowerCase()}.totvs.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Minha Conta</DropdownMenuItem>
            <DropdownMenuItem>Preferências</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive font-medium">
              Encerrar Sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
