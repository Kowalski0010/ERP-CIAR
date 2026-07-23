import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  UploadCloud,
  Database,
  CheckCircle2,
  AlertCircle,
  Download,
  Info,
  FileSpreadsheet,
} from 'lucide-react'
import {
  ENTITY_CONFIGS,
  generateCsvTemplate,
  generateJsonTemplate,
  getFieldList,
  type ImportEntityType,
} from '@/services/data-import'
import { processImport, type ImportResult } from '@/services/data-import-processor'

export default function AdminDataImport() {
  const { toast } = useToast()
  const [importType, setImportType] = useState<ImportEntityType>('students')
  const [templateFormat, setTemplateFormat] = useState<'csv' | 'json'>('csv')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [results, setResults] = useState<ImportResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setStatus('idle')
      setResults(null)
    }
  }

  const handleImport = () => {
    if (!file) return
    setStatus('processing')
    setProgress({ current: 0, total: 0 })
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const result = await processImport(content, file.name, importType, (c, t) =>
          setProgress({ current: c, total: t }),
        )
        setResults(result)
        setStatus('done')
        toast({
          title: 'Importação Finalizada',
          description: `${result.success} importados, ${result.errors} com erro.`,
        })
      } catch (error) {
        setResults({ success: 0, errors: 1, rowErrors: [{ row: 0, message: String(error) }] })
        setStatus('done')
        toast({
          title: 'Erro na Importação',
          description: 'Falha ao processar arquivo.',
          variant: 'destructive',
        })
      }
    }
    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) reader.readAsText(file)
    else {
      setStatus('done')
      toast({
        title: 'Erro',
        description: 'Formato inválido. Use CSV ou JSON.',
        variant: 'destructive',
      })
    }
  }

  const getTemplateUrl = () => {
    const content =
      templateFormat === 'csv' ? generateCsvTemplate(importType) : generateJsonTemplate(importType)
    const mime = templateFormat === 'csv' ? 'text/csv' : 'application/json'
    return `data:${mime};charset=utf-8,${encodeURIComponent(content)}`
  }

  const entityOptions = Object.entries(ENTITY_CONFIGS) as [ImportEntityType, { label: string }][]
  const fieldList = getFieldList(importType)
  const showStudentInstructions = importType === 'students'

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Database className="h-7 w-7 text-zinc-400" /> Importação em Massa
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Ferramenta para upload de dados (CSV/JSON) direto para o banco de dados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base text-zinc-800">Parâmetros de Importação</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Entidade de Destino</label>
              <Select
                value={importType}
                onValueChange={(v) => setImportType(v as ImportEntityType)}
              >
                <SelectTrigger className="bg-zinc-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entityOptions.map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Formato do Template</label>
              <Select
                value={templateFormat}
                onValueChange={(v) => setTemplateFormat(v as 'csv' | 'json')}
              >
                <SelectTrigger className="bg-zinc-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Arquivo de Dados</label>
              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".csv,.json"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <UploadCloud className="h-8 w-8 text-blue-500 mb-2" />
                {file ? (
                  <p className="text-sm font-bold text-zinc-900">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-zinc-900">
                      Arraste ou clique para enviar
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">Formatos: .csv ou .json</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <a
                href={getTemplateUrl()}
                download={`template_${importType}.${templateFormat}`}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Template ({templateFormat.toUpperCase()}
                )
              </a>
              <Button
                onClick={handleImport}
                disabled={!file || status === 'processing'}
                className="shadow-sm"
              >
                {status === 'processing' ? 'Processando...' : 'Iniciar Importação'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200 text-blue-900">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs">
              O processo grava diretamente no Supabase. Dados inválidos serão rejeitados. Relações
              (FK) são validadas antes da importação. Registros duplicados são ignorados.
            </AlertDescription>
          </Alert>

          {showStudentInstructions && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <AlertDescription className="text-xs">
                O arquivo CSV deve usar vírgula como separador. Cada campo deve estar em uma coluna
                separada, nunca dentro de uma única célula.
              </AlertDescription>
            </Alert>
          )}

          {status === 'processing' && progress.total > 0 && (
            <Card className="border-zinc-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-zinc-700 mb-2">
                  Importando... {progress.current}/{progress.total}
                </p>
                <Progress value={(progress.current / progress.total) * 100} className="h-2" />
              </CardContent>
            </Card>
          )}

          {status === 'done' && results && (
            <Card className="border-zinc-200 shadow-sm bg-white animate-fade-in">
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-3">
                <CardTitle className="text-sm font-semibold text-zinc-800">
                  Sumário da Operação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {results.warning && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-amber-800">{results.warning}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-700">{results.success}</p>
                    <p className="text-xs text-emerald-600 uppercase font-semibold mt-1">
                      Importados
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-rose-700">{results.errors}</p>
                    <p className="text-xs text-rose-600 uppercase font-semibold mt-1">Com Erro</p>
                  </div>
                </div>
                {results.rowErrors.length > 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-4" size="sm">
                        Ver Detalhes dos Erros ({results.rowErrors.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[400px] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalhes dos Erros</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {results.rowErrors.map((err, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-2 bg-rose-50 rounded text-sm"
                          >
                            <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                            <span className="text-rose-800">{err.message}</span>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showStudentInstructions && (
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base text-zinc-800 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Instruções para Importação de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 uppercase">Formato do Arquivo</h4>
              <ul className="text-xs text-zinc-600 space-y-1.5 list-disc list-inside">
                <li>
                  Cada campo deve estar em uma <strong>coluna separada</strong> (célula), nunca
                  combinado em uma única célula.
                </li>
                <li>
                  As colunas são separadas por <strong>vírgula (`,`)</strong>.
                </li>
                <li>Campos opcionais podem ser deixados vazios.</li>
                <li>
                  Datas devem estar no formato <strong>DD-MM-AAAA</strong> ou{' '}
                  <strong>DD/MM/AAAA</strong> (ex: 15-03-1990 ou 15/03/1990). Ambos os separadores
                  são aceitos.
                </li>
                <li>
                  A linha de cabeçalho deve corresponder <strong>exatamente</strong> aos nomes das
                  colunas listados abaixo (sensível a maiúsculas/minúsculas).
                </li>
                <li>
                  Colunas extras no arquivo serão <strong>ignoradas</strong>.
                </li>
                <li>
                  O campo <strong>`name`</strong> (Nome) é <strong>obrigatório</strong>. Linhas sem
                  esse campo serão rejeitadas.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 uppercase flex items-center gap-1.5">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Instruções para Excel
              </h4>
              <ul className="text-xs text-zinc-600 space-y-1.5 list-disc list-inside">
                <li>
                  Ao salvar como CSV no Excel, use a opção{' '}
                  <strong>"CSV (separado por vírgulas)"</strong>.
                </li>
                <li>
                  Se o Excel estiver em português, o padrão pode usar{' '}
                  <strong>ponto e vírgula (;)</strong>; substitua por vírgulas ou use a opção
                  correta de exportação.
                </li>
                <li>
                  Após salvar, abra o arquivo em um editor de texto (Bloco de Notas) para confirmar
                  que as vírgulas estão corretas.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 uppercase">Duplicatas</h4>
              <p className="text-xs text-zinc-600">
                Registros duplicados são detectados por <strong>`registration_code`</strong>{' '}
                (prioridade) ou <strong>`cpf`</strong> (se `registration_code` estiver vazio).
                Registros duplicados serão <strong>ignorados</strong> com um aviso.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 uppercase">
                Colunas Esperadas ({fieldList.length} campos)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {fieldList.map((field, idx) => (
                  <Badge
                    key={field.name}
                    variant={field.required ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {idx + 1}. {field.name}
                    {field.required && <span className="ml-1 text-red-300">*</span>}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-zinc-400 mt-1">* Campos obrigatórios</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
