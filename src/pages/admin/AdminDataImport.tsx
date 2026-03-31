import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { UploadCloud, FileSpreadsheet, Database, CheckCircle2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase/client'

export default function AdminDataImport() {
  const { toast } = useToast()

  const [importType, setImportType] = useState<'students' | 'classes' | 'teachers'>('students')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle')
  const [results, setResults] = useState<{ success: number; errors: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setStatus('idle')
      setResults(null)
    }
  }

  const handleImport = () => {
    if (!file) return
    setStatus('processing')

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        let records: any[] = []

        if (file.name.endsWith('.json')) {
          records = JSON.parse(content)
        } else {
          const lines = content.split('\n').filter((l) => l.trim())
          if (lines.length > 1) {
            const headers = lines[0].split(',')
            records = lines.slice(1).map((line) => {
              const values = line.split(',')
              const obj: any = {}
              headers.forEach((h, i) => {
                obj[h.trim()] = values[i]?.trim()
              })
              return obj
            })
          }
        }

        if (records.length > 0) {
          let errorCount = 0
          let successCount = 0

          if (importType === 'students') {
            const mapped = records.map((r) => ({
              name: r.name || 'Sem nome',
              email: r.email || null,
              course: r.course || null,
              phone: r.phone || null,
              status: 'Ativo',
            }))
            const { error } = await supabase.from('students').insert(mapped)
            if (error) throw error
            successCount = mapped.length
          } else if (importType === 'classes') {
            const mapped = records.map((r) => ({
              name: r.name || 'Turma',
              course: r.course || 'Geral',
              semester: r.semester || '2024.1',
              capacity: Number(r.capacity) || 40,
            }))
            const { error } = await supabase.from('classes').insert(mapped)
            if (error) throw error
            successCount = mapped.length
          } else if (importType === 'teachers') {
            const mapped = records.map((r) => ({
              name: r.name || 'Sem nome',
              email: r.email || null,
              subjects: r.subjects || null,
              workload: Number(r.workload) || 40,
              status: 'Ativo',
            }))
            const { error } = await supabase.from('teachers').insert(mapped)
            if (error) console.error(error)
            successCount = mapped.length
          }

          setResults({ success: successCount, errors: errorCount })
          setStatus('done')
          toast({
            title: 'Importação Finalizada',
            description: `${successCount} registros processados no banco de dados.`,
          })
        } else {
          throw new Error('Arquivo vazio')
        }
      } catch (error) {
        console.error(error)
        setResults({ success: 0, errors: 1 })
        setStatus('done')
        toast({
          title: 'Erro na Importação',
          description: 'Falha ao comunicar com o banco de dados.',
          variant: 'destructive',
        })
      }
    }

    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      setStatus('done')
      setResults({ success: 0, errors: 1 })
      toast({
        title: 'Erro',
        description: 'Formato inválido',
        variant: 'destructive',
      })
    }
  }

  const getTemplateUrl = () => {
    if (importType === 'students') {
      return `data:text/csv;charset=utf-8,${encodeURIComponent('name,email,course,phone\nJoão Silva,joao@email.com,Engenharia,11999999999')}`
    }
    if (importType === 'teachers') {
      return `data:text/csv;charset=utf-8,${encodeURIComponent('name,email,subjects,workload\nProf. Carlos,carlos@ies.edu,Cálculo,40')}`
    }
    return `data:text/csv;charset=utf-8,${encodeURIComponent('name,course,semester,capacity\nTurma 101,Engenharia,2024.1,40')}`
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Database className="h-7 w-7 text-zinc-400" />
            Importação em Massa
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Ferramenta utilitária para upload de dados (CSV/JSON) direto para o banco de dados.
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
              <Select value={importType} onValueChange={(v: any) => setImportType(v)}>
                <SelectTrigger className="bg-zinc-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Alunos (Matrículas Ativas)</SelectItem>
                  <SelectItem value="teachers">Corpo Docente</SelectItem>
                  <SelectItem value="classes">Turmas e Grades</SelectItem>
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
                    <p className="text-xs text-zinc-500 mt-1">Formatos aceitos: .csv ou .json</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={getTemplateUrl()}
                download={`template_${importType}.csv`}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Baixar Template Modelo
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
              O processo de importação grava diretamente no Supabase. Utiliza as colunas do template
              fornecido. Dados inconsistentes serão ignorados ou rejeitados.
            </AlertDescription>
          </Alert>

          {status === 'done' && results && (
            <Card className="border-zinc-200 shadow-sm bg-white animate-fade-in">
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-3">
                <CardTitle className="text-sm font-semibold text-zinc-800">
                  Sumário da Operação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
