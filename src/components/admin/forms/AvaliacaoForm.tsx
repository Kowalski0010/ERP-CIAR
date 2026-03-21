import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export function AvaliacaoForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Avaliação Salva', description: 'Registro de avaliação salvo com sucesso.' })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Nome / Descrição da Avaliação</Label>
        <Input
          required
          placeholder="Ex: Prova N1, Seminário Integrador..."
          className="bg-zinc-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Disciplina Vinculada</Label>
          <Select required>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione a disciplina..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calc">Cálculo Avançado</SelectItem>
              <SelectItem value="eng">Engenharia de Software</SelectItem>
              <SelectItem value="logica">Lógica de Programação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Tipo de Avaliação</Label>
          <Select required>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prova">Prova Escrita</SelectItem>
              <SelectItem value="trabalho">Trabalho / Seminário</SelectItem>
              <SelectItem value="projeto">Projeto Prático</SelectItem>
              <SelectItem value="exame">Exame Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Data de Aplicação / Entrega</Label>
          <Input type="date" required className="bg-zinc-50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Peso / Valor Máximo</Label>
          <Input
            type="number"
            step="0.1"
            max="10"
            min="0"
            required
            placeholder="Ex: 10.0"
            className="bg-zinc-50"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Avaliação
        </Button>
      </div>
    </form>
  )
}
