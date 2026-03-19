import { useAppStore } from '@/contexts/AppContext'
import { Search, Download, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
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
          <Badge variant="outline" className="status-success">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Liquidado
          </Badge>
        )
      case 'Pendente':
        return (
          <Badge variant="outline" className="status-warning">
            <Clock className="w-3 h-3 mr-1" /> A Vencer
          </Badge>
        )
      case 'Atrasado':
        return (
          <Badge variant="outline" className="status-danger">
            <AlertTriangle className="w-3 h-3 mr-1" /> Em Atraso
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Faturas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Controle centralizado de recebíveis e mensalidades.
          </p>
        </div>
        <Button variant="outline" className="shadow-sm">
          <Download className="mr-2 h-4 w-4" /> Exportar Remessa
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por sacado, fatura ou valor..."
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Doc. Nº</TableHead>
              <TableHead>Sacado</TableHead>
              <TableHead>Ref.</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor Líquido</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="group hover:bg-muted/20">
                <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                  {payment.id.padStart(6, '0')}
                </TableCell>
                <TableCell className="font-medium text-foreground">{payment.studentName}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {payment.installmentNumber && payment.totalInstallments
                    ? `Parc. ${payment.installmentNumber}/${payment.totalInstallments}`
                    : '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="font-semibold text-foreground text-right">
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
                        description: 'O documento foi enviado ao cliente.',
                      })
                    }
                    className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5" /> 2ª Via
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
