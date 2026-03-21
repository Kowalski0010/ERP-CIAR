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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { FileSpreadsheet, Download, Settings2, Filter, FileText } from 'lucide-react'
import { Label } from '@/components/ui/label'

const SOURCES = {
  students: {
    label: 'Alunos e Matrículas',
    columns: ['ID', 'Nome Completo', 'E-mail', 'CPF', 'Curso', 'Status', 'Data Matrícula'],
  },
  financial: {
    label: 'Financeiro e Pagamentos',
    columns: ['ID Fatura', 'Aluno', 'Valor', 'Vencimento', 'Status', 'Parcela'],
  },
  library: {
    label: 'Biblioteca e Empréstimos',
    columns: ['ID Empréstimo', 'Livro', 'Aluno', 'Retirada', 'Devolução', 'Status'],
  },
}

export default function CustomReports() {
  const { toast } = useToast()
  const [source, setSource] = useState<keyof typeof SOURCES>('students')
  const [selectedCols, setSelectedCols] = useState<string[]>(SOURCES['students'].columns)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleSourceChange = (val: keyof typeof SOURCES) => {
    setSource(val)
    setSelectedCols(SOURCES[val].columns)
    setIsGenerated(false)
  }

  const toggleCol = (col: string) => {
    setSelectedCols((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]))
  }

  const handleGenerate = () => {
    if (selectedCols.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Atenção',
        description: 'Selecione ao menos uma coluna.',
      })
      return
    }
    setIsGenerated(true)
    toast({
      title: 'Relatório Gerado',
      description: 'Prévia disponível. Utilize as opções de exportação.',
    })
  }

  const handleExport = (format: string) => {
    toast({ title: `Exportando ${format}`, description: `O arquivo ${format} está sendo baixado.` })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Settings2 className="h-7 w-7 text-zinc-400" />
            Criador de Relatórios Customizados
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Extraia dados específicos selecionando origem, colunas e filtros.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-3">
              <CardTitle className="text-sm">Configuração de Dados</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-zinc-700">Origem de Dados</Label>
                <Select value={source} onValueChange={(v) => handleSourceChange(v as any)}>
                  <SelectTrigger className="bg-zinc-50 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <Label className="text-xs font-bold text-zinc-700">Colunas Visíveis</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {SOURCES[source].columns.map((col) => (
                    <div key={col} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col}`}
                        checked={selectedCols.includes(col)}
                        onCheckedChange={() => toggleCol(col)}
                      />
                      <label
                        htmlFor={`col-${col}`}
                        className="text-xs font-medium text-zinc-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {col}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <Label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filtro Rápido
                </Label>
                <Select defaultValue="todos">
                  <SelectTrigger className="bg-zinc-50 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Registros</SelectItem>
                    <SelectItem value="ativos">Apenas Ativos/Regulares</SelectItem>
                    <SelectItem value="inativos">Apenas Inativos/Atrasados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} className="w-full shadow-sm text-xs font-semibold">
                Gerar Prévia
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-zinc-200 shadow-sm bg-white h-full flex flex-col">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Pré-visualização do Relatório</CardTitle>
              {isGenerated && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => handleExport('Excel')}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => handleExport('PDF')}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> PDF
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {isGenerated ? (
                <div className="overflow-x-auto">
                  <Table className="table-compact">
                    <TableHeader className="bg-zinc-50/80">
                      <TableRow className="hover:bg-transparent">
                        {selectedCols.map((col) => (
                          <TableHead key={col} className="whitespace-nowrap">
                            {col}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Generates 5 rows of mock data based on selected columns */}
                      {Array.from({ length: 5 }).map((_, rIdx) => (
                        <TableRow key={rIdx} className="hover:bg-zinc-50">
                          {selectedCols.map((col) => (
                            <TableCell
                              key={`${rIdx}-${col}`}
                              className="text-xs text-zinc-600 whitespace-nowrap"
                            >
                              Dado mock para {col}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="p-3 border-t border-zinc-100 text-xs text-zinc-500 text-right">
                    Exibindo prévia de 5 registros de um total simulado de 142.
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-zinc-400">
                  <FileText className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-sm">Configure os parâmetros e clique em "Gerar Prévia".</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
