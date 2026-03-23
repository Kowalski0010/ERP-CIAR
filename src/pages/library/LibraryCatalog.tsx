import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import { BookOpen, Search, Plus, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const bookSchema = z.object({
  title: z.string().min(2, 'O título é obrigatório'),
  author: z.string().min(2, 'O autor é obrigatório'),
  isbn: z.string().min(5, 'O ISBN é obrigatório'),
  totalCopies: z.coerce.number().min(1, 'Adicione pelo menos 1 cópia'),
})

export default function LibraryCatalog() {
  const { books, addBook } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      totalCopies: 1,
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

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.includes(searchTerm),
  )

  const handleAddSubmit = (data: z.infer<typeof bookSchema>) => {
    addBook({
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      totalCopies: data.totalCopies,
      availableCopies: data.totalCopies,
      coverUrl: 'https://img.usecurling.com/p/200/300?q=book&color=blue',
    })
    toast({ title: 'Livro Cadastrado', description: 'Título adicionado ao acervo com sucesso.' })
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-zinc-400" />
            Catálogo do Acervo
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestão de livros e disponibilidade da biblioteca.
          </p>
        </div>
        <Button
          className="shadow-sm h-10 px-4 group"
          onClick={() => setIsAddOpen(true)}
          title="Atalho: Ctrl + N"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Título
          <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
            Ctrl+N
          </span>
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar título, autor ou ISBN..."
            className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus-visible:border-zinc-300 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="h-10 px-4">
          <Filter className="h-4 w-4 mr-2" /> Filtrar
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Cód/ISBN</TableHead>
              <TableHead>Título e Autor</TableHead>
              <TableHead className="text-center w-[120px]">Total Exemplares</TableHead>
              <TableHead className="text-center w-[120px]">Disponíveis</TableHead>
              <TableHead className="w-[120px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((b) => (
              <TableRow key={b.id} className="hover:bg-zinc-50/50 transition-colors">
                <TableCell className="font-mono text-xs text-zinc-500">{b.isbn}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {b.coverUrl && (
                      <img
                        src={b.coverUrl}
                        alt="capa"
                        className="w-8 h-10 object-cover rounded shadow-sm border border-zinc-200"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 text-sm">{b.title}</span>
                      <span className="text-xs text-zinc-500">{b.author}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">{b.totalCopies}</TableCell>
                <TableCell className="text-center font-bold text-blue-600">
                  {b.availableCopies}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      b.availableCopies > 0
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-rose-200 bg-rose-50 text-rose-700'
                    }
                  >
                    {b.availableCopies > 0 ? 'Disponível' : 'Indisponível'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filteredBooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                  Nenhum livro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Livro</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Obra</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Clean Architecture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Robert C. Martin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 978-000000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalCopies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total de Cópias</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Título</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
