import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, Download, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'

export default function StudentFinancial() {
  const { payments, students } = useAppStore()
  const { toast } = useToast()
  const student = students[0]

  const myPayments = payments
    .filter((p) => p.studentId === student.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago':
        return (
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-emerald-700 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Pago
          </Badge>
        )
      case 'Pendente':
        return (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700 font-medium"
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" /> A Vencer
          </Badge>
        )
      case 'Atrasado':
        return (
          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Atrasado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <Wallet className="h-6 w-6 text-zinc-400" />
          Extrato Financeiro
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Acesse seus boletos, recibos e acompanhe o pagamento das mensalidades.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Referência</TableHead>
                <TableHead className="w-[140px]">Vencimento</TableHead>
                <TableHead className="text-right w-[140px]">Valor (R$)</TableHead>
                <TableHead className="w-[160px]">Situação</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPayments.map((p) => (
                <TableRow key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-medium text-zinc-700 text-xs">
                    {p.installmentNumber
                      ? `Parcela ${p.installmentNumber}/${p.totalInstallments}`
                      : 'Avulsa'}
                  </TableCell>
                  <TableCell className="text-zinc-900 font-mono text-xs">
                    {new Date(p.dueDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right text-zinc-900 font-bold">
                    {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{getStatusBadge(p.status)}</TableCell>
                  <TableCell className="text-right">
                    {p.status !== 'Pago' ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-[10px] font-semibold bg-zinc-900 text-white hover:bg-zinc-800"
                        onClick={() =>
                          toast({
                            title: 'Download Iniciado',
                            description: 'O boleto PDF foi gerado e o download começou.',
                          })
                        }
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Boleto
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px] font-medium"
                        onClick={() =>
                          toast({ title: 'Recibo', description: 'Recibo gerado com sucesso.' })
                        }
                      >
                        Recibo PDF
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {myPayments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 flex-col gap-2 items-center justify-center text-center text-zinc-500"
                  >
                    <Wallet className="h-6 w-6 mb-2 text-zinc-300 mx-auto" />
                    Nenhuma cobrança registrada no seu painel.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
