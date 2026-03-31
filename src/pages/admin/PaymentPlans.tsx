import { useState } from 'react'
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

export default function PaymentPlans() {
  const { toast } = useToast()
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Mensalidade Padrão',
      target: 'Graduação',
      value: 850,
      installments: 12,
      status: 'Ativo',
    },
    {
      id: 2,
      name: 'Bolsa Integral (100%)',
      target: 'Todos',
      value: 0,
      installments: 12,
      status: 'Ativo',
    },
    {
      id: 3,
      name: 'Desconto Servidor Público',
      target: 'Pós-Graduação',
      value: 600,
      installments: 18,
      status: 'Ativo',
    },
  ])

  const handleDelete = (id: number) => {
    setPlans(plans.filter((p) => p.id !== id))
    toast({
      title: 'Plano removido',
      description: 'O plano de pagamento foi removido com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-zinc-400" />
            Planos de Pagamentos
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Configuração de mensalidades, descontos, bolsas e taxas de serviços da IES.
          </p>
        </div>
        <Button
          onClick={() =>
            toast({ title: 'Novo Plano', description: 'Abrindo formulário de criação de plano...' })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
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
                <TableHead className="text-right">Valor Base (R$)</TableHead>
                <TableHead className="text-center">Qtd. Parcelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.target}</TableCell>
                  <TableCell className="text-right">{plan.value.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{plan.installments}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {plan.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toast({
                          title: 'Editar Plano',
                          description: 'Carregando detalhes do plano...',
                        })
                      }
                    >
                      <Edit className="h-4 w-4 text-zinc-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                    Nenhum plano cadastrado.
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
