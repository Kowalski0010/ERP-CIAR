import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import {
  Mail,
  Search,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Smartphone,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function CommunicationLogs() {
  const { communicationLogs } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const filteredLogs = communicationLogs.filter(
    (log) =>
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    if (status === 'Entregue') return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
    if (status === 'Pendente') return <Clock className="w-3.5 h-3.5 mr-1" />
    return <XCircle className="w-3.5 h-3.5 mr-1" />
  }

  const getStatusColor = (status: string) => {
    if (status === 'Entregue') return 'text-emerald-600'
    if (status === 'Pendente') return 'text-amber-600'
    return 'text-rose-600'
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Mail className="h-7 w-7 text-zinc-400" />
            Logs de Notificação (Email/SMS)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Auditoria de disparos transacionais e automáticos do sistema.
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por destinatário ou assunto..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px]">Data/Hora</TableHead>
              <TableHead className="w-[200px]">Destinatário</TableHead>
              <TableHead className="w-[100px] text-center">Canal</TableHead>
              <TableHead>Assunto / Disparo</TableHead>
              <TableHead className="w-[120px] text-center">Status</TableHead>
              <TableHead className="text-right w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                <TableCell className="font-mono text-[11px] text-zinc-500">{log.date}</TableCell>
                <TableCell className="font-medium text-zinc-900 text-xs">{log.recipient}</TableCell>
                <TableCell className="text-center">
                  {log.channel === 'Email' ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0 font-medium"
                    >
                      <Mail className="h-3 w-3 mr-1" /> Email
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 px-2 py-0 font-medium"
                    >
                      <Smartphone className="h-3 w-3 mr-1" /> SMS
                    </Badge>
                  )}
                </TableCell>
                <TableCell
                  className="text-xs font-semibold text-zinc-700 truncate max-w-[300px]"
                  title={log.subject}
                >
                  {log.subject}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center text-xs font-bold ${getStatusColor(log.status)}`}
                  >
                    {getStatusIcon(log.status)} {log.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
                    onClick={() => setSelectedLog(log)}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  Nenhum registro de envio encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-md bg-white">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-zinc-400" /> Detalhes da Notificação
                </DialogTitle>
                <DialogDescription className="text-xs font-mono">
                  ID: {selectedLog.id} • {selectedLog.date}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
                      Destinatário
                    </span>
                    <span className="font-medium text-zinc-900">{selectedLog.recipient}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
                      Status de Entrega
                    </span>
                    <span className={`font-bold ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
                    Assunto
                  </span>
                  <span className="font-medium text-zinc-900 text-sm">{selectedLog.subject}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
                    Conteúdo Enviado
                  </span>
                  <div className="p-3 bg-zinc-50 rounded-md border border-zinc-200 text-xs text-zinc-700 whitespace-pre-wrap min-h-[100px]">
                    {selectedLog.body}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
