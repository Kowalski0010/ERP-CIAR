import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function ConvenioForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Convênio Salvo',
      description: 'Registro de convênio ou parceria cadastrado com sucesso.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          Nome da Instituição / Empresa Parceira
        </Label>
        <Input required placeholder="Ex: Sindicato dos Bancários" className="bg-zinc-50" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Número do Contrato / Termo</Label>
        <Input required placeholder="Ex: CONV-2023-001" className="bg-zinc-50 font-mono" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Data de Início da Vigência</Label>
          <Input type="date" required className="bg-zinc-50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Data de Término da Vigência</Label>
          <Input type="date" required className="bg-zinc-50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          Benefício (Percentual de Desconto ou Valor Bruto)
        </Label>
        <Input
          required
          placeholder="Ex: 15% ou R$ 200,00 off na mensalidade"
          className="bg-zinc-50"
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
