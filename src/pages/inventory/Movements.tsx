import { useAppStore } from '@/contexts/AppContext'
import { ArrowDownRight, ArrowUpRight, History } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function Movements() {
  const { stockMovements } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Movimentações</h1>
          <p className="text-sm text-zinc-500 mt-1">Histórico de entradas e saídas de estoque.</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        {stockMovements.length > 0 ? (
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[160px]">Data / Hora</TableHead>
                <TableHead className="w-[120px]">Tipo</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right w-[100px]">Qtd.</TableHead>
                <TableHead>Motivo / Observação</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockMovements.map((mov) => (
                <TableRow key={mov.id} className="hover:bg-zinc-50/80 transition-colors">
                  <TableCell className="font-mono text-xs text-zinc-500">
                    {new Date(mov.date).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>
                    {mov.type === 'Entrada' ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700 px-2 py-0"
                      >
                        <ArrowDownRight className="w-3 h-3 mr-1" /> Entrada
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50 text-rose-700 px-2 py-0"
                      >
                        <ArrowUpRight className="w-3 h-3 mr-1" /> Saída
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900 text-xs">
                    {mov.productName}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${mov.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {mov.type === 'Entrada' ? '+' : '-'}
                    {mov.quantity}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600">{mov.reason}</TableCell>
                  <TableCell className="text-xs text-zinc-500">{mov.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50">
            <div className="h-12 w-12 bg-white border border-zinc-200 rounded-lg flex items-center justify-center mb-3 shadow-sm">
              <History className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">Nenhum registro</h3>
            <p className="text-xs text-zinc-500 mt-1">Não há movimentações registradas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
