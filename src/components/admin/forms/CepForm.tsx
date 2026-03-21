import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Search } from 'lucide-react'

export function CepForm({ onCancel }: { onCancel: () => void }) {
  const { addCep } = useAppStore()
  const { toast } = useToast()

  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2')
    setCep(val)
  }

  const handleSearchCep = () => {
    if (cep.length === 9) {
      // Mock API call behavior
      setStreet('Avenida Paulista')
      setNeighborhood('Bela Vista')
      setCity('São Paulo')
      setState('SP')
      toast({ title: 'CEP Encontrado', description: 'Endereço preenchido automaticamente.' })
    } else {
      toast({
        variant: 'destructive',
        title: 'CEP Inválido',
        description: 'Digite um CEP no formato 00000-000.',
      })
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    addCep({
      cep,
      street,
      neighborhood,
      city,
      state,
    })
    toast({
      title: 'Endereço Registrado',
      description: 'O logradouro foi persistido no banco de dados local.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          CEP (Código de Endereçamento Postal)
        </Label>
        <div className="flex gap-2 w-full sm:w-64">
          <Input
            required
            placeholder="00000-000"
            maxLength={9}
            value={cep}
            onChange={handleCepChange}
            className="bg-zinc-50 font-mono"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleSearchCep}
            className="px-3 shrink-0 shadow-sm"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          Logradouro (Rua, Avenida, Praça...)
        </Label>
        <Input
          required
          placeholder="Ex: Avenida Paulista"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="bg-zinc-50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Bairro</Label>
        <Input
          required
          placeholder="Ex: Bela Vista"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="bg-zinc-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Cidade</Label>
          <Input
            required
            placeholder="Ex: São Paulo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-zinc-50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">UF (Estado)</Label>
          <Input
            required
            placeholder="Ex: SP"
            maxLength={2}
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            className="bg-zinc-50 uppercase"
          />
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
