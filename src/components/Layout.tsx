import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useAppStore } from '@/contexts/AppContext'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'

export default function Layout() {
  const { currentUserRole, isAuthenticated } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // RBAC logic map
  const rolePermissions: Record<string, string[]> = {
    Secretaria: [
      '/secretaria',
      '/academic',
      '/admin',
      '/utilities',
      '/reports',
      '/library',
      '/acr',
      '/financial',
      '/hr',
      '/inventory',
      '/purchasing',
    ],
    Financeiro: [
      '/financial',
      '/admin/security',
      '/admin/integrations',
      '/utilities',
      '/reports',
      '/secretaria/feedback',
      '/admin/surveys',
      '/admin/events',
      '/admin/communication-settings',
      '/admin/notifications',
      '/academic/agenda',
    ],
    Professor: [
      '/academic',
      '/utilities',
      '/library',
      '/secretaria/feedback',
      '/admin/surveys',
      '/admin/events',
      '/admin/communication-settings',
      '/admin/notifications',
    ],
    Aluno: ['/student', '/utilities', '/library'],
    Responsável: ['/parent', '/utilities'],
    Paciente: ['/portal', '/utilities'],
    Gestao: ['/'], // Has access to everything
    Admin: ['/'], // Has access to everything
  }

  const allowedPaths = rolePermissions[currentUserRole] || ['/']

  // Admin and Gestao bypass restrictions. Others check prefix.
  const isAllowed =
    currentUserRole === 'Admin' ||
    currentUserRole === 'Gestao' ||
    allowedPaths.some((p) => location.pathname.startsWith(p)) ||
    location.pathname === '/'

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/30 dark:bg-background font-sans p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
        <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
          Seu perfil ({currentUserRole}) não possui permissão para acessar esta área restrita.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button onClick={() => navigate('/')}>Ir para Início</Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30 dark:bg-background font-sans overflow-hidden text-foreground">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 w-full min-w-0 bg-transparent">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
            <div className="mx-auto max-w-[1400px]">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
        <ThemeToggle />
      </div>
    </SidebarProvider>
  )
}
