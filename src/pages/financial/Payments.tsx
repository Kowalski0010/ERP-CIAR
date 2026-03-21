import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  FileSpreadsheet,
  BellRing,
} from 'lucide-react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Payments() {
  const { payments, notifications, markNotificationsAsRead, addCommunicationLog } = useAppStore()
  const { toast } = useToast()

  const recentSuspensions = notifications.filter(
    (n) => n.target === 'Financeiro' && n.title.includes('Trancamento') && !n.read,
  )

  const handleExport = (type: string) => {
    toast({
      title: `Exportando ${type}`,
      description: `Gerando arquivo ${type} da listagem financeira. O download começará em instantes.`,
    })
  }

  const handleNotifyExpiring = () => {
    addCommunicationLog({
      recipient: 'Alunos com Vencimento Próximo',
      channel: 'Email',
      subject: 'Aviso de Vencimento de Fatura',
      status: 'Entregue',
      body: 'Lembramos que sua fatura vencerá nos próximos dias. Evite juros acessando o portal para pagamento.',
    })
    toast({
      title: 'Notificações Enviadas',
      description:
        'Alertas de vencimento disparados por email e push notification para os responsáveis.',
    })
  }

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
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Gestão de Faturas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Controle centralizado de recebíveis, boletos e mensalidades.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0"
            onClick={() => handleExport('Excel')}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Excel
          </Button>
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0"
            onClick={() => handleExport('PDF')}
          >
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0 border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
            onClick={handleNotifyExpiring}
          >
            <BellRing className="mr-2 h-4 w-4 text-amber-500" /> Alertar Vencimentos
          </Button>
          <Button className="shadow-sm h-10 px-4 shrink-0 font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      {recentSuspensions.length > 0 && (
        <Alert className="bg-rose-50 border-rose-200 text-rose-900 shadow-sm animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <strong className="block text-sm">Alerta de Workflow: Matrículas Trancadas</strong>
              <span className="text-xs opacity-90 block mt-0.5">
                A Secretaria trancou a matrícula de {recentSuspensions.length} aluno(s). Revise as
                pendências financeiras para possível cobrança extra ou cancelamento.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-rose-300 text-rose-700 bg-white hover:bg-rose-100 shrink-0"
              onClick={markNotificationsAsRead}
            >
              Marcar como Revisado
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por sacado, fatura ou valor..."
            className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus-visible:border-zinc-300 w-full text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="table-compact min-w-[800px]">
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Doc. Nº</TableHead>
                <TableHead>Sacado (Aluno)</TableHead>
                <TableHead className="w-[120px]">Ref.</TableHead>
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
                  <TableCell className="font-semibold text-zinc-900 text-sm">
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
                  <TableCell className="font-bold text-zinc-900 text-right">
                    R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right p-2">
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
    </div>
  )
}
