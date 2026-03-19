import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
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

const mockTransactions = [
  {
    id: 1,
    date: '2023-10-25',
    description: 'Mensalidade - Ana Silva',
    type: 'Entrada',
    amount: 850.0,
  },
  { id: 2, date: '2023-10-24', description: 'Pagamento de Luz/Água', type: 'Saída', amount: 450.0 },
  {
    id: 3,
    date: '2023-10-22',
    description: 'Mensalidade - Carlos Oliveira',
    type: 'Entrada',
    amount: 720.0,
  },
  { id: 4, date: '2023-10-20', description: 'Material de Limpeza', type: 'Saída', amount: 150.0 },
]

export default function CashFlow() {
  const totalIn = mockTransactions
    .filter((t) => t.type === 'Entrada')
    .reduce((a, b) => a + b.amount, 0)
  const totalOut = mockTransactions
    .filter((t) => t.type === 'Saída')
    .reduce((a, b) => a + b.amount, 0)
  const balance = totalIn - totalOut

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fluxo de Caixa</h1>
        <p className="text-muted-foreground mt-1">
          Controle de receitas e despesas administrativas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900 shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 uppercase">
                  Entradas (Mês)
                </p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">
                  R$ {totalIn.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-emerald-200/50 rounded-full text-emerald-700 dark:text-emerald-400">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900 shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-rose-800 dark:text-rose-400 uppercase">
                  Saídas (Mês)
                </p>
                <p className="text-3xl font-bold text-rose-900 dark:text-rose-300">
                  R$ {totalOut.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-rose-200/50 rounded-full text-rose-700 dark:text-rose-400">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-400 uppercase">
                  Saldo Parcial
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                  R$ {balance.toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-blue-200/50 rounded-full text-blue-700 dark:text-blue-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle border-border">
        <CardHeader>
          <CardTitle className="text-lg">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right pr-6">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="pl-6 text-muted-foreground">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        t.type === 'Entrada'
                          ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
                          : 'text-rose-600 border-rose-200 bg-rose-50'
                      }
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right pr-6 font-semibold ${t.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {t.type === 'Entrada' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
