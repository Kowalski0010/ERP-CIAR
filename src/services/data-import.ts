export type ImportEntityType =
  | 'students'
  | 'teachers'
  | 'classes'
  | 'financial_accounts'
  | 'financial_transactions'
  | 'payments'
  | 'disciplinas'
  | 'courses'
  | 'acr_patients'

interface FieldConfig {
  name: string
  type: 'string' | 'number' | 'date' | 'uuid'
  required: boolean
}

interface EntityConfig {
  label: string
  table: string
  fields: FieldConfig[]
  fkValidations?: { field: string; table: string }[]
  defaultValues?: Record<string, any>
}

export const ENTITY_CONFIGS: Record<ImportEntityType, EntityConfig> = {
  students: {
    label: 'Alunos (Matrículas Ativas)',
    table: 'students',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'email', type: 'string', required: false },
      { name: 'course', type: 'string', required: false },
      { name: 'phone', type: 'string', required: false },
    ],
    defaultValues: { status: 'Ativo' },
  },
  teachers: {
    label: 'Corpo Docente',
    table: 'teachers',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'email', type: 'string', required: false },
      { name: 'subjects', type: 'string', required: false },
      { name: 'workload', type: 'number', required: false },
    ],
    defaultValues: { status: 'Ativo', workload: 40 },
  },
  classes: {
    label: 'Turmas e Grades',
    table: 'classes',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'course', type: 'string', required: true },
      { name: 'semester', type: 'string', required: true },
      { name: 'capacity', type: 'number', required: false },
    ],
    defaultValues: { capacity: 40 },
  },
  financial_accounts: {
    label: 'Contas Financeiras',
    table: 'financial_accounts',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'type', type: 'string', required: true },
      { name: 'description', type: 'string', required: false },
    ],
  },
  financial_transactions: {
    label: 'Transações Financeiras',
    table: 'financial_transactions',
    fields: [
      { name: 'account_id', type: 'uuid', required: false },
      { name: 'amount', type: 'number', required: true },
      { name: 'date', type: 'date', required: true },
      { name: 'description', type: 'string', required: true },
      { name: 'status', type: 'string', required: true },
      { name: 'type', type: 'string', required: true },
    ],
    fkValidations: [{ field: 'account_id', table: 'financial_accounts' }],
  },
  payments: {
    label: 'Pagamentos',
    table: 'payments',
    fields: [
      { name: 'amount', type: 'number', required: true },
      { name: 'due_date', type: 'date', required: true },
      { name: 'status', type: 'string', required: false },
      { name: 'student_id', type: 'uuid', required: false },
      { name: 'student_name', type: 'string', required: false },
      { name: 'installment_number', type: 'number', required: false },
      { name: 'total_installments', type: 'number', required: false },
    ],
    fkValidations: [{ field: 'student_id', table: 'students' }],
    defaultValues: { status: 'Pendente' },
  },
  disciplinas: {
    label: 'Disciplinas',
    table: 'disciplinas',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'workload', type: 'number', required: true },
      { name: 'status', type: 'string', required: false },
      { name: 'teacher', type: 'string', required: false },
      { name: 'course', type: 'string', required: false },
      { name: 'date', type: 'date', required: false },
      { name: 'observations', type: 'string', required: false },
    ],
    defaultValues: { status: 'Ativo' },
  },
  courses: {
    label: 'Cursos',
    table: 'courses',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'duration', type: 'number', required: true },
      { name: 'mode', type: 'string', required: true },
      { name: 'status', type: 'string', required: false },
      { name: 'description', type: 'string', required: false },
    ],
    defaultValues: { status: 'Ativo' },
  },
  acr_patients: {
    label: 'Pacientes (ACR)',
    table: 'acr_patients',
    fields: [
      { name: 'name', type: 'string', required: true },
      { name: 'email', type: 'string', required: false },
      { name: 'phone', type: 'string', required: false },
      { name: 'birth_date', type: 'date', required: false },
      { name: 'background', type: 'string', required: false },
      { name: 'registration_date', type: 'date', required: false },
    ],
  },
}

function templateExample(field: FieldConfig): string {
  if (field.type === 'number') return '100'
  if (field.type === 'date') return '2024-01-15'
  if (field.type === 'uuid') return '00000000-0000-0000-0000-000000000000'
  if (field.name === 'email') return 'exemplo@email.com'
  if (field.name === 'phone') return '11999999999'
  return 'Texto Exemplo'
}

export function generateCsvTemplate(entity: ImportEntityType): string {
  const config = ENTITY_CONFIGS[entity]
  const headers = config.fields.map((f) => f.name).join(',')
  const example = config.fields.map((f) => templateExample(f)).join(',')
  return `${headers}\n${example}`
}

export function generateJsonTemplate(entity: ImportEntityType): string {
  const config = ENTITY_CONFIGS[entity]
  const example: Record<string, any> = {}
  config.fields.forEach((f) => {
    if (f.type === 'number') example[f.name] = 100
    else if (f.type === 'date') example[f.name] = '2024-01-15'
    else if (f.type === 'uuid') example[f.name] = '00000000-0000-0000-0000-000000000000'
    else example[f.name] = templateExample(f)
  })
  return JSON.stringify([example], null, 2)
}
