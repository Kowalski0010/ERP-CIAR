import { CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ScheduleMaintenance() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-zinc-400" />
          Manutenção de Horários
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Cadastro e ajustes de grades de horários e alocação física das turmas.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
          <CardTitle className="text-lg">Grades Ativas</CardTitle>
          <CardDescription className="text-xs">Visualização e edição.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/80">
              <TableRow>
                <TableHead>Curso / Disciplina</TableHead>
                <TableHead>Dias da Semana</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Sala/Laboratório</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                  Nenhuma grade configurada.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
