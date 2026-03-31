import {
  Student,
  Lead,
  Payment,
  Teacher,
  Schedule,
  ClassRoom,
  AuditLog,
  SystemNotification,
  AttendanceRecord,
  Employee,
  Product,
  StockMovement,
  Supplier,
  PurchaseOrder,
  CommunicationLog,
  ChatMessage,
  Curso,
  Avaliacao,
  Convenio,
  CepRecord,
  Disciplina,
  Book,
  Loan,
  StudentFeedback,
  ApprovalRequest,
  ExtracurricularActivity,
  ExtracurricularEnrollment,
  Candidate,
  SchoolEvent,
  NPSSurvey,
  AcrPatient,
  AcrRecord,
  AcrAppointment,
  SystemUser,
} from './types'

const defaultAddress = {
  zipCode: '01001-000',
  street: 'Praça da Sé',
  number: '1',
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
}

export const mockSystemUsers: SystemUser[] = []
export const mockStudents: Student[] = []
export const mockTeachers: Teacher[] = []
export const mockClasses: ClassRoom[] = []
export const mockSchedules: Schedule[] = []
export const mockLeads: Lead[] = []
export const mockPayments: Payment[] = []
export const mockFinancialChart: any[] = []
export const mockLogs: AuditLog[] = []
export const mockNotifications: SystemNotification[] = []
export const mockCommunicationLogs: CommunicationLog[] = []
export const mockAttendance: AttendanceRecord[] = []
export const mockEmployees: Employee[] = []
export const mockProducts: Product[] = []
export const mockMovements: StockMovement[] = []
export const mockSuppliers: Supplier[] = []
export const mockOrders: PurchaseOrder[] = []
export const mockChatMessages: ChatMessage[] = []
export const mockCursos: Curso[] = []
export const mockAvaliacoes: Avaliacao[] = []
export const mockConvenios: Convenio[] = []
export const mockCeps: CepRecord[] = []
export const mockDisciplinas: Disciplina[] = []
export const mockBooks: Book[] = []
export const mockLoans: Loan[] = []
export const mockFeedbacks: StudentFeedback[] = []
export const mockApprovalRequests: ApprovalRequest[] = []
export const mockExtracurricularActivities: ExtracurricularActivity[] = []
export const mockExtracurricularEnrollments: ExtracurricularEnrollment[] = []
export const mockCandidates: Candidate[] = []
export const mockSchoolEvents: SchoolEvent[] = []
export const mockSurveys: NPSSurvey[] = []
export const mockAcrPatients: AcrPatient[] = []
export const mockAcrRecords: AcrRecord[] = []
export const mockAcrAppointments: AcrAppointment[] = []
