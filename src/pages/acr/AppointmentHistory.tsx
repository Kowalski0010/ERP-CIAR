import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Search, Plus, CalendarDays, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AppointmentHistory() {
  const { acrAppointments, acrPatients, addAcrAppointment } = useAppStore()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')

  const filteredAppointments = acrAppointments
    .filter((a) => a.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedPatientId) return

    const patient = acrPatients.find((p) => p.id === selectedPatientId)
    const fd = new FormData(e.currentTarget)
    const value = Number(fd.get('value'))
    const status = fd.get('status') as 'Realizado' | 'Agendado'

    if (patient) {
      addAcrAppointment({
        patientId: patient.id,
        patientName: patient.name,
        date: fd.get('date') as string,
        value: value,
        paymentMethod: fd.get('paymentMethod') as string,
        status: status,
      })

      if (status === 'Realizado' && value > 0) {
        toast({
          title: 'Atendimento e Pagamento Salvos',
          description: 'A sessão foi concluída e o valor foi repassado ao Caixa Central.',
        })
      } else {
        toast({
          title: 'Atendimento Agendado',
          description: 'O horário foi reservado com sucesso.',
        })
      }
      setIsAddOpen(false)
      setSelectedPatientId('')
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'Realizado') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (status === 'Agendado') return 'bg-blue-50 text-blue-700 border-blue-200'
    return 'bg-zinc-100 text-zinc-600 border-zinc-200'
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-zinc-400" />
            Histórico de Atendimentos
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Agende e fature consultas integradas ao módulo financeiro geral.
          </p>
        </div>
        <Button className="shadow-sm h-9 px-4" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Registrar Sessão
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm p-3 bg-white">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por paciente..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Data / Hora</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead className="w-[140px] text-center">Status</TableHead>
                <TableHead className="w-[140px] text-right">Valor</TableHead>
                <TableHead className="w-[160px] text-center">Pgto.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((app) => (
                <TableRow key={app.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-mono text-xs text-zinc-500 font-medium">
                    {new Date(app.date).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900 text-sm">
                    {app.patientName}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={getStatusBadge(app.status)}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-zinc-900 text-sm">
                    R$ {app.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center text-xs text-zinc-600">
                    {app.paymentMethod}
                  </TableCell>
                </TableRow>
              ))}
              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                    Nenhum atendimento registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Registrar Novo Atendimento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Selecionar Paciente</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data / Hora</Label>
                <Input name="date" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue="Realizado" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Realizado">Realizado</SelectItem>
                    <SelectItem value="Agendado">Agendado (Futuro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Valor da Sessão (R$)
                </Label>
                <Input name="value" type="number" step="0.01" required defaultValue="250.00" />
              </div>
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select name="paymentMethod" defaultValue="PIX" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="A Faturar">A Faturar (Boleto)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-200 mt-2">
              Se "Realizado", o valor será enviado como receita pro Fluxo de Caixa do sistema.
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Sessão</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
