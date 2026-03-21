import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { CalendarDays, Plus, Clock, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function AcrAgenda() {
  const { acrAppointments, acrPatients, addAcrAppointment } = useAppStore()
  const { toast } = useToast()

  const [view, setView] = useState<'month' | 'week' | 'day'>('week')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [sendReminder, setSendReminder] = useState(true)

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedPatientId) return

    const patient = acrPatients.find((p) => p.id === selectedPatientId)
    const fd = new FormData(e.currentTarget)

    if (patient) {
      addAcrAppointment({
        patientId: patient.id,
        patientName: patient.name,
        date: `${fd.get('date')}T${fd.get('time')}`,
        value: Number(fd.get('value')),
        paymentMethod: fd.get('paymentMethod') as string,
        status: 'Agendado',
        analysisType: fd.get('analysisType') as string,
      })

      toast({
        title: 'Sessão Agendada',
        description: sendReminder
          ? 'Notificação de lembrete enviada ao paciente.'
          : 'Horário reservado com sucesso.',
      })
      setIsAddOpen(false)
      setSelectedPatientId('')
    }
  }

  // Simplified Mock Calendar rendering logic for "Week" view
  const hours = Array.from({ length: 11 }, (_, i) => i + 8) // 8 to 18
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']

  const getAppointmentsForSlot = (dayIdx: number, hour: number) => {
    return acrAppointments.filter((app) => {
      const d = new Date(app.date)
      // Mock logic mapping days. Using simple modulo to place them randomly across the week for preview
      const appDay = d.getDay() === 0 ? 1 : d.getDay()
      return appDay === dayIdx + 1 && d.getHours() === hour
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-zinc-400" />
            Agenda e Sessões
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerencie horários, envie lembretes e integre pagamentos.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex bg-zinc-100 p-1 rounded-md border border-zinc-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('month')}
              className={cn('h-8 text-xs font-medium', view === 'month' && 'bg-white shadow-sm')}
            >
              Mês
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('week')}
              className={cn('h-8 text-xs font-medium', view === 'week' && 'bg-white shadow-sm')}
            >
              Semana
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('day')}
              className={cn('h-8 text-xs font-medium', view === 'day' && 'bg-white shadow-sm')}
            >
              Dia
            </Button>
          </div>
          <Button className="shadow-sm h-10 px-4" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
          </Button>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-zinc-800">Visualização Semanal</CardTitle>
          <div className="text-xs text-zinc-500 flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> Agendado
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Realizado
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px] p-6">
            <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2 mb-2">
              <div className="text-xs font-bold text-zinc-400">Horário</div>
              {days.map((d) => (
                <div
                  key={d}
                  className="text-sm font-semibold text-zinc-800 text-center pb-2 border-b border-zinc-200"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {hours.map((h) => (
                <div key={h} className="grid grid-cols-[80px_repeat(5,1fr)] gap-2 min-h-[60px]">
                  <div className="text-xs font-mono text-zinc-500 flex items-center">{h}:00</div>
                  {days.map((_, dIdx) => {
                    const apps = getAppointmentsForSlot(dIdx, h)
                    return (
                      <div
                        key={dIdx}
                        className="bg-zinc-50 border border-zinc-100 rounded-md p-1.5 hover:bg-zinc-100 transition-colors cursor-pointer group relative"
                        onClick={() => setIsAddOpen(true)}
                      >
                        {apps.map((app) => (
                          <div
                            key={app.id}
                            className={cn(
                              'p-2 rounded border text-xs flex flex-col mb-1',
                              app.status === 'Realizado'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-blue-50 border-blue-200 text-blue-800',
                            )}
                          >
                            <span className="font-bold truncate">{app.patientName}</span>
                            <span className="text-[10px] opacity-80">{app.analysisType}</span>
                          </div>
                        ))}
                        {apps.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Plus className="w-5 h-5 text-zinc-300" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Novo Agendamento Clínico</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Paciente</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Busque o paciente..." />
                </SelectTrigger>
                <SelectContent>
                  {acrPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Análise / Serviço</Label>
              <Select name="analysisType" defaultValue="Análise Comportamental" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Análise Comportamental">Análise Comportamental</SelectItem>
                  <SelectItem value="Mapeamento Corporal">Mapeamento Corporal</SelectItem>
                  <SelectItem value="Sessão de Retorno">Sessão de Retorno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input name="time" type="time" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor da Sessão (R$)</Label>
                <Input name="value" type="number" step="0.01" required defaultValue="250.00" />
              </div>
              <div className="space-y-2">
                <Label>Cobrança</Label>
                <Select name="paymentMethod" defaultValue="A Faturar" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PIX">PIX (Já Pago)</SelectItem>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="A Faturar">Boleto (A Faturar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-md">
              <Label className="text-sm cursor-pointer" htmlFor="reminder">
                Enviar Lembrete por E-mail
              </Label>
              <Switch id="reminder" checked={sendReminder} onCheckedChange={setSendReminder} />
            </div>

            <DialogFooter className="pt-2 border-t border-zinc-100">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Horário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
