import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Plus, Clock, MapPin, User, Filter, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
      toast({ title: 'Sucesso', description: 'Aula alocada com sucesso no cronograma.' })
      setIsAddOpen(false)
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Conflito de Horário', description: error.message })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Quadro de Horários</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerenciamento da grade curricular e alocação de docentes por turma.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="h-9 px-4 text-xs font-medium"
        >
          <Plus className="mr-2 h-3.5 w-3.5" /> Nova Alocação
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm p-3 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
            <Filter className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-3 flex-1 sm:max-w-md">
            <label className="text-xs font-semibold text-zinc-700 whitespace-nowrap hidden sm:block uppercase tracking-wider">
              Filtrar Grade:
            </label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border-zinc-200 focus:ring-zinc-300 transition-colors">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    <span className="font-mono text-zinc-500 mr-2">{c.id}</span>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-start">
        {days.map((day) => {
          const daySlots = classSchedules
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))

          return (
            <Card
              key={day}
              className="shadow-none border-zinc-200 bg-zinc-50/50 rounded-md overflow-hidden flex flex-col min-h-[500px]"
            >
              <CardHeader className="py-2.5 px-3 bg-zinc-100/80 border-b border-zinc-200 sticky top-0 z-10">
                <CardTitle className="text-[12px] font-bold text-zinc-800 uppercase tracking-widest flex items-center justify-between">
                  {day}
                  <Badge
                    variant="secondary"
                    className="bg-white text-zinc-600 border border-zinc-200 text-[10px] px-1.5 py-0 h-4 rounded-sm font-semibold"
                  >
                    {daySlots.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 flex flex-col gap-2 overflow-y-auto">
                {daySlots.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] text-zinc-400 border border-dashed border-zinc-200 rounded-md bg-white/50 gap-2">
                    <LayoutGrid className="w-5 h-5 opacity-20" />
                    <span className="text-[11px] font-medium uppercase tracking-wider opacity-60">
                      Grade Livre
                    </span>
                  </div>
                ) : (
                  daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-white p-3 rounded-md border border-zinc-200 border-l-[3px] border-l-zinc-800 shadow-subtle hover:border-zinc-300 hover:shadow-sm transition-all group flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">
                          <Clock className="w-3 h-3" />
                          <span className="font-mono text-[10px] font-semibold tracking-tight">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      </div>
                      <p className="font-bold text-[13px] text-zinc-900 leading-tight">
                        {slot.subject}
                      </p>

                      <div className="space-y-1.5 mt-1 pt-2 border-t border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-600">
                          <User className="w-3.5 h-3.5 opacity-60" />
                          <span
                            className="text-[11px] font-medium truncate"
                            title={getTeacherName(slot.teacherId)}
                          >
                            {getTeacherName(slot.teacherId)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <MapPin className="w-3.5 h-3.5 opacity-60" />
                          <span className="text-[11px] truncate" title={slot.room}>
                            {slot.room}
                          </span>
                        </div>
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
