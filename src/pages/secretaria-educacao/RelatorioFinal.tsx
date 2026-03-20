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
import { FileSpreadsheet } from 'lucide-react'

export default function RelatorioFinal() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatório Final</h1>
        <p className="text-muted-foreground">
          Consolidação de notas, frequência e situação final de conclusão letiva.
        </p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Geração de Atas e Relatórios de Fechamento</CardTitle>
          <CardDescription>
            Selecione os parâmetros acadêmicos para processar o relatório final consolidado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Letivo / Semestre</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026-1">2026.1</SelectItem>
                  <SelectItem value="2025-2">2025.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Curso</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">Engenharia de Software</SelectItem>
                  <SelectItem value="dir">Direito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Turma</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Opcional..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t1">Turma A - Noturno</SelectItem>
                  <SelectItem value="t2">Turma B - Matutino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Processar e Gerar Relatório
          </Button>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Pré-visualização do Relatório Consolidado</h3>
            <div className="border rounded-md bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead className="text-right">Média Global</TableHead>
                    <TableHead className="text-right">% Frequência</TableHead>
                    <TableHead>Situação Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023101</TableCell>
                    <TableCell>João Silva Martins</TableCell>
                    <TableCell className="text-right font-medium">8.5</TableCell>
                    <TableCell className="text-right">92%</TableCell>
                    <TableCell className="text-green-600 font-medium">Aprovado</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023102</TableCell>
                    <TableCell>Maria Fernanda Souza</TableCell>
                    <TableCell className="text-right font-medium">4.2</TableCell>
                    <TableCell className="text-right">65%</TableCell>
                    <TableCell className="text-red-600 font-medium">Reprovado</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023103</TableCell>
                    <TableCell>Carlos Eduardo Lima</TableCell>
                    <TableCell className="text-right font-medium">6.0</TableCell>
                    <TableCell className="text-right">88%</TableCell>
                    <TableCell className="text-yellow-600 font-medium">Exame Final</TableCell>
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
