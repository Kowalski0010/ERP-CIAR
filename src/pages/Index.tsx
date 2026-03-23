import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Wallet,
  Activity,
  UserPlus,
  ClipboardCheck,
  GraduationCap,
  Keyboard,
  TrendingUp,
  AlertTriangle,
  FileSignature,
  Laptop,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAppStore } from '@/contexts/AppContext'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

const mockAttendanceData = [
  { day: 'Seg', rate: 95 },
  { day: 'Ter', rate: 92 },
  { day: 'Qua', rate: 88 },
  { day: 'Qui', rate: 96 },
  { day: 'Sex', rate: 90 },
]

export default function Index() {
  const navigate = useNavigate()
  const { students, payments, logs } = useAppStore()

  // Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        navigate('/academic/students') // Nova Matrícula / Aluno
      }
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        navigate('/academic/control/lancar-frequencia') // Lançar Frequência
      }
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        navigate('/secretaria/efetuar-matricula') // Matrícula Direta
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const activeStudents = students.filter((s) => s.status === 'Ativo').length
  const totalRevenue = payments
    .filter((p) => p.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0)
  const totalDelinquency = payments
    .filter((p) => p.status === 'Atrasado')
    .reduce((acc, curr) => acc + curr.amount, 0)

  // Document Signatures and Portal KPI metrics
  const totalDocuments = students.reduce((acc, s) => acc + (s.documents?.length || 0), 0)
  const signedDocuments = students.reduce(
    (acc, s) => acc + (s.documents?.filter((d) => d.status === 'Assinado').length || 0),
    0,
  )
  const signatureRate =
    totalDocuments > 0 ? Math.round((signedDocuments / totalDocuments) * 100) : 0
  const portalAccesses = 1240 // mock value

  const financialData = [
    { name: 'Receita', value: totalRevenue, fill: 'hsl(var(--primary))' },
    { name: 'Inadimplência', value: totalDelinquency, fill: 'hsl(var(--destructive))' },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 font-sans max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">Dashboard de Decisão</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão consolidada e atalhos rápidos para gestão operacional.
        </p>
      </div>

      {/* Smart Actions / FABs equivalent */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Ações Rápidas (Atalhos)</h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded border border-border">
            <Keyboard className="w-3.5 h-3.5" /> Pressione{' '}
            <kbd className="font-mono">Alt + Letra</kbd>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all group"
            onClick={() => navigate('/academic/students')}
          >
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-blue-900 dark:text-blue-200">Novo Aluno</span>
              <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-mono mt-1">Alt + N</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all group"
            onClick={() => navigate('/academic/control/lancar-frequencia')}
          >
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-emerald-900 dark:text-emerald-200">Lançar Frequência</span>
              <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-mono mt-1">Alt + F</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all group"
            onClick={() => navigate('/secretaria/efetuar-matricula')}
          >
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-purple-900 dark:text-purple-200">Nova Matrícula</span>
              <span className="text-[10px] text-purple-600/70 dark:text-purple-400/70 font-mono mt-1">Alt + M</span>
            </div>
          </Button>
        </div>
      </section>

      {/* BI KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Matrículas Ativas
              </p>
              <p className="text-3xl font-extrabold text-foreground">{activeStudents}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Faturamento Consolidado
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Índice de Inadimplência
              </p>
              <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-500">
                R$ {totalDelinquency.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BI KPI Cards - Row 2 (New Portal metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Acessos ao Portal (Mês)
              </p>
              <p className="text-3xl font-extrabold text-foreground">{portalAccesses}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center">
              <Laptop className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Assinaturas Digitais
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{signatureRate}%</p>
                <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                  CONCLUÍDAS
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <FileSignature className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Saúde Financeira</CardTitle>
            <CardDescription className="text-xs">
              Recebimentos vs. Em Atraso (Mês Atual)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: 'Valor R

<skip-file path="src/pages/financial/Payments.tsx" type="typescript">
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno da lista'),
  amount: z.coerce.number().min(0.01, 'O valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Informe a data de vencimento'),
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
  } = useAppStore()
  const { toast } = useToast()

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: '',
      amount: 0,
      dueDate: '',
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

  const filteredPayments = payments.filter((p) =>
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleAddPayment = (data: z.infer<typeof paymentSchema>) => {
    const student = students.find((s) => s.id === data.studentId)
    if (!student) return

    registerPayment({
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      studentId: student.id,
      studentName: student.name,
      amount: data.amount,
      dueDate: data.dueDate,
      status: 'Pendente',
    })

    toast({
      title: 'Lançamento Efetuado',
      description: `Nova fatura gerada para ${student.name}.`,
    })
    setIsAddPaymentOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago':
        return (
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Liquidado
          </Badge>
        )
      case 'Pendente':
        return (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
            <Clock className="w-3 h-3 mr-1" /> A Vencer
          </Badge>
        )
      case 'Atrasado':
        return (
          <Badge variant="outline" className="border-rose-200 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-3 h-3 mr-1" /> Em Atraso
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground">
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
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Excel
          </Button>
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
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
        <Alert className="bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 shadow-sm animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
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
              className="h-8 text-xs border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 bg-background hover:bg-rose-100 dark:hover:bg-rose-900 shrink-0"
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
            className="pl-9 h-10 bg-muted/50 border-input w-full text-sm"
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
                <TableHead className="text-right w-[200px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                    {payment.id.startsWith('INV') || payment.id.startsWith('ACR')
                      ? payment.id
                      : payment.id.padStart(6, '0')}
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
                    R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right p-2 space-x-1">
                    {payment.status !== 'Pago' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendWhatsApp(payment.studentName)}
                        className="h-8 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-medium px-2"
                        title="Enviar Lembrete via WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: 'Boleto Gerado',
                          description: 'O documento foi baixado e enviado ao cliente.',
                        })
                      }
                      className="h-8 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium px-2"
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" /> Boleto
                    </Button>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o aluno..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
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

