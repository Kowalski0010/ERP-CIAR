import { useAppStore } from '@/contexts/AppContext'
import { Role } from '@/lib/types'
import { Bell, Search, ChevronDown, HelpCircle, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AppHeader() {
  const { currentUserRole, setCurrentUserRole, notifications, markNotificationsAsRead } =
    useAppStore()

  const myNotifications = notifications.filter((n) => {
    if (n.target === 'Todos') return true
    if (currentUserRole === 'Aluno' && n.target === 'Alunos') return true
    if (currentUserRole !== 'Aluno' && n.target === 'Staff') return true
    return false
  })

  const unreadCount = myNotifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-4 shadow-sm">
      <SidebarTrigger className="-ml-2 text-zinc-500 hover:text-zinc-900 h-8 w-8" />

      <Separator orientation="vertical" className="h-6" />

      <div className="flex-1 max-w-md hidden sm:block ml-2">
        {currentUserRole !== 'Aluno' && (
          <div className="relative group">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <Input
              type="search"
              placeholder="Buscar registros, alunos ou faturas..."
              className="w-full bg-zinc-100/50 pl-9 h-8 text-xs border-transparent focus-visible:bg-white focus-visible:border-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-200 rounded-md transition-all shadow-none"
            />
          </div>
        )}
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

        <Popover
          onOpenChange={(open) => {
            if (!open && unreadCount > 0) markNotificationsAsRead()
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-zinc-500 hover:text-zinc-900"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 p-0 overflow-hidden shadow-lg border-zinc-200"
          >
            <div className="p-3 border-b border-zinc-100 bg-zinc-50/80 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-900">Notificações</h4>
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount} novas
              </Badge>
            </div>
            <ScrollArea className="h-[300px]">
              {myNotifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-zinc-500">Nenhuma notificação.</div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {myNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-sm transition-colors hover:bg-zinc-50 ${!n.read ? 'bg-zinc-50/50' : 'bg-white'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`font-medium text-xs ${n.type === 'Warning' ? 'text-amber-600' : n.type === 'Success' ? 'text-emerald-600' : 'text-blue-600'}`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(n.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

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
              <DropdownMenuRadioItem value="Aluno" className="text-xs font-semibold text-primary">
                Portal do Aluno
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8 border border-zinc-200 shadow-sm">
                <AvatarImage
                  src={
                    currentUserRole === 'Aluno'
                      ? 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1'
                      : `https://img.usecurling.com/ppl/thumbnail?gender=female&seed=${currentUserRole === 'Admin' ? 99 : 50}`
                  }
                  alt="User"
                />
                <AvatarFallback className="bg-zinc-100 text-zinc-900 text-xs font-semibold">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3 bg-zinc-50/50 rounded-t-md">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-zinc-900">
                  {currentUserRole === 'Aluno' ? 'Ana Silva' : `${currentUserRole} User`}
                </p>
                <p className="text-xs text-zinc-500">
                  {currentUserRole === 'Aluno'
                    ? 'ana.silva@aluno.edu.br'
                    : `user@${currentUserRole.toLowerCase()}.totvs.com`}
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
