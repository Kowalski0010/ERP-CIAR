import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  PackagePlus,
  AlertTriangle,
  ArrowRightLeft,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { Product } from '@/lib/types'

const productSchema = z.object({
  sku: z.string().min(2, 'Obrigatório'),
  name: z.string().min(3, 'Obrigatório'),
  category: z.string().min(1, 'Obrigatório'),
  unit: z.string().min(1, 'Obrigatório'),
  currentQuantity: z.coerce.number().min(0),
  minQuantity: z.coerce.number().min(0),
  price: z.coerce.number().min(0).default(0),
})

export default function Stock() {
  const { products, addProduct, updateProduct, deleteProduct, addStockMovement } = useAppStore()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isMovementOpen, setIsMovementOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [editItem, setEditItem] = useState<Product | null>(null)
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    destructive: false,
  })

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
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
    if (!isFormOpen) {
      setEditItem(null)
      form.reset({
        sku: '',
        name: '',
        category: 'Material de Escritório',
        unit: 'Unidade',
        currentQuantity: 0,
        minQuantity: 5,
        price: 0,
      })
    }
  }, [isFormOpen, form])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsFormOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const confirmAction = (
    title: string,
    description: string,
    onConfirm: () => void,
    destructive = false,
  ) => {
    setConfirmState({ open: true, title, description, onConfirm, destructive })
  }

  const handleEditClick = (p: Product) => {
    setEditItem(p)
    form.reset({
      sku: p.sku,
      name: p.name,
      category: p.category,
      unit: p.unit,
      currentQuantity: p.currentQuantity,
      minQuantity: p.minQuantity,
      price: p.price,
    })
    setIsFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    confirmAction(
      'Excluir Produto',
      'Deseja remover permanentemente este item do estoque?',
      () => {
        deleteProduct(id)
        toast({ title: 'Excluído', description: 'Produto removido com sucesso.' })
      },
      true,
    )
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFormSubmit = (data: z.infer<typeof productSchema>) => {
    if (editItem) {
      confirmAction('Confirmar Edição', 'Salvar alterações deste produto?', () => {
        updateProduct(editItem.id, data)
        toast({ title: 'Produto Atualizado', description: 'As alterações foram salvas.' })
        setIsFormOpen(false)
      })
    } else {
      addProduct(data)
      toast({ title: 'Produto Cadastrado', description: 'Item adicionado ao estoque.' })
      setIsFormOpen(false)
    }
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
        user: 'Administrador',
        reason: fd.get('reason') as string,
      })
      toast({ title: 'Movimentação Salva', description: 'Estoque atualizado com sucesso.' })
      setIsMovementOpen(false)
      setSelectedProductId('')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque e Patrimônio</h1>
          <p className="text-sm text-muted-foreground mt-1">Controle de insumos e equipamentos.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4"
            onClick={() => setIsMovementOpen(true)}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" /> Movimentação
          </Button>
          <Button
            className="shadow-sm h-10 px-4 group"
            onClick={() => setIsFormOpen(true)}
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
            className="pl-9 h-10 bg-muted/50 text-sm w-full"
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
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[180px]">Categoria</TableHead>
              <TableHead className="text-right w-[100px]">Unidade</TableHead>
              <TableHead className="text-right w-[120px]">Qtd. Atual</TableHead>
              <TableHead className="w-[140px] text-center">Status</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((prod) => {
              const isLowStock = prod.currentQuantity <= prod.minQuantity
              return (
                <TableRow key={prod.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {prod.sku}
                  </TableCell>
                  <TableCell className="font-semibold text-xs">{prod.name}</TableCell>
                  <TableCell className="text-xs text-foreground/80">
                    <Badge variant="secondary" className="px-1.5 py-0">
                      {prod.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-foreground/80">
                    {prod.unit}
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm">
                    {prod.currentQuantity}
                  </TableCell>
                  <TableCell className="text-center">
                    {isLowStock ? (
                      <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50 text-rose-700 px-1.5 py-0"
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
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-600"
                        title="Movimentar"
                        onClick={() => {
                          setSelectedProductId(prod.id)
                          setIsMovementOpen(true)
                        }}
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(prod)}>
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(prod.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Produto' : 'Cadastrar Produto'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Unidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Unidade">Unidade</SelectItem>
                          <SelectItem value="Caixa">Caixa</SelectItem>
                          <SelectItem value="Pacote">Pacote</SelectItem>
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
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Material de Escritório">
                          Material de Escritório
                        </SelectItem>
                        <SelectItem value="Pedagógico">Pedagógico</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
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
                      <FormLabel>Qtd. Atual</FormLabel>
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
                      <FormLabel>Alerta Mínimo</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isMovementOpen}
        onOpenChange={(open) => {
          setIsMovementOpen(open)
          if (!open) setSelectedProductId('')
        }}
      >
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Movimentação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMovementSubmit} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Produto</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.currentQuantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select name="type" defaultValue="Entrada">
                  <SelectTrigger>
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
                <Input name="quantity" type="number" required min="1" defaultValue="1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Motivo</Label>
              <Input name="reason" required />
            </div>
            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsMovementOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmActionDialog
        {...confirmState}
        onOpenChange={(open) => setConfirmState((p) => ({ ...p, open }))}
      />
    </div>
  )
}
