import { useState, useEffect } from 'react'
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function PaymentPlans() {
  const { toast } = useToast()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', target: '', value: '', installments: '12' })

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        setPlans(data)
      } else {
        setPlans([
          {
            id: '1',
            name: 'Mensalidade Padrão',
            target: 'Graduação',
            value: 850,
            installments: 12,
            status: 'Ativo',
          },
        ])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('payment_plans').delete().eq('id', id)
      setPlans(plans.filter((p) => p.id !== id))
      toast({ title: 'Plano removido', description: 'Removido com sucesso do banco.' })
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível remover.' })
    }
  }

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      target: formData.target,
      value: Number(formData.value) || 0,
      installments: Number(formData.installments) || 1,
      status: 'Ativo',
    }
    try {
      if (editing?.id) {
        const { data, error } = await supabase
          .from('payment_plans')
          .update(payload)
          .eq('id', editing.id)
          .select()
          .single()
        if (error) throw error
        setPlans(plans.map((p) => (p.id === editing.id ? data : p)))
      } else {
        const { data, error } = await supabase
          .from('payment_plans')
          .insert([payload])
          .select()
          .single()
        if (error) throw error
        setPlans([data, ...plans])
      }
      toast({ title: 'Sucesso', description: 'Plano financeiro salvo.' })
      setOpen(false)
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao salvar.' })
    }
  }

  const openForm = (p?: any) => {
    setEditing(p || null)
    if (p) {
      setFormData({
        name: p.name,
        target: p.target,
        value: p.value.toString(),
        installments: p.installments.toString(),
      })
    } else {
      setFormData({ name: '', target: '', value: '', installments: '12' })
    }
    setOpen(true)
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
            Configuração de mensalidades e bolsas conectada ao banco de dados.
          </p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-2" /> Novo Plano
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
          <CardTitle className="text-lg">Modelos Financeiros</CardTitle>
          <CardDescription className="text-xs">Regras ativas.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/80">
              <TableRow>
                <TableHead>Nome do Plano</TableHead>
                <TableHead>Vínculo</TableHead>
                <TableHead className="text-right">Valor Base (R$)</TableHead>
                <TableHead className="text-center">Parcelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.target}</TableCell>
                    <TableCell className="text-right">{Number(plan.value).toFixed(2)}</TableCell>
                    <TableCell className="text-center">{plan.installments}</TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {plan.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openForm(plan)}>
                        <Edit className="h-4 w-4 text-zinc-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && plans.length === 0 && (
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Nome do Plano</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Mensalidade Padrão"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Público / Vínculo</label>
              <Input
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="Ex: Graduação"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valor Base (R$)</label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="850.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Qtd. Parcelas</label>
              <Input
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                placeholder="12"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
