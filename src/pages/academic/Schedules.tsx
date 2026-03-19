import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Plus, Calendar as CalIcon, Clock, MapPin, User } from 'lucide-react'
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
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quadro de Horários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Planejamento da grade curricular e alocação de docentes.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Alocar Aula
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-sm font-semibold text-foreground whitespace-nowrap">
          Exibir Grade da Turma:
        </label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[350px] bg-background">
            <SelectValue placeholder="Selecione a turma" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.id} - {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {days.map((day) => {
          const daySlots = classSchedules
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))

          return (
            <Card key={day} className="shadow-sm border-border/50 h-full flex flex-col bg-muted/10">
              <CardHeader className="py-3 px-4 bg-card border-b border-border/50">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                  {day}
                  <Badge
                    variant="secondary"
                    className="font-normal text-[10px] px-1.5 h-5 bg-muted"
                  >
                    {daySlots.length} aulas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 flex flex-col gap-2 overflow-y-auto">
                {daySlots.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center min-h-[100px] text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-md">
                    <span className="text-xs font-medium">Livre</span>
                  </div>
                ) : (
                  daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-card p-3 rounded-md border border-border/50 shadow-sm hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="font-mono text-xs font-semibold text-primary">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-foreground mb-2 leading-tight">
                        {slot.subject}
                      </p>

                      <div className="space-y-1 mt-auto pt-2 border-t border-border/50">
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-medium truncate">
                          <User className="w-3 h-3" /> {getTeacherName(slot.teacherId)}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3" /> {slot.room}
                        </p>
                      </div>
                    </div>
                  ))
                )}
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
