import { useAppStore } from '@/contexts/AppContext'
import { Search, Download, FileText, CheckCircle2, AlertTriangle, Clock, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function Payments() {
  const { payments } = useAppStore()
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago':
        return (
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Liquidado
          </Badge>
        )
      case 'Pendente':
        return (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            <Clock className="w-3 h-3 mr-1" /> A Vencer
          </Badge>
        )
      case 'Atrasado':
        return (
          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
            <AlertTriangle className="w-3 h-3 mr-1" /> Em Atraso
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-700">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestão de Faturas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Controle centralizado de recebíveis, boletos e mensalidades.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm h-9 px-4">
            <Download className="mr-2 h-4 w-4" /> Exportar Remessa
          </Button>
          <Button className="shadow-sm h-9 px-4">
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por sacado, fatura ou valor..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Doc. Nº</TableHead>
              <TableHead>Sacado (Aluno)</TableHead>
              <TableHead className="w-[100px]">Ref.</TableHead>
              <TableHead className="w-[140px]">Vencimento</TableHead>
              <TableHead className="text-right w-[140px]">Valor Líquido</TableHead>
              <TableHead className="w-[140px]">Situação</TableHead>
              <TableHead className="text-right w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="group hover:bg-zinc-50/80 transition-colors">
                <TableCell className="font-mono text-xs text-zinc-500 font-medium">
                  {payment.id.startsWith('INV') ? payment.id : payment.id.padStart(6, '0')}
                </TableCell>
                <TableCell className="font-semibold text-zinc-900 text-[13px]">
                  {payment.studentName}
                </TableCell>
                <TableCell className="text-zinc-500 text-xs font-medium">
                  {payment.installmentNumber && payment.totalInstallments
                    ? `Parc. ${payment.installmentNumber}/${payment.totalInstallments}`
                    : 'Avulsa'}
                </TableCell>
                <TableCell className="text-sm text-zinc-700">
                  {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="font-semibold text-zinc-900 text-right">
                  R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: 'Boleto Gerado',
                        description: 'O documento foi baixado e enviado ao cliente.',
                      })
                    }
                    className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5" /> Boleto
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
