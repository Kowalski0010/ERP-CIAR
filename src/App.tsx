import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './hooks/use-auth'
import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from './components/ui/sonner'
import Layout from './components/Layout'

// Auth Pages
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'

// Core Pages
import Index from './pages/Index'
import NotFound from './pages/NotFound'

// Sidebar Utilities
import Notepad from './pages/utilities/Notepad'
import Messages from './pages/utilities/Messages'
import News from './pages/utilities/News'
import ChangePassword from './pages/utilities/ChangePassword'
import Chat from './pages/utilities/Chat'

// Academic
import Students from './pages/academic/Students'
import Teachers from './pages/academic/Teachers'
import Classes from './pages/academic/Classes'
import Schedules from './pages/academic/Schedules'
import Grades from './pages/academic/Grades'
import ClassOccupancy from './pages/academic/ClassOccupancy'
import PedagogicalTracking from './pages/academic/PedagogicalTracking'
import AcademicControlView from './pages/academic-control/AcademicControlView'
import Agenda from './pages/academic/Agenda'
import AcademicPerformance from './pages/academic/AcademicPerformance'
import DigitalRollCall from './pages/academic/DigitalRollCall'
import Extracurricular from './pages/academic/Extracurricular'
import RoomOccupancy from './pages/academic/RoomOccupancy'

// ACR (Clínica)
import AcrPatients from './pages/acr/Patients'
import AcrClinicalRecords from './pages/acr/ClinicalRecords'
import AcrAgenda from './pages/acr/AcrAgenda'
import AcrAnalytics from './pages/acr/AcrAnalytics'

// Library
import LibraryCatalog from './pages/library/LibraryCatalog'
import LibraryLoans from './pages/library/LibraryLoans'
import LibraryDashboard from './pages/library/LibraryDashboard'

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
import FeedbackInbox from './pages/secretaria/FeedbackInbox'
import Certificados from './pages/secretaria/Certificados'

// Financial
import Payments from './pages/financial/Payments'
import CashFlow from './pages/financial/CashFlow'
import FinancialAnalytics from './pages/financial/FinancialAnalytics'
import ChartOfAccounts from './pages/financial/ChartOfAccounts'
import FinancialTransactions from './pages/financial/FinancialTransactions'

// Commercial
import Leads from './pages/commercial/Leads'

// Admin / Generic Views
import Settings from './pages/admin/Settings'
import AccessControl from './pages/admin/AccessControl'
import AuditLogs from './pages/admin/AuditLogs'
import DocumentManagement from './pages/admin/DocumentManagement'
import Notifications from './pages/admin/Notifications'
import Reports from './pages/admin/Reports'
import Workflows from './pages/admin/Workflows'
import CommunicationLogs from './pages/admin/CommunicationLogs'
import RegistryView from './pages/admin/RegistryView'
import BackupSettings from './pages/admin/BackupSettings'
import PendingApprovals from './pages/admin/PendingApprovals'
import CommunicationSettings from './pages/admin/CommunicationSettings'
import Integrations from './pages/admin/Integrations'
import Events from './pages/admin/Events'
import Surveys from './pages/admin/Surveys'
import AdminDataImport from './pages/admin/AdminDataImport'
import UserManagement from './pages/admin/UserManagement'

// Generic Report View
import ReportView from './pages/reports/ReportView'
import CustomReports from './pages/reports/CustomReports'

// HR & Recruitment
import Employees from './pages/hr/Employees'
import Recruitment from './pages/hr/Recruitment'

// Inventory & Purchasing
import Stock from './pages/inventory/Stock'
import Movements from './pages/inventory/Movements'
import Orders from './pages/purchasing/Orders'
import Suppliers from './pages/purchasing/Suppliers'

// Portals
import StudentDashboard from './pages/student/StudentDashboard'
import StudentSchedule from './pages/student/StudentSchedule'
import StudentFinancial from './pages/student/StudentFinancial'
import StudentDocuments from './pages/student/StudentDocuments'
import StudentFeedback from './pages/student/StudentFeedback'
import StudentProfile from './pages/student/StudentProfile'
import ParentDashboard from './pages/parent/ParentDashboard'
import PortalDashboard from './pages/portal/PortalDashboard'
import ProfileEdit from './pages/student/ProfileEdit'
import DocumentRequests from './pages/student/DocumentRequests'
import StudentHistory from './pages/academic/StudentHistory'
import CourseExemptions from './pages/academic/CourseExemptions'
import StudentLeaves from './pages/academic/StudentLeaves'
import GeneralReports from './pages/admin/GeneralReports'
import ScheduleMaintenance from './pages/admin/ScheduleMaintenance'
import PaymentPlans from './pages/admin/PaymentPlans'

