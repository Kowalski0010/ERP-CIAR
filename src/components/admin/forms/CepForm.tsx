import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function CepForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'CEP Registrado',
      description: 'O logradouro foi atualizado no banco de dados local.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          CEP (Código de Endereçamento Postal)
        </Label>
        <Input
          required
          placeholder="00000-000"
          maxLength={9}
          className="bg-zinc-50 w-full sm:w-48 font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          Logradouro (Rua, Avenida, Praça...)
        </Label>
        <Input required placeholder="Ex: Avenida Paulista" className="bg-zinc-50" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Bairro</Label>
        <Input required placeholder="Ex: Bela Vista" className="bg-zinc-50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Cidade</Label>
          <Input required placeholder="Ex: São Paulo" className="bg-zinc-50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">UF (Estado)</Label>
          <Input required placeholder="Ex: SP" maxLength={2} className="bg-zinc-50 uppercase" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Logradouro
        </Button>
      </div>
    </form>
  )
}
