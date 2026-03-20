import { useParams, Link } from 'react-router-dom'
import { FileText, Download, FileSpreadsheet, ChevronLeft, Calendar, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function ReportView() {
  const { id } = useParams()
  const { toast } = useToast()
  const title = id
    ? id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Relatório Gerencial'

  const mockData = Array.from({ length: 8 }).map((_, i) => ({
    id: `000${i + 1}`,
    col1: `Dado Analítico ${i + 1}`,
    col2: `Categoria ${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
    col3: Math.floor(Math.random() * 1000).toString(),
    col4: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('pt-BR'),
  }))

  const handleExport = (type: string) => {
    toast({
      title: 'Exportação Iniciada',
      description: `Gerando arquivo ${type} de "${title}"...`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 -ml-1 text-zinc-500" asChild>
              <Link to="/">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 text-[10px]">
              Suite de Relatórios
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-zinc-400" />
            {title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Extração de dados tabulares e analíticos.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="shadow-sm h-9 px-4 text-xs"
            onClick={() => handleExport('Excel')}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Excel
          </Button>
          <Button className="shadow-sm h-9 px-4 text-xs" onClick={() => handleExport('PDF')}>
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-700">
            <Calendar className="h-4 w-4 text-zinc-400" /> Parâmetros de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Período Letivo
            </label>
            <Select defaultValue="atual">
              <SelectTrigger className="bg-zinc-50 text-xs h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atual">Semestre Atual</SelectItem>
                <SelectItem value="anterior">Semestre Anterior</SelectItem>
                <SelectItem value="ano">Ano Letivo Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Curso / Turma
            </label>
            <Select defaultValue="todos">
              <SelectTrigger className="bg-zinc-50 text-xs h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Cursos</SelectItem>
                <SelectItem value="eng">Engenharia</SelectItem>
                <SelectItem value="adm">Administração</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Status Operacional
            </label>
            <Select defaultValue="ativos">
              <SelectTrigger className="bg-zinc-50 text-xs h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativos">Apenas Ativos</SelectItem>
                <SelectItem value="todos">Incluir Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" className="w-full h-9 shadow-sm text-xs font-semibold">
              <Search className="h-4 w-4 mr-2" /> Processar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Código ID</TableHead>
              <TableHead>Informação Principal</TableHead>
              <TableHead className="w-[200px]">Agrupamento / Categoria</TableHead>
              <TableHead className="text-right w-[150px]">Métrica / Valor</TableHead>
              <TableHead className="w-[140px]">Data Reg.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id} className="hover:bg-zinc-50/50 transition-colors">
                <TableCell className="font-mono text-[11px] text-zinc-500 font-medium">
                  {row.id}
                </TableCell>
                <TableCell className="font-semibold text-zinc-900 text-xs">{row.col1}</TableCell>
                <TableCell className="text-xs text-zinc-600">
                  <Badge variant="secondary" className="font-medium bg-zinc-100 px-2 py-0">
                    {row.col2}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-zinc-700">
                  {row.col3}
                </TableCell>
                <TableCell className="text-xs text-zinc-500">{row.col4}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 border-t border-zinc-100 bg-zinc-50 text-xs text-zinc-500 flex justify-between items-center">
          <span>Exibindo 8 registros processados.</span>
          <span className="font-mono">Gerado em: {new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  )
}
