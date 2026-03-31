import { useState } from 'react'
import { CalendarDays, Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

export default function ScheduleMaintenance() {
  const { toast } = useToast()
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      course: 'Engenharia de Software',
      subject: 'Cálculo I',
      days: 'Seg, Qua',
      time: '19:00 - 20:40',
      room: 'Sala 101',
    },
    {
      id: 2,
      course: 'Administração',
      subject: 'Teoria Geral',
      days: 'Ter, Qui',
      time: '20:50 - 22:30',
      room: 'Sala 204',
    },
    {
      id: 3,
      course: 'Direito',
      subject: 'Direito Civil',
      days: 'Sex',
      time: '19:00 - 22:30',
      room: 'Auditório',
    },
  ])

  const handleDelete = (id: number) => {
    setSchedules(schedules.filter((s) => s.id !== id))
    toast({ title: 'Grade removida', description: 'O horário foi removido com sucesso.' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-zinc-400" />
            Manutenção de Horários
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Cadastro e ajustes de grades de horários e alocação física das turmas.
          </p>
        </div>
        <Button
          onClick={() =>
            toast({ title: 'Novo Horário', description: 'Abrindo painel de criação de grade...' })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Grade
        </Button>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <p className="font-medium text-zinc-900">{schedule.subject}</p>
                    <p className="text-xs text-zinc-500">{schedule.course}</p>
                  </TableCell>
                  <TableCell>{schedule.days}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{schedule.room}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toast({
                          title: 'Editar Horário',
                          description: 'Carregando formulário de edição...',
                        })
                      }
                    >
                      <Edit className="h-4 w-4 text-zinc-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(schedule.id)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                    Nenhuma grade configurada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
