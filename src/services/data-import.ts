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
  label?: string
  validation?: 'email' | 'cpf'
}

interface EntityConfig {
  label: string
  table: string
  fields: FieldConfig[]
  fkValidations?: { field: string; table: string }[]
  defaultValues?: Record<string, any>
  duplicateFields?: string[]
}

export const ENTITY_CONFIGS: Record<ImportEntityType, EntityConfig> = {
  students: {
    label: 'Alunos (Matrículas Ativas)',
    table: 'students',
    fields: [
      { name: 'name', type: 'string', required: true, label: 'Nome' },
      { name: 'registration_code', type: 'string', required: false, label: 'Matrícula' },
      { name: 'nationality', type: 'string', required: false, label: 'Nacionalidade' },
      { name: 'birth_city', type: 'string', required: false, label: 'Cidade natal' },
      { name: 'email', type: 'string', required: false, label: 'E-mail', validation: 'email' },
      { name: 'birth_date', type: 'date', required: false, label: 'Data de nascimento' },
      { name: 'rg', type: 'string', required: false, label: 'RG' },
      { name: 'rg_issuer', type: 'string', required: false, label: 'Órgão emissor' },
      { name: 'cpf', type: 'string', required: false, label: 'CPF', validation: 'cpf' },
      { name: 'marital_status', type: 'string', required: false, label: 'Estado civil' },
      { name: 'mother_name', type: 'string', required: false, label: 'Nome da mãe' },
      { name: 'father_name', type: 'string', required: false, label: 'Nome do pai' },
      { name: 'address_zip', type: 'string', required: false, label: 'CEP' },
      { name: 'address_street', type: 'string', required: false, label: 'Rua' },
      { name: 'address_number', type: 'string', required: false, label: 'Número' },
      { name: 'address_neighborhood', type: 'string', required: false, label: 'Bairro' },
      { name: 'address_city', type: 'string', required: false, label: 'Cidade' },
      { name: 'address_state', type: 'string', required: false, label: 'Estado' },
      { name: 'phone', type: 'string', required: false, label: 'Telefone celular' },
      { name: 'previous_graduation', type: 'string', required: false, label: 'Graduação anterior' },
      { name: 'contract', type: 'string', required: false, label: 'Contrato' },
      { name: 'observations', type: 'string', required: false, label: 'Observações' },
      { name: 'due_day', type: 'string', required: false, label: 'Dia de vencimento' },
    ],
    defaultValues: { status: 'Ativo' },
    duplicateFields: ['registration_code', 'cpf'],
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

const EXAMPLE_VALUES: Record<string, string> = {
  name: 'João da Silva',
  registration_code: '26-001',
  nationality: 'Brasileira',
  birth_city: 'São Paulo',
  email: 'joao.silva@email.com',
  birth_date: '15-05-1995',
  rg: '12.345.678-9',
  rg_issuer: 'SSP',
  cpf: '123.456.789-00',
  marital_status: 'Solteiro',
  mother_name: 'Maria da Silva',
  father_name: 'José da Silva',
  address_zip: '01000-000',
  address_street: 'Rua das Flores',
  address_number: '123',
  address_neighborhood: 'Centro',
  address_city: 'São Paulo',
  address_state: 'SP',
  phone: '(11) 99999-9999',
  previous_graduation: 'Ensino Médio',
  contract: 'Contrato Padrão',
  observations: 'Sem observações',
  due_day: '10',
}

function templateExample(field: FieldConfig): string {
  if (EXAMPLE_VALUES[field.name]) return EXAMPLE_VALUES[field.name]
  if (field.type === 'number') return '100'
  if (field.type === 'date') return '15-01-2024'
  if (field.type === 'uuid') return '00000000-0000-0000-0000-000000000000'
  if (field.name === 'phone') return '11999999999'
  return 'Texto Exemplo'
}

function convertDateToISO(value: string): string | null {
  const match = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
  if (!match) return null
  const day = match[1]
  const month = match[2]
  const year = match[3]
  const dayNum = parseInt(day, 10)
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)
  if (monthNum < 1 || monthNum > 12) return null
  const maxDay = new Date(yearNum, monthNum, 0).getDate()
  if (dayNum < 1 || dayNum > maxDay) return null
  return `${year}-${month}-${day}`
}

function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function generateCsvTemplate(entity: ImportEntityType): string {
  const config = ENTITY_CONFIGS[entity]
  const headers = config.fields.map((f) => f.name).join(',')
  const example = config.fields.map((f) => escapeCsvValue(templateExample(f))).join(',')
  return `${headers}\n${example}`
}

export function generateJsonTemplate(entity: ImportEntityType): string {
  const config = ENTITY_CONFIGS[entity]
  const example: Record<string, any> = {}
  config.fields.forEach((f) => {
    if (f.type === 'number') {
      example[f.name] = Number(templateExample(f)) || 100
    } else {
      example[f.name] =
        f.type === 'date'
          ? convertDateToISO(templateExample(f)) || templateExample(f)
          : templateExample(f)
    }
  })
  return JSON.stringify([example], null, 2)
}

export function getFieldList(
  entity: ImportEntityType,
): { name: string; label: string; required: boolean }[] {
  // Note: date fields in CSV templates use DD-MM-AAAA format
  // and are converted to YYYY-MM-DD during import processing
  return ENTITY_CONFIGS[entity].fields.map((f) => ({
    name: f.name,
    label: f.label || f.name,
    required: f.required,
  }))
}
