import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function PaymentPlans() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-zinc-400" />
          Planos de Pagamentos
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Configuração de mensalidades, descontos, bolsas e taxas de serviços da IES.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
          <CardTitle className="text-lg">Modelos Financeiros</CardTitle>
          <CardDescription className="text-xs">
            Regras ativas de parcelamento e cobrança.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/80">
              <TableRow>
                <TableHead>Nome do Plano</TableHead>
                <TableHead>Vínculo</TableHead>
                <TableHead className="text-right">Valor Base</TableHead>
                <TableHead className="text-center">Qtd. Parcelas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                  Nenhum plano cadastrado.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
