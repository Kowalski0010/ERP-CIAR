import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { AppProvider } from './contexts/AppContext'
import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from './components/ui/sonner'
import Layout from './components/Layout'

// Core Pages
import Index from './pages/Index'
import NotFound from './pages/NotFound'

// Academic
import Students from './pages/academic/Students'
import Teachers from './pages/academic/Teachers'
import Classes from './pages/academic/Classes'
import Schedules from './pages/academic/Schedules'
import Grades from './pages/academic/Grades'

// Secretaria
import ContratosDocumentos from './pages/secretaria/ContratosDocumentos'
import MatriculaOperacoes from './pages/secretaria/MatriculaOperacoes'
import TurmasHorarios from './pages/secretaria/TurmasHorarios'
import Consultas from './pages/secretaria/Consultas'
import EnrollmentWorkflow from './pages/secretaria/EnrollmentWorkflow'
import AlunoOperacoes from './pages/secretaria/AlunoOperacoes'
import Transferencias from './pages/secretaria/Transferencias'
import Administrativo from './pages/secretaria/Administrativo'
import RelatorioFinal from './pages/secretaria-educacao/RelatorioFinal'

// Financial
import Payments from './pages/financial/Payments'
import CashFlow from './pages/financial/CashFlow'

// Commercial
import Leads from './pages/commercial/Leads'

// Admin
import Settings from './pages/admin/Settings'
import AccessControl from './pages/admin/AccessControl'
import AuditLogs from './pages/admin/AuditLogs'
import DocumentManagement from './pages/admin/DocumentManagement'
import Notifications from './pages/admin/Notifications'
import Reports from './pages/admin/Reports'
import Workflows from './pages/admin/Workflows'
import CommunicationLogs from './pages/admin/CommunicationLogs'

// HR
import Employees from './pages/hr/Employees'

// Inventory & Purchasing
import Stock from './pages/inventory/Stock'
import Movements from './pages/inventory/Movements'
import Orders from './pages/purchasing/Orders'
import Suppliers from './pages/purchasing/Suppliers'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="sio-ui-theme">
      <AppProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />

              <Route path="academic">
                <Route path="students" element={<Students />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="classes" element={<Classes />} />
                <Route path="schedules" element={<Schedules />} />
                <Route path="grades" element={<Grades />} />
              </Route>

              <Route path="secretaria">
                <Route path="2a-via-contrato" element={<ContratosDocumentos />} />
                <Route path="imprimir-documentos" element={<ContratosDocumentos />} />

                <Route path="bloquear-matricula" element={<MatriculaOperacoes />} />
                <Route path="manutencao-matricula" element={<MatriculaOperacoes />} />

                <Route path="cadastrar-horario" element={<TurmasHorarios />} />
                <Route path="compartilhar-turma" element={<TurmasHorarios />} />
                <Route path="dividir-turma" element={<TurmasHorarios />} />

                <Route path="consultar-aluno" element={<Consultas />} />
                <Route path="consultar-curso" element={<Consultas />} />
                <Route path="consultar-horario-curso" element={<Consultas />} />
                <Route path="consultar-horario-prof" element={<Consultas />} />
                <Route path="consultar-matricula" element={<Consultas />} />
                <Route path="consultar-responsavel" element={<Consultas />} />

                <Route path="efetivar-pre-matricula" element={<EnrollmentWorkflow />} />
                <Route path="efetuar-matricula" element={<EnrollmentWorkflow />} />
                <Route path="efetuar-matricula-disciplina" element={<EnrollmentWorkflow />} />
                <Route path="efetuar-pre-matricula" element={<EnrollmentWorkflow />} />

                <Route path="ocorrencias-aluno" element={<AlunoOperacoes />} />
                <Route path="requerimentos" element={<AlunoOperacoes />} />

                <Route path="trocar-aluno-curso" element={<Transferencias />} />
                <Route path="trocar-aluno-turma" element={<Transferencias />} />

                <Route path="reabertura-periodo" element={<Administrativo />} />
                <Route path="recursos-aula" element={<Administrativo />} />
              </Route>

              <Route path="secretaria-educacao">
                <Route path="relatorio-final" element={<RelatorioFinal />} />
              </Route>

              <Route path="financial">
                <Route path="payments" element={<Payments />} />
                <Route path="cash-flow" element={<CashFlow />} />
              </Route>

              <Route path="commercial">
                <Route path="leads" element={<Leads />} />
              </Route>

              <Route path="hr">
                <Route path="employees" element={<Employees />} />
              </Route>

              <Route path="inventory">
                <Route path="stock" element={<Stock />} />
                <Route path="movements" element={<Movements />} />
              </Route>

              <Route path="purchasing">
                <Route path="orders" element={<Orders />} />
                <Route path="suppliers" element={<Suppliers />} />
              </Route>

              <Route path="admin">
                <Route path="settings" element={<Settings />} />
                <Route path="access-control" element={<AccessControl />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="documents" element={<DocumentManagement />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reports" element={<Reports />} />
                <Route path="workflows" element={<Workflows />} />
                <Route path="communication-logs" element={<CommunicationLogs />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <Sonner />
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
