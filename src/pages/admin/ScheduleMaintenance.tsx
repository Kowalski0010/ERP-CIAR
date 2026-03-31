import { useState, useEffect } from 'react'
import { CalendarDays, Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ScheduleMaintenance() {
  const { toast } = useToast()
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({
    course: '',
    subject: '',
    days: '',
    time: '',
    room: '',
  })

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        setSchedules(data)
      } else {
        setSchedules([
          {
            id: '1',
            course: 'Engenharia',
            subject: 'Cálculo I',
            days: 'Seg, Qua',
            time: '19:00 - 20:40',
            room: 'Sala 101',
          },
        ])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('schedules').delete().eq('id', id)
      setSchedules(schedules.filter((s) => s.id !== id))
      toast({ title: 'Grade removida', description: 'O horário foi removido com sucesso.' })
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível remover.' })
    }
  }

  const handleSave = async () => {
    try {
      if (editing?.id) {
        const { data, error } = await supabase
          .from('schedules')
          .update(formData)
          .eq('id', editing.id)
          .select()
          .single()
        if (error) throw error
        setSchedules(schedules.map((s) => (s.id === editing.id ? data : s)))
        toast({ title: 'Sucesso', description: 'Horário atualizado.' })
      } else {
        const { data, error } = await supabase
          .from('schedules')
          .insert([formData])
          .select()
          .single()
        if (error) throw error
        setSchedules([data, ...schedules])
        toast({ title: 'Sucesso', description: 'Horário criado.' })
      }
      setOpen(false)
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao salvar no banco.' })
    }
  }

  const openForm = (sched?: any) => {
    setEditing(sched || null)
    if (sched) {
      setFormData({
        course: sched.course,
        subject: sched.subject,
        days: sched.days,
        time: sched.time,
        room: sched.room,
      })
    } else {
      setFormData({ course: '', subject: '', days: '', time: '', room: '' })
    }
    setOpen(true)
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
            Cadastro e ajustes de grades de horários salvos diretamente no banco.
          </p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-2" /> Nova Grade
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
                <TableHead>Sala</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <p className="font-medium text-zinc-900">{schedule.subject}</p>
                      <p className="text-xs text-zinc-500">{schedule.course}</p>
                    </TableCell>
                    <TableCell>{schedule.days}</TableCell>
                    <TableCell>{schedule.time}</TableCell>
                    <TableCell>{schedule.room}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openForm(schedule)}>
                        <Edit className="h-4 w-4 text-zinc-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(schedule.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && schedules.length === 0 && (
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Grade' : 'Nova Grade'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Curso</label>
              <Input
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="Ex: Engenharia"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Disciplina</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Cálculo I"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Dias</label>
              <Input
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                placeholder="Ex: Seg, Qua"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Horário</label>
              <Input
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="Ex: 19:00 - 20:40"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sala</label>
              <Input
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="Ex: Sala 101"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
