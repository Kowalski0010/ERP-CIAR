import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const productSchema = z.object({
  sku: z.string().min(2, 'SKU obrigatório e deve ter no mínimo 2 caracteres'),
  name: z.string().min(3, 'Nome obrigatório'),
  category: z.string().min(1, 'Categoria obrigatória'),
  unit: z.string().min(1, 'Unidade obrigatória'),
  currentQuantity: z.coerce.number().min(0, 'A quantidade não pode ser negativa'),
  minQuantity: z.coerce.number().min(0, 'A quantidade mínima não pode ser negativa'),
  price: z.coerce.number().min(0).default(0),
})

export default function Stock() {
  const { products, addProduct, addStockMovement } = useAppStore()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isMovementOpen, setIsMovementOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>('')

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: '',
      name: '',
      category: 'Material de Escritório',
      unit: 'Unidade',
      currentQuantity: 0,
      minQuantity: 5,
      price: 0,
    },
  })

  useEffect(() => {
    if (isAddOpen) {
      form.reset()
    }
  }, [isAddOpen, form])

  // Global shortcut for opening modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubmit = (data: z.infer<typeof productSchema>) => {
    addProduct({
      sku: data.sku,
      name: data.name,
      category: data.category,
      currentQuantity: data.currentQuantity,
      minQuantity: data.minQuantity,
      unit: data.unit,
      price: data.price,
    })
    toast({ title: 'Produto Cadastrado', description: 'Item adicionado ao estoque com sucesso.' })
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Estoque e Patrimônio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Controle de insumos, materiais pedagógicos e equipamentos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4"
            onClick={() => setIsMovementOpen(true)}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />{' '}
            Movimentação Lote
          </Button>
          <Button
            className="shadow-sm h-10 px-4 group"
            onClick={() => setIsAddOpen(true)}
            title="Atalho: Ctrl + N"
          >
            <PackagePlus className="mr-2 h-4 w-4" /> Novo Item
            <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
              Ctrl+N
            </span>
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            className="pl-9 h-10 bg-muted/50 border-input w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-muted/50">
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
                <TableRow key={prod.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                    {prod.sku}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground text-xs">
                    {prod.name}
                  </TableCell>
                  <TableCell className="text-xs text-foreground/80">
                    <Badge variant="secondary" className="bg-muted text-foreground px-1.5 py-0">
                      {prod.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-foreground/80">
                    {prod.unit}
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground text-sm">
                    {prod.currentQuantity}
                  </TableCell>
                  <TableCell className="text-center">
                    {isLowStock ? (
                      <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 whitespace-nowrap px-1.5 py-0"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" /> Crítico
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0"
                      >
                        Normal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 font-medium"
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: MAT-002" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Medida</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Unidade">Unidade (un)</SelectItem>
                          <SelectItem value="Caixa">Caixa (cx)</SelectItem>
                          <SelectItem value="Pacote">Pacote (pct)</SelectItem>
                          <SelectItem value="Litro">Litro (l)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Caneta Esferográfica Azul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Material de Escritório">
                          Material de Escritório
                        </SelectItem>
                        <SelectItem value="Pedagógico">Pedagógico / Didático</SelectItem>
                        <SelectItem value="Limpeza">Limpeza e Manutenção</SelectItem>
                        <SelectItem value="TI e Eletrônicos">TI e Eletrônicos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qtd. Inicial</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alerta de Baixa</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Produto</Button>
              </div>
            </form>
          </Form>
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
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Registrar Movimentação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMovementSubmit} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Produto</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId} required>
                <SelectTrigger className="h-10">
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
                  <SelectTrigger className="h-10">
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
                  className="h-10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Motivo / Observação</Label>
              <Input
                name="reason"
                required
                placeholder="Ex: Compra de suprimentos, Uso na sala..."
                className="h-10"
              />
            </div>
            <div className="pt-4 flex justify-end gap-2 border-t border-border">
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
