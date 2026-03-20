import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/contexts/AppContext'

import Layout from './components/Layout'
import Index from './pages/Index'
import Students from './pages/academic/Students'
import Teachers from './pages/academic/Teachers'
import Classes from './pages/academic/Classes'
import Schedules from './pages/academic/Schedules'
import Grades from './pages/academic/Grades'
import AcademicControlView from './pages/academic-control/AcademicControlView'
import ReportView from './pages/reports/ReportView'
import Payments from './pages/financial/Payments'
import CashFlow from './pages/financial/CashFlow'
import Leads from './pages/commercial/Leads'
import AuditLogs from './pages/admin/AuditLogs'
import Reports from './pages/admin/Reports'
import Notifications from './pages/admin/Notifications'
import DocumentManagement from './pages/admin/DocumentManagement'
import Workflows from './pages/admin/Workflows'
import AccessControl from './pages/admin/AccessControl'
import Settings from './pages/admin/Settings'
import CommunicationLogs from './pages/admin/CommunicationLogs'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentSchedule from './pages/student/StudentSchedule'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentFinancial from './pages/student/StudentFinancial'
import StudentProfile from './pages/student/StudentProfile'
import Employees from './pages/hr/Employees'
import Stock from './pages/inventory/Stock'
import Movements from './pages/inventory/Movements'
import Suppliers from './pages/purchasing/Suppliers'
import Orders from './pages/purchasing/Orders'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />

            {/* Academic Core */}
            <Route path="/academic/students" element={<Students />} />
            <Route path="/academic/teachers" element={<Teachers />} />
            <Route path="/academic/classes" element={<Classes />} />
            <Route path="/academic/schedules" element={<Schedules />} />
            <Route path="/academic/grades" element={<Grades />} />

            {/* Academic Control (Dynamic Views) */}
            <Route path="/academic-control/:id" element={<AcademicControlView />} />

            {/* Reports Suite (Dynamic Views) */}
            <Route path="/reports/:id" element={<ReportView />} />

            {/* Financial */}
            <Route path="/financial/payments" element={<Payments />} />
            <Route path="/financial/cash-flow" element={<CashFlow />} />

            {/* Commercial */}
            <Route path="/commercial/leads" element={<Leads />} />

            {/* Operational */}
            <Route path="/hr/employees" element={<Employees />} />
            <Route path="/inventory/stock" element={<Stock />} />
            <Route path="/inventory/movements" element={<Movements />} />
            <Route path="/purchasing/suppliers" element={<Suppliers />} />
            <Route path="/purchasing/orders" element={<Orders />} />

            {/* Admin Features */}
            <Route path="/admin/logs" element={<AuditLogs />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/documents" element={<DocumentManagement />} />
            <Route path="/admin/workflows" element={<Workflows />} />
            <Route path="/admin/rbac" element={<AccessControl />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/communications" element={<CommunicationLogs />} />

            {/* Student Portal */}
            <Route path="/student-area" element={<StudentDashboard />} />
            <Route path="/student-area/schedule" element={<StudentSchedule />} />
            <Route path="/student-area/attendance" element={<StudentAttendance />} />
            <Route path="/student-area/financial" element={<StudentFinancial />} />
            <Route path="/student-area/profile" element={<StudentProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppProvider>
  </BrowserRouter>
)

export default App
