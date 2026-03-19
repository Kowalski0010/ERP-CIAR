import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-subtle">
      <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar alunos, professores ou faturas..."
            className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-full"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage
                  src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=99"
                  alt="User"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin Diretor</p>
                <p className="text-xs leading-none text-muted-foreground">admin@edusync.com.br</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações da Conta</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
