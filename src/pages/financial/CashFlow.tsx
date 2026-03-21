import { useAppStore } from '@/contexts/AppContext'
import { ArrowUpRight, ArrowDownRight, Activity, Calendar as CalIcon } from 'lucide-react'
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

export default function CashFlow() {
  const { payments } = useAppStore()

  // Dynamic inflows from resolved payments across the system
  const dynamicInflows = payments
    .filter((p) => p.status === 'Pago')
    .map((p) => ({
      id: p.id,
      date: p.dueDate,
      description: p.studentName.includes('[Clínica ACR]')
        ? `Receita Atendimento Clínico - ${p.studentName.replace('[Clínica ACR] ', '')}`
        : `Receita Mensalidade/Fatura - ${p.studentName}`,
      type: 'Entrada',
      amount: p.amount,
    }))

  // Mock static expenses for demonstration
  const mockExpenses = [
    {
      id: 'e1',
      date: new Date().toISOString(),
      description: 'Pagamento Fornecedor (Luz/Água)',
      type: 'Saída',
      amount: 450.0,
    },
    {
      id: 'e2',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: 'Manutenção Predial',
      type: 'Saída',
      amount: 150.0,
    },
  ]

  const allTransactions = [...dynamicInflows, ...mockExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const totalIn = allTransactions
    .filter((t) => t.type === 'Entrada')
    .reduce((a, b) => a + b.amount, 0)
  const totalOut = allTransactions
    .filter((t) => t.type === 'Saída')
    .reduce((a, b) => a + b.amount, 0)
  const balance = totalIn - totalOut

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análise de entradas, saídas e resultado operacional consolidado com demais módulos.
          </p>
        </div>
        <Button variant="outline" className="shadow-sm">
          <CalIcon className="mr-2 h-4 w-4" /> Selecionar Período
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border/50 relative overflow-hidden">
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
              <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-600">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 relative overflow-hidden">
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
              <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-600">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 relative overflow-hidden bg-primary/5 border-primary/20">
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

      <Card className="shadow-sm border-border/50">
        <CardHeader className="border-b border-border/50 bg-muted/10 py-4">
          <CardTitle className="text-sm font-semibold text-foreground">
            Extrato de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 w-[120px]">Data</TableHead>
                <TableHead>Histórico</TableHead>
                <TableHead>Natureza</TableHead>
                <TableHead className="text-right pr-6">Valor (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/20">
                  <TableCell className="pl-6 text-muted-foreground text-sm">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{t.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        t.type === 'Entrada'
                          ? 'status-success font-medium px-2 py-0'
                          : 'status-danger font-medium px-2 py-0'
                      }
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right pr-6 font-semibold ${t.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'}`}
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
    </div>
  )
}
