import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Edit, Trash2, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { FinancialTransaction, FinancialAccount } from '@/lib/types'
import {
  getFinancialTransactions,
  saveFinancialTransaction,
  deleteFinancialTransaction,
  getFinancialAccounts,
} from '@/services/financial'

const txSchema = z.object({
  description: z.string().min(3, 'Mínimo de 3 caracteres.'),
  accountId: z.string().min(1, 'A conta é obrigatória.'),
  amount: z.coerce.number().min(0.01, 'Deve ser maior que zero.'),
  type: z.enum(['Receita', 'Despesa']),
  date: z.string().min(1, 'A data é obrigatória.'),
  status: z.enum(['Realizado', 'Previsto']),
})

const SummaryCard = ({ title, value, subtitle, colorClass }: any) => (
  <Card className={`shadow-sm border-l-4 ${colorClass}`}>
    <CardContent className="p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${value >= 0 ? '' : 'text-rose-600'}`}>
        {value >= 0
          ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          : `- R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
      </p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
)

export default function FinancialTransactions() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [accounts, setAccounts] = useState<FinancialAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<FinancialTransaction | null>(null)
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))
  const { toast } = useToast()

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    destructive: false,
  })

  const form = useForm<z.infer<typeof txSchema>>({
    resolver: zodResolver(txSchema),
    defaultValues: {
      description: '',
      accountId: '',
      amount: 0,
      type: 'Despesa',
      date: new Date().toISOString().split('T')[0],
      status: 'Realizado',
    },
  })

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [txs, accs] = await Promise.all([getFinancialTransactions(), getFinancialAccounts()])
      setTransactions(txs)
      setAccounts(accs)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!isFormOpen) {
      setEditItem(null)
      form.reset({
        description: '',
        accountId: '',
        amount: 0,
        type: 'Despesa',
        date: new Date().toISOString().split('T')[0],
        status: 'Realizado',
      })
    }
  }, [isFormOpen, form])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'accountId') {
        const acc = accounts.find((a) => a.id === value.accountId)
        if (acc) form.setValue('type', acc.type)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, accounts])

  const onSubmit = async (data: z.infer<typeof txSchema>) => {
    try {
      await saveFinancialTransaction({ ...data, id: editItem?.id })
      toast({ title: 'Sucesso', description: 'Lançamento salvo.' })
      setIsFormOpen(false)
      loadData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleDelete = (id: string) => {
    setConfirmState({
      open: true,
      title: 'Excluir',
      description: 'Tem certeza?',
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteFinancialTransaction(id)
          toast({ title: 'Sucesso', description: 'Excluído.' })
          loadData()
        } catch (error: any) {
          toast({ title: 'Erro', description: error.message, variant: 'destructive' })
        }
      },
    })
  }

  const filteredTxs = transactions.filter((t) => t.date.startsWith(filterMonth))
  const totRecReal = filteredTxs
    .filter((t) => t.type === 'Receita' && t.status === 'Realizado')
    .reduce((a, b) => a + b.amount, 0)
  const totDesReal = filteredTxs
    .filter((t) => t.type === 'Despesa' && t.status === 'Realizado')
    .reduce((a, b) => a + b.amount, 0)
  const totRecPrev = filteredTxs
    .filter((t) => t.type === 'Receita' && t.status === 'Previsto')
    .reduce((a, b) => a + b.amount, 0)
  const totDesPrev = filteredTxs
    .filter((t) => t.type === 'Despesa' && t.status === 'Previsto')
    .reduce((a, b) => a + b.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhamento diário de receitas, despesas e previsões.
          </p>
        </div>
        <div className="flex gap-4">
          <Input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-[180px]"
          />
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Lançamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Receitas (Realizadas)"
          value={totRecReal}
          subtitle={`Previsto: R$ ${totRecPrev.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          colorClass="border-l-emerald-500 [&_p.text-2xl]:text-emerald-600"
        />
        <SummaryCard
          title="Despesas (Realizadas)"
          value={totDesReal}
          subtitle={`Previsto: R$ ${totDesPrev.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          colorClass="border-l-rose-500 [&_p.text-2xl]:text-rose-600"
        />
        <SummaryCard
          title="Saldo Realizado"
          value={totRecReal - totDesReal}
          colorClass="border-l-blue-500"
        />
        <SummaryCard
          title="Saldo Projetado"
          value={totRecReal - totDesReal + (totRecPrev - totDesPrev)}
          colorClass="border-l-zinc-500"
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-semibold">Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6 w-[120px]">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredTxs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Sem lançamentos.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTxs.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(tx.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{tx.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {tx.accountName || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={tx.status === 'Realizado' ? 'default' : 'secondary'}
                        className={tx.status === 'Realizado' ? 'bg-primary/10 text-primary' : ''}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${tx.type === 'Receita' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {tx.type === 'Receita' ? '+' : '-'}{' '}
                      {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditItem(tx)
                          form.reset({ ...tx, date: tx.date.split('T')[0] })
                          setIsFormOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(tx.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Lançamento' : 'Novo Lançamento'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
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
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta Contábil</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select disabled onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Receita">Receita</SelectItem>
                          <SelectItem value="Despesa">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Realizado">Realizado</SelectItem>
                          <SelectItem value="Previsto">Previsto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmActionDialog
        {...confirmState}
        onOpenChange={(open) => setConfirmState((p) => ({ ...p, open }))}
      />
    </div>
  )
}
