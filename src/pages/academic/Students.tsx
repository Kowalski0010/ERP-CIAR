import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  Plus,
  MoreHorizontal,
  GraduationCap,
  Edit,
  Eye,
  Trash2,
  SlidersHorizontal,
  UserX,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Student } from '@/lib/types'
import { AddStudentDialog } from '@/components/AddStudentDialog'
import { useToast } from '@/hooks/use-toast'

export default function Students() {
  const { students, enrollStudent, updateStudent } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.cpf && s.cpf.includes(searchTerm))
    const matchesStatus = filterStatus === 'Todos' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de matrículas e histórico de discentes.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nova Matrícula
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            className="pl-9 bg-background w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button variant="outline" size="icon" className="shrink-0" title="Filtros Avançados">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <div className="flex bg-muted/50 p-1 rounded-md shrink-0">
            {['Todos', 'Ativo', 'Inativo', 'Formado'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`text-xs h-7 px-3 ${filterStatus === status ? 'shadow-sm bg-background' : ''}`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
        {filteredStudents.length > 0 ? (
          <Table className="table-compact">
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Nome do Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{student.course}</TableCell>
                  <TableCell className="text-muted-foreground">{student.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        student.status === 'Ativo'
                          ? 'status-success'
                          : student.status === 'Inativo'
                            ? 'status-danger'
                            : 'status-info'
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedStudent(student)
                            setIsSheetOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4 text-muted-foreground" /> Editar Registro
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Desativar Aluno
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <UserX className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Nenhum aluno encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Não encontramos resultados para sua busca. Tente ajustar os filtros ou cadastrar um
              novo aluno.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
              Limpar Busca
            </Button>
          </div>
        )}
      </div>

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={(student, plan) => {
          enrollStudent(student, plan)
          toast({
            title: 'Matrícula Concluída',
            description: `O aluno ${student.name} foi registrado no sistema.`,
          })
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md w-full p-0 overflow-hidden flex flex-col">
          {selectedStudent && (
            <>
              <div className="bg-muted/30 p-6 border-b shrink-0 flex items-start gap-4">
                <Avatar className="h-16 w-16 border bg-background shadow-sm">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedStudent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${selectedStudent.status === 'Ativo' ? 'status-success' : 'status-danger'}`}
                  >
                    {selectedStudent.status}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Informações Acadêmicas
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Curso</p>
                      <p className="font-medium">{selectedStudent.course}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Data de Matrícula</p>
                      <p className="font-medium">
                        {new Date(selectedStudent.enrollmentDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Documentação e Contato
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg border border-border/50">
                    <div>
                      <p className="text-muted-foreground mb-1">CPF</p>
                      <p className="font-medium">{selectedStudent.cpf || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Telefone</p>
                      <p className="font-medium">{selectedStudent.phone || '-'}</p>
                    </div>
                    <div className="col-span-2 mt-2">
                      <p className="text-muted-foreground mb-1">Endereço Principal</p>
                      <p className="font-medium">
                        {selectedStudent.address
                          ? `${selectedStudent.address.street}, ${selectedStudent.address.number} - ${selectedStudent.address.city}/${selectedStudent.address.state}`
                          : 'Não cadastrado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t bg-muted/10 shrink-0">
                <Button className="w-full" variant="outline">
                  Ver Histórico Completo
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