// Public Forms
import TeacherApplication from './pages/public/TeacherApplication'
import VerifyCertificate from './pages/public/VerifyCertificate'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="sio-ui-theme">
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              {/* Public Auth & External Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/apply-teacher" element={<TeacherApplication />} />
              <Route path="/verify/:code" element={<VerifyCertificate />} />

              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />

                {/* Utility Tools */}
                <Route path="utilities">
                  <Route path="notepad" element={<Notepad />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="news" element={<News />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>

                {/* ACR Clínica */}
                <Route path="acr">
                  <Route path="patients" element={<AcrPatients />} />
                  <Route path="records" element={<AcrClinicalRecords />} />
                  <Route path="agenda" element={<AcrAgenda />} />
                  <Route path="analytics" element={<AcrAnalytics />} />
                </Route>

                {/* Academic Core */}
                <Route path="academic">
                  <Route path="agenda" element={<Agenda />} />
                  <Route path="students" element={<Students />} />
                  <Route path="teachers" element={<Teachers />} />
                  <Route path="classes" element={<Classes />} />
                  <Route path="schedules" element={<Schedules />} />
                  <Route path="grades" element={<Grades />} />
                  <Route path="occupancy" element={<ClassOccupancy />} />
                  <Route path="room-occupancy" element={<RoomOccupancy />} />
                  <Route path="pedagogical" element={<PedagogicalTracking />} />
                  <Route path="performance" element={<AcademicPerformance />} />
                  <Route path="roll-call" element={<DigitalRollCall />} />
                  <Route path="extracurricular" element={<Extracurricular />} />
                  <Route path="student-history" element={<StudentHistory />} />
                  <Route path="course-exemptions" element={<CourseExemptions />} />
                  <Route path="student-leaves" element={<StudentLeaves />} />
                  <Route path="control/:id" element={<AcademicControlView />} />
                </Route>

                {/* Library Module */}
                <Route path="library">
                  <Route path="catalog" element={<LibraryCatalog />} />
                  <Route path="loans" element={<LibraryLoans />} />
                  <Route path="dashboard" element={<LibraryDashboard />} />
                </Route>

                {/* Portals */}
                <Route path="portal" element={<PortalDashboard />} />
                <Route path="student">
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="schedule" element={<StudentSchedule />} />
                  <Route path="financial" element={<StudentFinancial />} />
                  <Route path="documents" element={<StudentDocuments />} />
                  <Route path="document-requests" element={<DocumentRequests />} />
                  <Route path="feedback" element={<StudentFeedback />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="profile-edit" element={<ProfileEdit />} />
                </Route>

                <Route path="parent">
                  <Route path="dashboard" element={<ParentDashboard />} />
                </Route>

                {/* Secretaria Modules */}
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
                  <Route path="feedback" element={<FeedbackInbox />} />
                  <Route path="certificados" element={<Certificados />} />
                </Route>

                <Route path="secretaria-educacao">
                  <Route path="relatorio-final" element={<RelatorioFinal />} />
                </Route>

                {/* Financial */}
                <Route path="financial">
                  <Route path="payments" element={<Payments />} />
                  <Route path="cash-flow" element={<CashFlow />} />
                  <Route path="analytics" element={<FinancialAnalytics />} />
                  <Route path="accounts" element={<ChartOfAccounts />} />
                  <Route path="transactions" element={<FinancialTransactions />} />
                </Route>

                {/* Commercial CRM */}
                <Route path="commercial">
                  <Route path="leads" element={<Leads />} />
                </Route>

                {/* HR */}
                <Route path="hr">
                  <Route path="employees" element={<Employees />} />
                  <Route path="recruitment" element={<Recruitment />} />
                </Route>

                {/* Inventory */}
                <Route path="inventory">
                  <Route path="stock" element={<Stock />} />
                  <Route path="movements" element={<Movements />} />
                </Route>

                {/* Purchasing */}
                <Route path="purchasing">
                  <Route path="orders" element={<Orders />} />
                  <Route path="suppliers" element={<Suppliers />} />
                </Route>

                {/* Admin & System Registry */}
                <Route path="admin">
                  <Route path="users" element={<UserManagement />} />
                  <Route path="approvals" element={<PendingApprovals />} />
                  <Route path="communication-settings" element={<CommunicationSettings />} />
                  <Route path="integrations" element={<Integrations />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="access-control" element={<AccessControl />} />
                  <Route path="audit-logs" element={<AuditLogs />} />
                  <Route path="documents" element={<DocumentManagement />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="workflows" element={<Workflows />} />
                  <Route path="communication-logs" element={<CommunicationLogs />} />
                  <Route path="registry/:id" element={<RegistryView />} />
                  <Route path="backup" element={<BackupSettings />} />
                  <Route path="events" element={<Events />} />
                  <Route path="surveys" element={<Surveys />} />
                  <Route path="data-import" element={<AdminDataImport />} />
                  <Route path="general-reports" element={<GeneralReports />} />
                  <Route path="schedule-maintenance" element={<ScheduleMaintenance />} />
                  <Route path="payment-plans" element={<PaymentPlans />} />
                </Route>

                {/* Generic Reports */}
                <Route path="reports/custom" element={<CustomReports />} />
                <Route path="reports/:id" element={<ReportView />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
          <Sonner />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
