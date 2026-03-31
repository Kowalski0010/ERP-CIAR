import { FileCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function CourseExemptions() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-zinc-400" />
          Dispensa de Disciplinas
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gestão de aproveitamento de estudos para alunos retornantes de trancamento ou outras IES.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
          <CardTitle className="text-lg">Processos de Dispensa</CardTitle>
          <CardDescription className="text-xs">
            Requerimentos pendentes e deferidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/80">
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Disciplina Alvo</TableHead>
                <TableHead>IES de Origem</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                  Nenhuma dispensa registrada.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
