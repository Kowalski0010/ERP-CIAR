import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export function CursoForm({ onCancel }: { onCancel: () => void }) {
  const { addCurso } = useAppStore()
  const { toast } = useToast()
  const [mode, setMode] = useState('Presencial')

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addCurso({
      name: fd.get('name') as string,
      mode,
      duration: Number(fd.get('duration')),
      description: fd.get('description') as string,
    })
    toast({
      title: 'Curso Salvo',
      description: 'Novo curso registrado e persistido com sucesso no sistema.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Nome do Curso</Label>
        <Input
          name="name"
          required
          placeholder="Ex: Bacharelado em Engenharia de Software"
          className="bg-zinc-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Modalidade</Label>
          <Select required value={mode} onValueChange={setMode}>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione a modalidade..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="EAD">EAD</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">
            Duração / Carga Horária Total (H)
          </Label>
          <Input
            name="duration"
            type="number"
            required
            placeholder="Ex: 3600"
            className="bg-zinc-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Descrição / Perfil do Egresso</Label>
        <Textarea
          name="description"
          required
          placeholder="Detalhes e objetivos principais do curso..."
          className="bg-zinc-50 min-h-[100px] resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Registro de Curso
        </Button>
      </div>
    </form>
  )
}
