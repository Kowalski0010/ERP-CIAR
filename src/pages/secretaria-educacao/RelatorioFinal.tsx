import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileSpreadsheet, Download } from 'lucide-react'

export default function RelatorioFinal() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Relatório Final</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Consolidação de notas, frequência e situação final de conclusão letiva.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm h-10 px-4 text-xs font-semibold">
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
          <CardTitle className="text-base text-zinc-900">
            Geração de Atas e Relatórios de Fechamento
          </CardTitle>
          <CardDescription className="text-xs">
            Selecione os parâmetros acadêmicos para processar o relatório final consolidado.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Ano Letivo / Semestre</label>
              <Select>
                <SelectTrigger className="h-10 text-sm bg-zinc-50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026-1">2026.1</SelectItem>
                  <SelectItem value="2025-2">2025.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Curso</label>
              <Select>
                <SelectTrigger className="h-10 text-sm bg-zinc-50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">Engenharia de Software</SelectItem>
                  <SelectItem value="dir">Direito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Turma</label>
              <Select>
                <SelectTrigger className="h-10 text-sm bg-zinc-50">
                  <SelectValue placeholder="Opcional..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t1">Turma A - Noturno</SelectItem>
                  <SelectItem value="t2">Turma B - Matutino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full sm:w-auto h-10 shadow-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800">
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-400" />
            Processar Base de Dados
          </Button>

          <div className="pt-6 border-t border-zinc-200">
            <h3 className="text-sm font-bold text-zinc-900 mb-4">
              Pré-visualização do Relatório Consolidado
            </h3>
            <div className="border border-zinc-200 rounded-md bg-white overflow-x-auto shadow-sm">
              <Table className="table-compact min-w-[600px]">
                <TableHeader className="bg-zinc-50/80">
                  <TableRow>
                    <TableHead className="w-[120px]">Matrícula</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead className="text-center w-[120px]">Média Global</TableHead>
                    <TableHead className="text-center w-[120px]">% Frequência</TableHead>
                    <TableHead className="w-[140px]">Situação Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-zinc-50">
                    <TableCell className="font-mono text-xs text-zinc-500">2023101</TableCell>
                    <TableCell className="font-semibold text-zinc-900 text-sm">
                      João Silva Martins
                    </TableCell>
                    <TableCell className="text-center font-bold text-zinc-900">8.5</TableCell>
                    <TableCell className="text-center font-medium">92%</TableCell>
                    <TableCell className="text-emerald-600 font-bold text-xs">Aprovado</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-zinc-50">
                    <TableCell className="font-mono text-xs text-zinc-500">2023102</TableCell>
                    <TableCell className="font-semibold text-zinc-900 text-sm">
                      Maria Fernanda Souza
                    </TableCell>
                    <TableCell className="text-center font-bold text-zinc-900">4.2</TableCell>
                    <TableCell className="text-center font-medium">65%</TableCell>
                    <TableCell className="text-rose-600 font-bold text-xs">Reprovado</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-zinc-50">
                    <TableCell className="font-mono text-xs text-zinc-500">2023103</TableCell>
                    <TableCell className="font-semibold text-zinc-900 text-sm">
                      Carlos Eduardo Lima
                    </TableCell>
                    <TableCell className="text-center font-bold text-zinc-900">6.0</TableCell>
                    <TableCell className="text-center font-medium">88%</TableCell>
                    <TableCell className="text-amber-600 font-bold text-xs">Exame Final</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
