import { supabase } from '@/lib/supabase/client'
import { ENTITY_CONFIGS, type ImportEntityType } from './data-import'

export interface RowError {
  row: number
  message: string
}

export interface ImportResult {
  success: number
  errors: number
  rowErrors: RowError[]
  warning?: string | null
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CPF_REGEX = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/

function convertDateToISO(value: string): string | null {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/)
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

function detectDelimiter(firstLine: string): string {
  const commas = (firstLine.match(/,/g) || []).length
  const semicolons = (firstLine.match(/;/g) || []).length
  return semicolons > commas ? ';' : ','
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result.map((v) => v.trim())
}

function parseCsv(content: string): Record<string, string>[] {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []
  const delimiter = detectDelimiter(lines[0])
  const headers = parseCsvLine(lines[0], delimiter)
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line, delimiter)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? ''
    })
    return obj
  })
}

function validateRow(
  row: Record<string, any>,
  rowNum: number,
  entity: ImportEntityType,
): string | null {
  const config = ENTITY_CONFIGS[entity]
  for (const field of config.fields) {
    const value = row[field.name]
    const label = field.label || field.name
    if (field.required && (!value || value === '')) {
      return `Linha ${rowNum}: campo '${field.name}' obrigatório ausente`
    }
    if (value && value !== '') {
      if (field.type === 'uuid' && !UUID_REGEX.test(value))
        return `Linha ${rowNum}: UUID inválido para "${field.name}"`
      if (field.type === 'date' && !DATE_REGEX.test(value))
        return `Linha ${rowNum}: Data inválida para "${label}" (formato esperado: DD-MM-AAAA, ex: 15-03-1990). Valor recebido: "${value}"`
      if (field.type === 'date' && !convertDateToISO(value))
        return `Linha ${rowNum}: Data fora do intervalo válido para "${label}". Valor recebido: "${value}"`
      if (field.type === 'number' && isNaN(Number(value)))
        return `Linha ${rowNum}: Número inválido para "${field.name}"`
      if (field.validation === 'email' && !EMAIL_REGEX.test(value))
        return `Linha ${rowNum}: E-mail inválido para "${label}": "${value}"`
      if (field.validation === 'cpf' && !CPF_REGEX.test(value))
        return `Linha ${rowNum}: CPF inválido para "${label}": "${value}"`
    }
  }
  return null
}

function mapRow(row: Record<string, any>, entity: ImportEntityType): Record<string, any> {
  const config = ENTITY_CONFIGS[entity]
  const mapped: Record<string, any> = { ...(config.defaultValues || {}) }
  if (row.id && row.id !== '') mapped.id = row.id
  for (const field of config.fields) {
    const value = row[field.name]
    if (value === undefined || value === '') continue
    if (field.type === 'date') {
      const isoDate = convertDateToISO(value)
      if (isoDate) mapped[field.name] = isoDate
    } else {
      mapped[field.name] = field.type === 'number' ? Number(value) : value
    }
  }
  return mapped
}

async function validateForeignKeys(
  entity: ImportEntityType,
  records: { row: Record<string, any>; originalIndex: number }[],
): Promise<Map<number, string>> {
  const config = ENTITY_CONFIGS[entity]
  const errors = new Map<number, string>()
  if (!config.fkValidations) return errors
  for (const fk of config.fkValidations) {
    const items = records
      .filter((r) => !errors.has(r.originalIndex + 1))
      .map((r) => ({ id: r.row[fk.field], idx: r.originalIndex }))
      .filter((x) => x.id && x.id !== '')
    if (items.length === 0) continue
    const uniqueIds = [...new Set(items.map((x) => x.id))]
    const { data } = await supabase.from(fk.table).select('id').in('id', uniqueIds)
    const existing = new Set(data?.map((r: any) => r.id) || [])
    for (const { id, idx } of items) {
      if (!existing.has(id))
        errors.set(idx + 1, `Linha ${idx + 1}: ${fk.field} "${id}" não encontrado em ${fk.table}`)
    }
  }
  return errors
}

