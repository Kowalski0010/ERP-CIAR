import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, ClipboardCheck, History } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function PendingApprovals() {
  const { approvalRequests, approveRequest, rejectRequest } = useAppStore()
  const { toast } = useToast()

  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const pending = approvalRequests.filter((r) => r.status === 'Pendente')
  const history = approvalRequests
    .filter((r) => r.status !== 'Pendente')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleApprove = (id: string) => {
    approveRequest(id)
    toast({
      title: 'Solicitação Aprovada',
      description: 'A alteração foi efetivada e registrada no sistema.',
    })
  }

  const handleRejectSubmit = () => {
    if (rejectingId && reason) {
      rejectRequest(rejectingId, reason)
      toast({
        title: 'Solicitação Rejeitada',
        description: 'O requerente foi notificado do motivo da recusa.',
        variant: 'destructive',
      })
      setRejectingId(null)
      setReason('')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <ClipboardCheck className="h-7 w-7 text-zinc-400" />
            Aprovações Pendentes
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Revisão e autorização de requerimentos sensíveis e mudanças cadastrais.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4">
          <CardTitle className="text-base text-zinc-800">Fila de Análise</CardTitle>
          <CardDescription className="text-xs">
            Ações aprovadas são processadas imediatamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {pending.length > 0 ? (
            <Table className="table-compact">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">Data</TableHead>
                  <TableHead className="w-[180px]">Requerente</TableHead>
                  <TableHead className="w-[160px]">Tipo</TableHead>
                  <TableHead>Detalhes da Solicitação</TableHead>
                  <TableHead className="text-right w-[140px]">Decisão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((req) => (
                  <TableRow key={req.id} className="hover:bg-zinc-50">
                    <TableCell className="font-mono text-xs text-zinc-500">
                      {new Date(req.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-semibold text-zinc-900 text-sm">
                      {req.requesterName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-zinc-50 font-medium">
                        {req.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-700">{req.details}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        onClick={() => handleApprove(req.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                        onClick={() => setRejectingId(req.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center text-zinc-400">
              <ClipboardCheck className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold text-zinc-700">Tudo limpo por aqui!</p>
              <p className="text-xs">Não há aprovações pendentes na sua fila de gestão.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden mt-6">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-3">
            <CardTitle className="text-sm text-zinc-800 flex items-center gap-2">
              <History className="h-4 w-4 text-zinc-400" /> Histórico Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-compact">
              <TableBody>
                {history.slice(0, 5).map((req) => (
                  <TableRow key={req.id} className="hover:bg-transparent">
                    <TableCell className="font-mono text-xs text-zinc-500 w-[120px]">
                      {new Date(req.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-900 w-[180px]">
                      {req.requesterName}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 truncate">{req.details}</TableCell>
                    <TableCell className="text-right w-[140px]">
                      <Badge
                        variant="outline"
                        className={
                          req.status === 'Aprovado'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação</DialogTitle>
            <DialogDescription>
              Por favor, informe o motivo da recusa para o requerente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Motivo da Rejeição (Obrigatório)</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Documentação incompleta, Vagas esgotadas..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={!reason.trim()}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
