import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, PackagePlus, AlertTriangle, ArrowRightLeft } from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function Stock() {
  const { products, addProduct, addStockMovement } = useAppStore()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isMovementOpen, setIsMovementOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addProduct({
      sku: fd.get('sku') as string,
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      currentQuantity: Number(fd.get('currentQuantity')),
      minQuantity: Number(fd.get('minQuantity')),
      unit: fd.get('unit') as string,
      price: Number(fd.get('price')),
    })
    toast({ title: 'Produto Cadastrado', description: 'Item adicionado ao estoque.' })
    setIsAddOpen(false)
  }

  const handleMovementSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedProductId) return
    const fd = new FormData(e.currentTarget)
    const product = products.find((p) => p.id === selectedProductId)

    if (product) {
      addStockMovement({
        productId: product.id,
        productName: product.name,
        type: fd.get('type') as 'Entrada' | 'Saída',
        quantity: Number(fd.get('quantity')),
        user: 'Administrador (Atual)',
        reason: fd.get('reason') as string,
      })
      toast({ title: 'Movimentação Salva', description: 'Estoque atualizado com sucesso.' })
      setIsMovementOpen(false)
      setSelectedProductId('')
    }
  }

  const openMovementForProduct = (id: string) => {
    setSelectedProductId(id)
    setIsMovementOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Estoque e Patrimônio</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Controle de insumos, materiais pedagógicos e equipamentos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="shadow-sm h-9 px-4"
            onClick={() => setIsMovementOpen(true)}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" /> Movimentação Lote
          </Button>
          <Button className="shadow-sm h-9 px-4" onClick={() => setIsAddOpen(true)}>
            <PackagePlus className="mr-2 h-4 w-4" /> Novo Item
          </Button>
        </div>
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
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Descrição do Item</TableHead>
              <TableHead className="w-[180px]">Categoria</TableHead>
              <TableHead className="text-right w-[100px]">Unidade</TableHead>
              <TableHead className="text-right w-[120px]">Qtd. Atual</TableHead>
              <TableHead className="w-[140px] text-center">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((prod) => {
              const isLowStock = prod.currentQuantity <= prod.minQuantity
              return (
                <TableRow key={prod.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <TableCell className="font-mono text-xs text-zinc-500 font-medium">
                    {prod.sku}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900 text-xs">{prod.name}</TableCell>
                  <TableCell className="text-xs text-zinc-600">
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 px-1.5 py-0">
                      {prod.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-zinc-600">{prod.unit}</TableCell>
                  <TableCell className="text-right font-bold text-zinc-900 text-sm">
                    {prod.currentQuantity}
                  </TableCell>
                  <TableCell className="text-center">
                    {isLowStock ? (
                      <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50 text-rose-700 whitespace-nowrap px-1.5 py-0"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" /> Crítico
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700 px-1.5 py-0"
                      >
                        Normal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-blue-600"
                      onClick={() => openMovementForProduct(prod.id)}
                    >
                      Mover
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Novo Item */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Código SKU</Label>
                <Input name="sku" required placeholder="Ex: MAT-002" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label>Unidade de Medida</Label>
                <Select name="unit" defaultValue="Unidade">
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unidade">Unidade (un)</SelectItem>
                    <SelectItem value="Caixa">Caixa (cx)</SelectItem>
                    <SelectItem value="Pacote">Pacote (pct)</SelectItem>
                    <SelectItem value="Litro">Litro (l)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Nome do Item</Label>
              <Input
                name="name"
                required
                placeholder="Ex: Caneta Esferográfica Azul"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select name="category" defaultValue="Material de Escritório">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Material de Escritório">Material de Escritório</SelectItem>
                  <SelectItem value="Pedagógico">Pedagógico / Didático</SelectItem>
                  <SelectItem value="Limpeza">Limpeza e Manutenção</SelectItem>
                  <SelectItem value="TI e Eletrônicos">TI e Eletrônicos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Qtd. Inicial</Label>
                <Input
                  name="currentQuantity"
                  type="number"
                  required
                  defaultValue="0"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Alerta de Estoque Baixo</Label>
                <Input name="minQuantity" type="number" required defaultValue="5" className="h-9" />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Produto</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Movimentação */}
      <Dialog
        open={isMovementOpen}
        onOpenChange={(open) => {
          setIsMovementOpen(open)
          if (!open) setSelectedProductId('')
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Movimentação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMovementSubmit} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Produto</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId} required>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecione o produto..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (Atual: {p.currentQuantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo de Movimento</Label>
                <Select name="type" defaultValue="Entrada">
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada (+)</SelectItem>
                    <SelectItem value="Saída">Saída (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quantidade</Label>
                <Input
                  name="quantity"
                  type="number"
                  required
                  min="1"
                  defaultValue="1"
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Motivo / Observação</Label>
              <Input
                name="reason"
                required
                placeholder="Ex: Compra de suprimentos, Uso na sala..."
                className="h-9"
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMovementOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar Movimento</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
