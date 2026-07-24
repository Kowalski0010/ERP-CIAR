export const STUDENT_STATUSES = [
  'Ativo',
  'Inativo',
  'Cancelado',
  'Desistente',
  'Inadimplente',
  'Transferido',
  'Reativado',
] as const

export const STATUS_STYLES: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Inativo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Desistente: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Inadimplente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Transferido: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Reativado: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  Formado: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

export const getStatusStyle = (status?: string): string =>
  STATUS_STYLES[status || ''] || STATUS_STYLES.Inativo
