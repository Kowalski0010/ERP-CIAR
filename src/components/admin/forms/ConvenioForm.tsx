import { useAppStore } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function ConvenioForm({ onCancel }: { onCancel: () => void }) {
  const { addConvenio } = useAppStore()
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addConvenio({
      name: fd.get('name') as string,
      contract: fd.get('contract') as string,
      discount: Number(fd.get('discount')),
      date: fd.get('date') as string,
    })
    toast({
      title: 'Convênio Salvo',
      description: 'Registro de parceria persistido com sucesso.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Nome da Entidade Parceira</Label>
          <Input
            name="name"
            required
            placeholder="Ex: Sindicato dos Bancários"
            className="bg-zinc-50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Número do Contrato / Termo</Label>
          <Input
            name="contract"
            required
            placeholder="Ex: CONV-2023-001"
            className="bg-zinc-50 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Desconto Concedido (%)</Label>
          <Input
            name="discount"
            type="number"
            required
            placeholder="Ex: 15"
            max="100"
            min="0"
            className="bg-zinc-50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">
            Data de Expiração da Vigência
          </Label>
          <Input name="date" type="date" required className="bg-zinc-50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          Detalhes Contratuais e Observações
        </Label>
        <Textarea
          name="notes"
          placeholder="Regras para concessão, limite de alunos beneficiados..."
          className="bg-zinc-50 min-h-[80px] resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Convênio
        </Button>
      </div>
    </form>
  )
}
