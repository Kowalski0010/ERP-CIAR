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
import Payments from './pages/financial/Payments'
import CashFlow from './pages/financial/CashFlow'
import Leads from './pages/commercial/Leads'
import AuditLogs from './pages/admin/AuditLogs'
import Reports from './pages/admin/Reports'
import Notifications from './pages/admin/Notifications'
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

            {/* Academic */}
            <Route path="/academic/students" element={<Students />} />
            <Route path="/academic/teachers" element={<Teachers />} />
            <Route path="/academic/classes" element={<Classes />} />
            <Route path="/academic/schedules" element={<Schedules />} />
            <Route path="/academic/grades" element={<Grades />} />

            {/* Financial */}
            <Route path="/financial/payments" element={<Payments />} />
            <Route path="/financial/cash-flow" element={<CashFlow />} />

            {/* Commercial */}
            <Route path="/commercial/leads" element={<Leads />} />

            {/* Operational (Matheus Legacy Modules) */}
            <Route path="/hr/employees" element={<Employees />} />
            <Route path="/inventory/stock" element={<Stock />} />
            <Route path="/inventory/movements" element={<Movements />} />
            <Route path="/purchasing/suppliers" element={<Suppliers />} />
            <Route path="/purchasing/orders" element={<Orders />} />

            {/* Admin Features */}
            <Route path="/admin/logs" element={<AuditLogs />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/notifications" element={<Notifications />} />

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
