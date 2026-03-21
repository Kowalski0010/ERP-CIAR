import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useAppStore } from '@/contexts/AppContext'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Layout() {
  const { currentUserRole } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUserRole === 'Aluno' && location.pathname === '/') {
      navigate('/student/dashboard', { replace: true })
    }
  }, [currentUserRole, location.pathname, navigate])

  // RBAC logic map
  const rolePermissions: Record<string, string[]> = {
    Secretaria: ['/secretaria', '/academic', '/admin/registry', '/utilities', '/reports'],
    Financeiro: ['/financial', '/utilities', '/reports'],
    Professor: ['/academic', '/utilities'],
    Aluno: ['/student', '/utilities'],
    Gestao: ['/'], // Has access to everything
    Admin: ['/'], // Has access to everything
  }

  const allowedPaths = rolePermissions[currentUserRole] || ['/']
  const isAllowed =
    allowedPaths.includes('/') ||
    allowedPaths.some((p) => location.pathname.startsWith(p)) ||
    location.pathname === '/'

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f4f6f8] font-sans">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-zinc-900">Acesso Negado</h1>
        <p className="text-zinc-500 mt-2 mb-6">
          Seu perfil ({currentUserRole}) não possui permissão para acessar esta área.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button
            onClick={() => navigate(currentUserRole === 'Aluno' ? '/student/dashboard' : '/')}
          >
            Ir para Início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f4f6f8] font-sans overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 w-full min-w-0 bg-transparent">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
            <div className="mx-auto max-w-[1400px]">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
