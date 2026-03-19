import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Schedule, ClassRoom, Teacher } from '@/lib/types'
import { FormEvent } from 'react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  classes: ClassRoom[]
  teachers: Teacher[]
  onSubmit: (schedule: Schedule) => void
}

export function AddScheduleDialog({ open, onOpenChange, classes, teachers, onSubmit }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const schedule: Schedule = {
      id: Math.random().toString(36).substr(2, 9),
      classId: fd.get('classId') as string,
      teacherId: fd.get('teacherId') as string,
      subject: fd.get('subject') as string,
      room: fd.get('room') as string,
      dayOfWeek: fd.get('dayOfWeek') as string,
      startTime: fd.get('startTime') as string,
      endTime: fd.get('endTime') as string,
    }
    onSubmit(schedule)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Aula (Cronograma)</DialogTitle>
        </DialogHeader>
        <form id="schedule-form" onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Turma</Label>
              <Select name="classId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
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
            <div className="space-y-1">
              <Label>Professor</Label>
              <Select name="teacherId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Disciplina</Label>
              <Input name="subject" required />
            </div>
            <div className="space-y-1">
              <Label>Sala/Local</Label>
              <Input name="room" required />
            </div>
            <div className="space-y-1">
              <Label>Dia da Semana</Label>
              <Select name="dayOfWeek" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Início / Fim</Label>
              <div className="flex gap-2">
                <Input name="startTime" type="time" required />
                <Input name="endTime" type="time" required />
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="schedule-form">
            Salvar Aula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
