import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
