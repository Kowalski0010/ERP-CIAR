import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, PackagePlus, AlertTriangle } from 'lucide-react'
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

export default function Stock() {
  const { products } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Estoque de Materiais</h1>
          <p className="text-sm text-zinc-500 mt-1">Controle de insumos, equipamentos e limpeza.</p>
        </div>
        <Button className="shadow-sm h-9 px-4">
          <PackagePlus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome ou SKU..."
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
              <TableHead className="w-[100px]">Código (SKU)</TableHead>
              <TableHead>Produto / Item</TableHead>
              <TableHead className="w-[180px]">Categoria</TableHead>
              <TableHead className="text-right w-[100px]">Unidade</TableHead>
              <TableHead className="text-right w-[120px]">Qtd. Atual</TableHead>
              <TableHead className="w-[140px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((prod) => {
              const isLowStock = prod.currentQuantity <= prod.minQuantity
              return (
                <TableRow key={prod.id} className="hover:bg-zinc-50/80 transition-colors">
                  <TableCell className="font-mono text-xs text-zinc-500 font-medium">
                    {prod.sku}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900 text-xs">{prod.name}</TableCell>
                  <TableCell className="text-xs text-zinc-600">{prod.category}</TableCell>
                  <TableCell className="text-right text-xs text-zinc-600">{prod.unit}</TableCell>
                  <TableCell className="text-right font-bold text-zinc-900">
                    {prod.currentQuantity}
                  </TableCell>
                  <TableCell className="text-center">
                    {isLowStock ? (
                      <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50 text-rose-700 whitespace-nowrap"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" /> Estoque Baixo
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        Adequado
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
