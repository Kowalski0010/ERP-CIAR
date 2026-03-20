import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, Plus, Star } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Suppliers() {
  const { suppliers } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-200'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Fornecedores</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Cadastro de parceiros comerciais e prestadores.
          </p>
        </div>
        <Button className="shadow-sm h-9 px-4">
          <Plus className="mr-2 h-4 w-4" /> Cadastrar Fornecedor
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por Razão Social..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>Fornecedor</TableHead>
              <TableHead className="w-[160px]">CNPJ</TableHead>
              <TableHead>Contato / Representante</TableHead>
              <TableHead className="w-[140px]">Avaliação</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((sup) => (
              <TableRow key={sup.id} className="hover:bg-zinc-50/80 transition-colors">
                <TableCell className="font-semibold text-zinc-900 text-xs">{sup.name}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{sup.taxId}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-700">{sup.contact}</span>
                    <span className="text-[10px] text-zinc-500">
                      {sup.email} • {sup.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{renderStars(sup.rating)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      sup.status === 'Ativo'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                    }
                  >
                    {sup.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
