import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { ClipboardList, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function StudentAttendance() {
  const { attendances, students } = useAppStore()
  const student = students[0]
  const myAttendances = attendances.filter((a) => a.studentId === student.id)

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-zinc-400" />
          Frequência e Faltas
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Acompanhe seu percentual de presença nas disciplinas. (Mínimo exigido: 75%)
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead>Disciplina</TableHead>
                <TableHead className="text-center w-[100px]">Carga (h)</TableHead>
                <TableHead className="text-center w-[100px]">Faltas</TableHead>
                <TableHead className="w-[200px]">Percentual</TableHead>
                <TableHead className="w-[120px]">Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myAttendances.map((a) => {
                const perc = ((a.totalClasses - a.absences) / a.totalClasses) * 100
                const isWarning = perc < 80
                const isDanger = perc < 75

                return (
                  <TableRow key={a.id} className="hover:bg-zinc-50/50">
                    <TableCell className="font-medium text-zinc-900">{a.subject}</TableCell>
                    <TableCell className="text-center text-zinc-500 text-xs">
                      {a.totalClasses}h
                    </TableCell>
                    <TableCell className="text-center text-zinc-900 font-bold">
                      {a.absences}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={perc}
                          className={`h-2 flex-1 ${isDanger ? '[&>div]:bg-rose-500' : isWarning ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                        />
                        <span className="text-xs font-mono w-10 text-right">
                          {perc.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isDanger
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : isWarning
                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        }
                      >
                        {isDanger ? 'Reprovado' : isWarning ? 'Atenção' : 'Regular'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <p>
          As faltas são atualizadas pelos professores em até 48 horas úteis após a realização da
          aula. Em caso de divergências, procure a secretaria.
        </p>
      </div>
    </div>
  )
}
