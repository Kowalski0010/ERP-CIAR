import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import { ArrowUpRight, ArrowDownRight, Activity, Calendar as CalIcon, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const txSchema = z.object({
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.'),
  type: z.enum(['Entrada', 'Saída']),
  amount: z.coerce.number().min(0.01, 'O valor deve ser maior que zero.'),
  date: z.string().min(1, 'A data é obrigatória.'),
})

export default function CashFlow() {
  const { payments, manualTransactions, addManualTransaction } = useAppStore()
  const { toast } = useToast()

  const [isAddOpen, setIsAddOpen] = useState(false)

  const form = useForm<z.infer<typeof txSchema>>({
    resolver: zodResolver(txSchema),
    defaultValues: {
      description: '',
      type: 'Saída',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (isAddOpen) {
      form.reset()
    }
  }, [isAddOpen, form])

  // Global shortcut for opening modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Dynamic inflows from resolved payments across the system
  const dynamicInflows = payments
    .filter((p) => p.status === 'Pago')
    .map((p) => ({
      id: p.id,
      date: p.dueDate,
      description: p.studentName.includes('[Clínica ACR]')
        ? `Receita Atendimento Clínico - ${p.studentName.replace('[Clínica ACR] ', '')}`
        : `Receita Mensalidade/Fatura - ${p.studentName}`,
      type: 'Entrada' as const,
      amount: p.amount,
    }))

  const allTransactions = [...dynamicInflows, ...manualTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const totalIn = allTransactions
    .filter((t) => t.type === 'Entrada')
    .reduce((a, b) => a + b.amount, 0)
  const totalOut = allTransactions
    .filter((t) => t.type === 'Saída')
    .reduce((a, b) => a + b.amount, 0)
  const balance = totalIn - totalOut

  const onSubmit = (data: z.infer<typeof txSchema>) => {
    addManualTransaction(data)
    toast({
      title: 'Lançamento Salvo',
      description: 'Movimentação manual registrada com sucesso no fluxo de caixa.',
    })
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análise de entradas, saídas e resultado operacional consolidado.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm hidden sm:flex">
            <CalIcon className="mr-2 h-4 w-4" /> Selecionar Período
          </Button>
          <Button
            className="shadow-sm group"
            onClick={() => setIsAddOpen(true)}
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
                  Receitas Operacionais
                </p>
                <p className="text-3xl font-bold text-foreground">
                  R$ {totalIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
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
                  Despesas Operacionais
                </p>
                <p className="text-3xl font-bold text-foreground">
                  R$ {totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400">
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
                  Resultado Líquido
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
          <CardTitle className="text-sm font-semibold text-foreground">
            Extrato de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 w-[120px]">Data</TableHead>
                <TableHead>Histórico</TableHead>
                <TableHead>Natureza</TableHead>
                <TableHead className="text-right pr-6">Valor (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 text-muted-foreground text-sm">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{t.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        t.type === 'Entrada'
                          ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium px-2 py-0'
                          : 'border-rose-200 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-medium px-2 py-0'
                      }
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right pr-6 font-semibold ${t.type === 'Entrada' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                  >
                    {t.type === 'Entrada' ? '+' : '-'}{' '}
                    {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
              {allTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma movimentação no período.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Movimentação Manual</DialogTitle>
            <DialogDescription>
              Adicione receitas ou despesas não vinculadas automaticamente ao sistema.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Histórico / Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pagamento Fornecedor XYZ..." {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
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
                      <FormLabel>Valor Bruto (R$)</FormLabel>
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
                    <FormLabel>Data do Ocorrido</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Lançamento</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
