import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Plus, Calendar as CalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddScheduleDialog } from '@/components/AddScheduleDialog'
import { useToast } from '@/hooks/use-toast'

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function Schedules() {
  const { schedules, classes, teachers, addSchedule } = useAppStore()
  const { toast } = useToast()
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || '')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const classSchedules = schedules.filter((s) => s.classId === selectedClass)
  const getTeacherName = (id: string) => teachers.find((t) => t.id === id)?.name || 'N/A'

  const handleAdd = (slot: any) => {
    try {
      addSchedule(slot)
      toast({ title: 'Sucesso', description: 'Aula adicionada ao cronograma.' })
      setIsAddOpen(false)
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Conflito de Horário', description: error.message })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cronogramas (Horários)</h1>
          <p className="text-muted-foreground">
            Gerencie a alocação de turmas, salas e professores.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Aula
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 border rounded-xl shadow-subtle">
        <label className="text-sm font-semibold">Visualizar Turma:</label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => {
          const daySlots = classSchedules
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
          if (daySlots.length === 0) return null

          return (
            <Card key={day} className="shadow-subtle border-border">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalIcon className="w-5 h-5 text-primary" /> {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className="p-4 hover:bg-muted/10 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground border px-2 rounded-full">
                          {slot.room}
                        </span>
                      </div>
                      <p className="font-semibold text-foreground mt-2">{slot.subject}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Prof. {getTeacherName(slot.teacherId)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AddScheduleDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        classes={classes}
        teachers={teachers}
        onSubmit={handleAdd}
      />
    </div>
  )
}
