import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, Plus, MoreVertical, GraduationCap, Mail, Calendar, Eye } from 'lucide-react'
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

export default function Students() {
  const { students } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'Todos' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge className="status-success border-none">Ativo</Badge>
      case 'Inativo':
        return <Badge className="status-danger border-none">Inativo</Badge>
      case 'Formado':
        return <Badge className="status-info border-none">Formado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const openStudentDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsSheetOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Alunos</h1>
          <p className="text-muted-foreground">Gerencie matrículas e o histórico acadêmico.</p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Matricular Aluno
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-subtle p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['Todos', 'Ativo', 'Inativo', 'Formado'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'secondary' : 'ghost'}
              onClick={() => setFilterStatus(status)}
              className="text-sm font-medium"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Data Matrícula</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="group cursor-pointer hover:bg-muted/30"
                  onClick={() => openStudentDetails(student)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{student.course}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(student.enrollmentDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openStudentDetails(student)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" /> Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Inativar Matrícula
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Perfil do Aluno</SheetTitle>
            <SheetDescription>Detalhes completos e histórico acadêmico.</SheetDescription>
          </SheetHeader>

          {selectedStudent && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedStudent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> {selectedStudent.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" /> Curso
                  </p>
                  <p className="font-semibold text-sm">{selectedStudent.course}</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Matrícula
                  </p>
                  <p className="font-semibold text-sm">
                    {new Date(selectedStudent.enrollmentDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Status Atual
                </h4>
                <div>{getStatusBadge(selectedStudent.status)}</div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Observações Recentes
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm">
                  <p className="text-blue-800 dark:text-blue-300 font-medium">Bom desempenho</p>
                  <p className="text-blue-600/80 dark:text-blue-400/80 text-xs mt-1">
                    Aluno tem participado ativamente das aulas práticas. - Prof. Marcos
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
