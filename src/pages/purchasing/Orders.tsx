import { useAppStore } from '@/contexts/AppContext'
import { Plus, CheckCircle2, Clock, XCircle, FileEdit } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Orders() {
  const { purchaseOrders } = useAppStore()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Recebido':
        return (
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Recebido
          </Badge>
        )
      case 'Enviado':
        return (
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            <Clock className="w-3 h-3 mr-1" /> Em Trânsito
          </Badge>
        )
      case 'Cancelado':
        return (
          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
            <XCircle className="w-3 h-3 mr-1" /> Cancelado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-zinc-300 bg-zinc-100 text-zinc-600">
            <FileEdit className="w-3 h-3 mr-1" /> Rascunho
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Pedidos de Compra</h1>
          <p className="text-sm text-zinc-500 mt-1">Acompanhamento e aprovação de ordens (POs).</p>
        </div>
        <Button className="shadow-sm h-9 px-4">
          <Plus className="mr-2 h-4 w-4" /> Novo Pedido
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Ordem Nº</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="w-[120px]">Data Emissão</TableHead>
              <TableHead className="w-[140px]">Prev. Entrega</TableHead>
              <TableHead className="text-right w-[140px]">Total (R$)</TableHead>
              <TableHead className="w-[140px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                <TableCell className="font-mono text-xs text-zinc-500 font-medium">
                  {order.id}
                </TableCell>
                <TableCell className="font-semibold text-zinc-900 text-xs">
                  {order.supplierName}
                </TableCell>
                <TableCell className="text-xs text-zinc-600">
                  {new Date(order.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-xs text-zinc-600">
                  {new Date(order.expectedDelivery).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right font-bold text-zinc-900">
                  {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(order.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
