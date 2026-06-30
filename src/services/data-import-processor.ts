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
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}/

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = values[i]?.trim() ?? ''
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
    if (field.required && (!value || value === '')) {
      return `Row ${rowNum}: Missing required field "${field.name}"`
    }
    if (value && value !== '') {
      if (field.type === 'uuid' && !UUID_REGEX.test(value))
        return `Row ${rowNum}: Invalid UUID for "${field.name}"`
      if (field.type === 'date' && !DATE_REGEX.test(value))
        return `Row ${rowNum}: Invalid date for "${field.name}" (expected YYYY-MM-DD)`
      if (field.type === 'number' && isNaN(Number(value)))
        return `Row ${rowNum}: Invalid number for "${field.name}"`
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
    mapped[field.name] = field.type === 'number' ? Number(value) : value
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
      .map((r) => ({ id: r.row[fk.field], idx: r.originalIndex }))
      .filter((x) => x.id && x.id !== '')
    if (items.length === 0) continue
    const uniqueIds = [...new Set(items.map((x) => x.id))]
    const { data } = await supabase.from(fk.table).select('id').in('id', uniqueIds)
    const existing = new Set(data?.map((r: any) => r.id) || [])
    for (const { id, idx } of items) {
      if (!existing.has(id))
        errors.set(idx + 1, `Row ${idx + 1}: ${fk.field} "${id}" not found in ${fk.table}`)
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
  const records = filename.endsWith('.json') ? JSON.parse(content) : parseCsv(content)
  const result: ImportResult = { success: 0, errors: 0, rowErrors: [] }
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
  const toImport: Record<string, any>[] = []
  valid.forEach((v) => {
    if (fkErrors.has(v.originalIndex + 1)) {
      result.errors++
      result.rowErrors.push({
        row: v.originalIndex + 1,
        message: fkErrors.get(v.originalIndex + 1)!,
      })
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
      result.rowErrors.push({ row: i + 1, message: `Batch error: ${error.message}` })
    } else {
      result.success += batch.length
    }
    onProgress?.(Math.min(i + BATCH, toImport.length), toImport.length)
  }
  return result
}
