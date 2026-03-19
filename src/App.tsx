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
import Grades from './pages/academic/Grades'
import Payments from './pages/financial/Payments'
import CashFlow from './pages/financial/CashFlow'
import Leads from './pages/commercial/Leads'
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
            <Route path="/academic/grades" element={<Grades />} />

            {/* Financial */}
            <Route path="/financial/payments" element={<Payments />} />
            <Route path="/financial/cash-flow" element={<CashFlow />} />

            {/* Commercial */}
            <Route path="/commercial/leads" element={<Leads />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppProvider>
  </BrowserRouter>
)

export default App
