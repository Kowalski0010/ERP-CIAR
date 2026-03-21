import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Bookmark, Search, Plus, RotateCcw, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LibraryLoans() {
  const { loans, books, students, addLoan, returnLoan } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Form states
  const [selBook, setSelBook] = useState('')
  const [selStudent, setSelStudent] = useState('')

  const filteredLoans = loans.filter(
    (l) =>
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selBook || !selStudent) return

    const book = books.find((b) => b.id === selBook)
    const student = students.find((s) => s.id === selStudent)

    if (book && student) {
      addLoan({
        bookId: book.id,
        bookTitle: book.title,
        studentId: student.id,
        studentName: student.name,
        loanDate: new Date().toISOString(),
        expectedReturnDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days
      })
      toast({ title: 'Empréstimo Registrado', description: 'O prazo de devolução é de 14 dias.' })
      setIsAddOpen(false)
      setSelBook('')
      setSelStudent('')
    }
  }

  const handleReturn = (id: string, expected: string) => {
    const isLate = new Date() > new Date(expected)
    returnLoan(id)
    if (isLate) {
      toast({
        variant: 'destructive',
        title: 'Atraso na Devolução',
        description: 'O sistema financeiro foi notificado e uma multa de R$ 15,00 foi gerada.',
      })
    } else {
      toast({ title: 'Livro Devolvido', description: 'Estoque atualizado e empréstimo encerrado.' })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Bookmark className="h-7 w-7 text-zinc-400" />
            Controle de Empréstimos
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Registro de saídas, devoluções e multas automáticas por atraso.
          </p>
        </div>
        <Button className="shadow-sm h-10 px-4" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Registrar Empréstimo
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por aluno ou livro..."
            className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus-visible:border-zinc-300 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead>Livro Retirado</TableHead>
              <TableHead>Aluno / Requerente</TableHead>
              <TableHead className="w-[140px]">Data Retirada</TableHead>
              <TableHead className="w-[140px]">Prev. Devolução</TableHead>
              <TableHead className="w-[120px] text-center">Status</TableHead>
              <TableHead className="text-right w-[120px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((l) => {
              const isLate = l.status === 'Ativo' && new Date() > new Date(l.expectedReturnDate)
              return (
                <TableRow key={l.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-semibold text-zinc-900 text-sm">
                    {l.bookTitle}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-700">{l.studentName}</TableCell>
                  <TableCell className="text-xs text-zinc-500">
                    {new Date(l.loanDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell
                    className={`text-xs font-semibold ${isLate ? 'text-rose-600' : 'text-zinc-600'}`}
                  >
                    {new Date(l.expectedReturnDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">
                    {l.status === 'Devolvido' ? (
                      <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-500">
                        Devolvido
                      </Badge>
                    ) : isLate ? (
                      <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Atrasado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                        Em Aberto
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {l.status === 'Ativo' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-medium"
                        onClick={() => handleReturn(l.id, l.expectedReturnDate)}
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" /> Devolver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredLoans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  Nenhum registro de empréstimo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Empréstimo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Aluno</Label>
              <Select value={selStudent} onValueChange={setSelStudent} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aluno..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Livro</Label>
              <Select value={selBook} onValueChange={setSelBook} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o livro..." />
                </SelectTrigger>
                <SelectContent>
                  {books
                    .filter((b) => b.availableCopies > 0)
                    .map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title} ({b.availableCopies} disp.)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar Empréstimo</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
