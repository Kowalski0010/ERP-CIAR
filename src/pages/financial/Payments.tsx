import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
  RefreshCw,
  MessageCircle,
  Paperclip,
  Trash2,
  MoreHorizontal,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileUpload } from '@/components/FileUpload'
import { Payment, Student } from '@/lib/types'
import { getStudents } from '@/services/students'
import {
  getPayments,
  addPayment as addPaymentDb,
  updatePayment as updatePaymentDb,
} from '@/services/payments'

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno'),
  amount: z.coerce.number().min(0.01, 'O valor deve ser maior que 0'),
  dueDate: z.string().min(1, 'Informe a data de vencimento'),
  attachments: z.any().optional(),
})

export default function Payments() {
  const {
    payments,
    students,
    notifications,
    markNotificationsAsRead,
    addCommunicationLog,
    simulatePaymentReconciliation,
    registerPayment,
    updatePayment,
  } = useAppStore()
  const { toast } = useToast()

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [attachmentsItem, setAttachmentsItem] = useState<Payment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dbPayments, setDbPayments] = useState<Payment[]>([])
  const [dbStudents, setDbStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [paymentsData, studentsData] = await Promise.all([getPayments(), getStudents()])
      setDbPayments(paymentsData)
      setDbStudents(studentsData)
    } catch (error) {
      console.error('Failed to fetch financial data', error)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar dados financeiros.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      studentId: '',
      amount: 0,
      dueDate: '',
      attachments: [],
    },
  })

  useEffect(() => {
    if (isAddPaymentOpen) {
      form.reset()
    }
  }, [isAddPaymentOpen, form])

  // Global shortcut for opening modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsAddPaymentOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredPayments = dbPayments.filter((p) =>
    p.studentName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      body: 'Lembramos que sua fatura vencerá nos próximos dias. Evite juros acessando o portal para pagamento.',
    })
    toast({
      title: 'Notificações Enviadas',
      description:
        'Alertas de vencimento disparados por email e push notification para os responsáveis.',
    })
  }

  const handleReconciliation = () => {
    simulatePaymentReconciliation()
    toast({
      title: 'Conciliação Concluída',
      description:
        'Pagamentos pendentes foram processados simulando integração com Gateway PIX/Cartão.',
    })
  }

  const sendWhatsApp = (studentName: string) => {
    toast({
      title: 'WhatsApp Enviado',
      description: `Lembrete de pagamento disparado para o responsável de ${studentName}.`,
    })
    addCommunicationLog({
      recipient: studentName,
      channel: 'WhatsApp',
      subject: 'Lembrete de Fatura',
      body: `Envio de lembrete financeiro via WhatsApp.`,
    })
  }

  const handleAddPayment = async (data: z.infer<typeof paymentSchema>) => {
    const student = dbStudents.find((s) => s.id === data.studentId)
    if (!student) return

    const newPayment = {
      studentId: student.id,
      studentName: student.name,
      amount: Number(data.amount),
      dueDate: data.dueDate,
      status: 'Pendente' as const,
      attachments: data.attachments || [],
    }

    try {
      const saved = await addPaymentDb(newPayment)
      setDbPayments((prev) =>
        [...prev, saved].sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
      )

      toast({
        title: 'Lançamento Efetuado',
        description: `Nova fatura gerada e persistida no banco de dados para ${student.name}.`,
      })
      setIsAddPaymentOpen(false)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar no banco de dados.',
        variant: 'destructive',
      })
    }
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestão de Faturas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Controle centralizado de recebíveis, boletos e conciliação de gateway.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0"
            onClick={() => handleExport('Excel')}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
            Excel
          </Button>
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0 border-amber-200 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100"
            onClick={handleNotifyExpiring}
          >
            <BellRing className="mr-2 h-4 w-4 text-amber-500" /> Alertar Vencimentos
          </Button>
          <Button
            onClick={handleReconciliation}
            className="shadow-sm h-10 px-4 shrink-0 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Baixa Automática
          </Button>
          <Button
            onClick={() => setIsAddPaymentOpen(true)}
            className="shadow-sm h-10 px-4 shrink-0 font-semibold group"
            title="Atalho: Ctrl + N"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
            <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
              Ctrl+N
            </span>
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

      <div className="bg-card border border-border rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por sacado..."
            className="pl-9 h-10 bg-muted/50 border-input focus-visible:border-ring w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="table-compact min-w-[900px]">
            <TableHeader className="bg-muted/50">
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
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                    {payment.id?.substring(0, 8).toUpperCase() || 'INV-001'}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground text-sm">
                    {payment.studentName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-medium">
                    {payment.installmentNumber && payment.totalInstallments
                      ? `Parc. ${payment.installmentNumber}/${payment.totalInstallments}`
                      : 'Avulsa/Multa'}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/80">
                    {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-bold text-foreground text-right">
                    R${' '}
                    {Number(payment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right p-2 space-x-1">
                    {payment.status !== 'Pago' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendWhatsApp(payment.studentName)}
                        className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-medium px-2"
                        title="Enviar Lembrete via WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            toast({
                              title: 'Boleto Gerado',
                              description: 'O documento foi baixado e enviado ao cliente.',
                            })
                          }
                        >
                          <FileText className="mr-2 h-4 w-4 text-blue-600" /> Boleto
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setAttachmentsItem(payment)}>
                          <Paperclip className="mr-2 h-4 w-4" /> Comprovantes / Anexos
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhum lançamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!attachmentsItem} onOpenChange={(open) => !open && setAttachmentsItem(null)}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Anexos da Fatura</DialogTitle>
            <DialogDescription>Gerencie comprovantes e documentos desta fatura.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <FileUpload
              multiple
              onUpload={async (files) => {
                if (!attachmentsItem) return
                const newAttachments = [...(attachmentsItem.attachments || []), ...files]
                try {
                  await updatePaymentDb(attachmentsItem.id, { attachments: newAttachments })
                  // updatePayment(attachmentsItem.id, { attachments: newAttachments }) // using DB now
                  setAttachmentsItem({ ...attachmentsItem, attachments: newAttachments })
                  setDbPayments((prev) =>
                    prev.map((p) =>
                      p.id === attachmentsItem.id ? { ...p, attachments: newAttachments } : p,
                    ),
                  )
                  toast({ title: 'Arquivos anexados com sucesso' })
                } catch (e) {
                  toast({
                    title: 'Erro',
                    description: 'Falha ao salvar anexo no banco.',
                    variant: 'destructive',
                  })
                }
              }}
            />{' '}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {attachmentsItem?.attachments?.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2 border rounded-md text-sm bg-muted/30"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 shrink-0 text-blue-500" />
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:underline font-medium"
                    >
                      {att.name}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={async () => {
                      const newAttachments = attachmentsItem.attachments!.filter(
                        (a: any) => a.id !== att.id,
                      )
                      try {
                        await updatePaymentDb(attachmentsItem.id, { attachments: newAttachments })
                        // updatePayment(attachmentsItem.id, { attachments: newAttachments }) // using DB now
                        setAttachmentsItem({ ...attachmentsItem, attachments: newAttachments })
                        setDbPayments((prev) =>
                          prev.map((p) =>
                            p.id === attachmentsItem.id ? { ...p, attachments: newAttachments } : p,
                          ),
                        )
                      } catch (e) {
                        toast({
                          title: 'Erro',
                          description: 'Falha ao remover anexo do banco.',
                          variant: 'destructive',
                        })
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!attachmentsItem?.attachments || attachmentsItem.attachments.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                  Nenhum anexo encontrado.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lançamento Avulso</DialogTitle>
            <DialogDescription>
              Adicione uma nova cobrança ou fatura manual para um aluno matriculado.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPayment)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sacado (Aluno)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o aluno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dbStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vencimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprovante Original (Opcional)</FormLabel>
                    <FormControl>
                      <FileUpload
                        multiple
                        label="Anexar comprovante"
                        onUpload={(files) => field.onChange(files)}
                      />
                    </FormControl>
                    {field.value?.length > 0 && (
                      <p className="text-xs text-emerald-600 mt-1">
                        {field.value.length} arquivo(s) selecionado(s)
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Gerar Cobrança</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