async function detectDuplicates(
  entity: ImportEntityType,
  records: { row: Record<string, any>; originalIndex: number }[],
): Promise<Map<number, string>> {
  const config = ENTITY_CONFIGS[entity]
  const errors = new Map<number, string>()
  if (!config.duplicateFields) return errors

  for (const field of config.duplicateFields) {
    const seenInFile = new Map<string, number>()
    for (const { row, originalIndex } of records) {
      if (errors.has(originalIndex + 1)) continue
      const value = row[field]
      if (!value || value === '') continue
      if (seenInFile.has(value)) {
        errors.set(
          originalIndex + 1,
          `Linha ${originalIndex + 1}: Registro duplicado no arquivo - "${field}" "${value}" já aparece na linha ${seenInFile.get(value)! + 1}`,
        )
      } else {
        seenInFile.set(value, originalIndex)
      }
    }
    const items = records
      .filter((r) => !errors.has(r.originalIndex + 1))
      .map((r) => ({ value: r.row[field], idx: r.originalIndex }))
      .filter((x) => x.value && x.value !== '')
    if (items.length === 0) continue
    const uniqueValues = [...new Set(items.map((x) => x.value))]
    const { data } = await supabase.from(config.table).select(field).in(field, uniqueValues)
    const existing = new Set(data?.map((r: any) => r[field]).filter(Boolean) || [])
    for (const { value, idx } of items) {
      if (existing.has(value) && !errors.has(idx + 1)) {
        errors.set(
          idx + 1,
          `Linha ${idx + 1}: Registro duplicado - "${field}" "${value}" já existe no banco de dados`,
        )
      }
    }
  }
  return errors
}

export async function processImport(
  content: string,
  filename: string,
  entity: ImportEntityType,
  onProgress?: (current: number, total: number) => void,
): Promise<ImportResult> {
  const result: ImportResult = { success: 0, errors: 0, rowErrors: [], warning: null }

  let records: Record<string, any>[]
  if (filename.endsWith('.json')) {
    records = JSON.parse(content)
  } else {
    const firstLine = content.split('\n')[0] || ''
    if (detectDelimiter(firstLine) === ';') {
      result.warning =
        'O arquivo CSV usa ponto e vírgula (;) como separador. Foi convertido automaticamente, mas recomenda-se usar vírgula (,) nas próximas importações.'
    }
    records = parseCsv(content)
  }

  if (!records.length) {
    result.errors = 1
    result.rowErrors.push({ row: 0, message: 'Arquivo vazio ou sem dados' })
    return result
  }

  const valid: { row: Record<string, any>; originalIndex: number }[] = []
  records.forEach((record, i) => {
    const error = validateRow(record, i + 1, entity)
    if (error) {
      result.errors++
      result.rowErrors.push({ row: i + 1, message: error })
    } else {
      valid.push({ row: record, originalIndex: i })
    }
  })
  if (!valid.length) return result

  const fkErrors = await validateForeignKeys(entity, valid)
  const dupErrors = await detectDuplicates(entity, valid)
  const toImport: Record<string, any>[] = []
  valid.forEach((v) => {
    const rowErr = fkErrors.get(v.originalIndex + 1) || dupErrors.get(v.originalIndex + 1)
    if (rowErr) {
      result.errors++
      result.rowErrors.push({ row: v.originalIndex + 1, message: rowErr })
    } else {
      toImport.push(mapRow(v.row, entity))
    }
  })
  if (!toImport.length) return result

  const config = ENTITY_CONFIGS[entity]
  const BATCH = 100
  for (let i = 0; i < toImport.length; i += BATCH) {
    const batch = toImport.slice(i, i + BATCH)
    const { error } = await supabase
      .from(config.table)
      .upsert(batch, { onConflict: 'id', ignoreDuplicates: true })
    if (error) {
      result.errors += batch.length
      result.rowErrors.push({ row: i + 1, message: `Erro em lote: ${error.message}` })
    } else {
      result.success += batch.length
    }
    onProgress?.(Math.min(i + BATCH, toImport.length), toImport.length)
  }
  return result
}
