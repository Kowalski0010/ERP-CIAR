import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
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
  const { addAvaliacao, disciplinas } = useAppStore()
  const { toast } = useToast()

  const [subject, setSubject] = useState('')
  const [type, setType] = useState('Prova Escrita')

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addAvaliacao({
      name: fd.get('name') as string,
      subject: subject || 'Geral',
      type,
      date: fd.get('date') as string,
    })
    toast({
      title: 'Avaliação Salva',
      description: 'Registro de avaliação persistido com sucesso.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Nome / Descrição da Avaliação</Label>
        <Input
          name="name"
          required
          placeholder="Ex: Prova N1, Seminário Integrador..."
          className="bg-zinc-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Disciplina Vinculada</Label>
          <Select required value={subject} onValueChange={setSubject}>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione a disciplina..." />
            </SelectTrigger>
            <SelectContent>
              {disciplinas.length > 0 ? (
                disciplinas.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="Cálculo Avançado">Cálculo Avançado</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Tipo de Avaliação</Label>
          <Select required value={type} onValueChange={setType}>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prova Escrita">Prova Escrita</SelectItem>
              <SelectItem value="Trabalho / Seminário">Trabalho / Seminário</SelectItem>
              <SelectItem value="Projeto Prático">Projeto Prático</SelectItem>
              <SelectItem value="Exame Final">Exame Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Data de Aplicação / Entrega</Label>
          <Input name="date" type="date" required className="bg-zinc-50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Peso / Valor Máximo</Label>
          <Input
            name="weight"
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
