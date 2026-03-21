import { HelpCircle, LogOut, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppStore } from '@/contexts/AppContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Role } from '@/lib/types'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

export function AppHeader() {
  const {
    currentUserRole,
    setCurrentUserRole,
    notifications,
    markNotificationAsRead,
    students,
    acrPatients,
    logout,
  } = useAppStore()
  const navigate = useNavigate()

  // Find user ID for targeted notifications (mock logic)
  const getUserId = () => {
    if (currentUserRole === 'Aluno') return students[0]?.id
    if (currentUserRole === 'Paciente') return acrPatients[0]?.id
    return null
  }
  const userId = getUserId()

  const myNotifications = notifications
    .filter((n) => {
      if (n.userId && n.userId !== userId) return false
      if (currentUserRole === 'Paciente' && n.target !== 'Pacientes' && n.target !== 'Todos')
        return false
      if (currentUserRole === 'Aluno' && n.target !== 'Alunos' && n.target !== 'Todos') return false
      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const unreadCount = myNotifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between md:justify-end gap-3 border-b border-zinc-200 bg-white px-4 md:px-6 shadow-sm">
      <div className="flex items-center md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Role Switcher for Testing RBAC */}
        <div className="hidden md:flex items-center gap-2 mr-2">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Perfil Atual:
          </span>
          <Select value={currentUserRole} onValueChange={(v) => setCurrentUserRole(v as Role)}>
            <SelectTrigger className="w-[140px] h-8 text-xs border-zinc-200 bg-zinc-50 font-semibold focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Gestao">Gestão/Diretoria</SelectItem>
              <SelectItem value="Secretaria">Secretaria</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="Aluno">Aluno</SelectItem>
              <SelectItem value="Paciente">Paciente (ACR)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 text-zinc-700">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
              <span className="font-semibold text-sm text-zinc-900">Notificações</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px] bg-white border-zinc-200">
                  {unreadCount} novas
                </Badge>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100">
              {myNotifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">Nenhuma notificação.</div>
              ) : (
                myNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-sm hover:bg-zinc-50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-blue-50/30' : 'bg-white'
                    }`}
                    onClick={() => markNotificationAsRead(n.id)}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span
                        className={`font-semibold text-xs truncate ${!n.read ? 'text-blue-900' : 'text-zinc-900'}`}
                      >
                        {n.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 whitespace-nowrap font-mono shrink-0">
                        {new Date(n.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden sm:flex items-center gap-2 bg-zinc-50 pr-3 pl-1 py-1 rounded-full border border-zinc-200">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=99"
              alt="USUARIO"
            />
            <AvatarFallback className="bg-[#1e3a8a] text-white text-[10px]">US</AvatarFallback>
          </Avatar>
          <span className="text-[11px] font-bold text-zinc-700 tracking-wider uppercase">
            {currentUserRole}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium text-white bg-[#2d3e50] hover:bg-[#1e2b3c] hover:text-white border-transparent hidden sm:flex"
        >
          <HelpCircle className="h-3.5 w-3.5 mr-1.5" /> Suporte
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hidden sm:flex"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sair
        </Button>
      </div>
    </header>
  )
}
