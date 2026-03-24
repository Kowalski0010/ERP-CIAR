import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar as CalIcon,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { CashFlowTransaction } from '@/lib/types'

const txSchema = z.object({
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.'),
  type: z.enum(['Entrada', 'Saída']),
  amount: z.coerce.number().min(0.01, 'O valor deve ser maior que zero.'),
  date: z.string().min(1, 'A data é obrigatória.'),
})

export default function CashFlow() {
  const {
    payments,
    manualTransactions,
    addManualTransaction,
    updateManualTransaction,
    deleteManualTransaction,
  } = useAppStore()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<CashFlowTransaction | null>(null)
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    destructive: false,
  })

  const form = useForm<z.infer<typeof txSchema>>({
    resolver: zodResolver(txSchema),
    mode: 'onChange',
    defaultValues: {
      description: '',
      type: 'Saída',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (!isFormOpen) {
      setEditItem(null)
      form.reset({
        description: '',
        type: 'Saída',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
      })
    }
  }, [isFormOpen, form])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsFormOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const confirmAction = (
    title: string,
    description: string,
    onConfirm: () => void,
    destructive = false,
  ) => {
    setConfirmState({ open: true, title, description, onConfirm, destructive })
  }

  const handleEditClick = (t: CashFlowTransaction) => {
    setEditItem(t)
    form.reset({
      description: t.description,
      type: t.type,
      amount: t.amount,
      date: t.date.split('T')[0],
    })
    setIsFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    confirmAction(
      'Excluir Lançamento',
      'Tem certeza que deseja excluir este lançamento permanentemente? Esta ação não pode ser desfeita.',
      () => {
        deleteManualTransaction(id)
        toast({ title: 'Excluído', description: 'Registro removido com sucesso.' })
      },
      true,
    )
  }

  const onSubmit = (data: z.infer<typeof txSchema>) => {
    if (editItem) {
      confirmAction('Confirmar Edição', 'Deseja salvar as alterações neste lançamento?', () => {
        updateManualTransaction(editItem.id, { ...data, amount: Number(data.amount) })
        toast({ title: 'Atualizado', description: 'Lançamento atualizado com sucesso.' })
        setIsFormOpen(false)
      })
    } else {
      addManualTransaction({ ...data, amount: Number(data.amount) })
      toast({ title: 'Salvo', description: 'Movimentação manual registrada.' })
      setIsFormOpen(false)
    }
  }

  const dynamicInflows = payments
    .filter((p) => p.status === 'Pago')
    .map((p) => ({
      id: p.id,
      date: p.dueDate,
      description: p.studentName.includes('[Clínica ACR]')
        ? `Receita Clínica - ${p.studentName.replace('[Clínica ACR] ', '')}`
        : `Fatura - ${p.studentName}`,
      type: 'Entrada' as const,
      amount: Number(p.amount) || 0,
    }))

  const allTransactions = [...dynamicInflows, ...manualTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const totalIn = allTransactions
    .filter((t) => t.type === 'Entrada')
    .reduce((a, b) => a + Number(b.amount || 0), 0)
  const totalOut = allTransactions
    .filter((t) => t.type === 'Saída')
    .reduce((a, b) => a + Number(b.amount || 0), 0)
  const balance = totalIn - totalOut

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análise de entradas, saídas e resultado operacional.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm hidden sm:flex">
            <CalIcon className="mr-2 h-4 w-4" /> Selecionar Período
          </Button>
          <Button
            className="shadow-sm group"
            onClick={() => setIsFormOpen(true)}
            title="Atalho: Ctrl + N"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Movimentação
            <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
              Ctrl+N
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Receitas
                </p>
                <p className="text-3xl font-bold">
                  R$ {totalIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-600">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Despesas
                </p>
                <p className="text-3xl font-bold">
                  R$ {totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-600">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm relative overflow-hidden bg-primary/5 border-primary/20">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Líquido
                </p>
                <p className="text-3xl font-bold text-primary">
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="border-b border-border bg-muted/30 py-4">
          <CardTitle className="text-sm font-semibold">Extrato de Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 w-[120px]">Data</TableHead>
                <TableHead>Histórico</TableHead>
                <TableHead>Natureza</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((t) => {
                const isManual = manualTransactions.some((m) => m.id === t.id)
                return (
                  <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 text-muted-foreground text-sm">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          t.type === 'Entrada'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                        }
                      >
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${t.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {t.type === 'Entrada' ? '+' : '-'}{' '}
                      {Number(t.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right pr-6 p-2">
                      {isManual && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditClick(t as CashFlowTransaction)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Editar Lançamento
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteClick(t.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {allTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma movimentação no período.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Movimentação' : 'Nova Movimentação'}</DialogTitle>
            <DialogDescription>Preencha os dados do fluxo financeiro.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Histórico</FormLabel>
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Natureza</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Entrada">Entrada (+)</SelectItem>
                          <SelectItem value="Saída">Saída (-)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
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
