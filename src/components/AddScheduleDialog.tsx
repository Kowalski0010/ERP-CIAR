import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { ClassRoom, Teacher } from '@/lib/types'

interface AddScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classes: ClassRoom[]
  teachers: Teacher[]
  onSubmit: (data: any) => void
}

export function AddScheduleDialog({
  open,
  onOpenChange,
  classes,
  teachers,
  onSubmit,
}: AddScheduleDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      id: `S${Math.floor(Math.random() * 10000)}`,
      classId: fd.get('classId'),
      subject: fd.get('subject'),
      teacherId: fd.get('teacherId'),
      room: fd.get('room'),
      dayOfWeek: fd.get('dayOfWeek'),
      startTime: fd.get('startTime'),
      endTime: fd.get('endTime'),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Nova Alocação de Horário</DialogTitle>
          <DialogDescription>Adicione uma nova disciplina à grade de uma turma.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Turma</Label>
            <Select name="classId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma..." />
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

          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Input name="subject" required placeholder="Ex: Matemática Aplicada" />
          </div>

          <div className="space-y-2">
            <Label>Professor</Label>
            <Select name="teacherId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o professor..." />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dia da Semana</Label>
              <Select name="dayOfWeek" required>
                <SelectTrigger>
                  <SelectValue placeholder="Dia..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Segunda">Segunda</SelectItem>
                  <SelectItem value="Terça">Terça</SelectItem>
                  <SelectItem value="Quarta">Quarta</SelectItem>
                  <SelectItem value="Quinta">Quinta</SelectItem>
                  <SelectItem value="Sexta">Sexta</SelectItem>
                  <SelectItem value="Sábado">Sábado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sala / Lab</Label>
              <Input name="room" required placeholder="Ex: Sala 101" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horário Inicial</Label>
              <Input type="time" name="startTime" required />
            </div>
            <div className="space-y-2">
              <Label>Horário Final</Label>
              <Input type="time" name="endTime" required />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Horário</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
