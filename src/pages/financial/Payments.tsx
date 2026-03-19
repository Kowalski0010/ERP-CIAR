import { useAppStore } from '@/contexts/AppContext'
import { Search, Download, FileText, CheckCircle2 } from 'lucide-react'
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
          <Badge className="status-success border-none">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Pago
          </Badge>
        )
      case 'Pendente':
        return <Badge className="status-warning border-none">Pendente</Badge>
      case 'Atrasado':
        return <Badge className="status-danger border-none">Atrasado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Mensalidades</h1>
          <p className="text-muted-foreground">
            Acompanhe contratos, pagamentos e faturas dos alunos.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-subtle p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por aluno ou fatura..." className="pl-9" />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Fatura #</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Parcela</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  FT-{payment.id.padStart(4, '0')}
                </TableCell>
                <TableCell className="font-medium">{payment.studentName}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {payment.installmentNumber && payment.totalInstallments
                    ? `${payment.installmentNumber}/${payment.totalInstallments}`
                    : '-'}
                </TableCell>
                <TableCell>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="font-semibold text-foreground">
                  R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast({ title: 'Boleto', description: 'Enviado!' })}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Gerar Boleto
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
