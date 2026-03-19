import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  Plus,
  MoreVertical,
  GraduationCap,
  Mail,
  Calendar,
  Eye,
  Phone,
  MapPin,
  FileText,
  Send,
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
  const { students, addStudent, updateStudent, currentUserRole } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newObs, setNewObs] = useState('')

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.cpf && s.cpf.includes(searchTerm))
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
    setNewObs('')
    setIsSheetOpen(true)
  }

  const handleAddObservation = () => {
    if (!selectedStudent || !newObs.trim()) return

    const obs = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      author: currentUserRole,
      text: newObs.trim(),
    }

    const updatedStudent = {
      ...selectedStudent,
      observations: [obs, ...(selectedStudent.observations || [])],
    }

    updateStudent(selectedStudent.id, updatedStudent)
    setSelectedStudent(updatedStudent)
    setNewObs('')
    toast({ title: 'Observação adicionada com sucesso.' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie cadastros detalhados e histórico acadêmico.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Matricular Aluno
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-subtle p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
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
              <TableHead>Telefone</TableHead>
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
                  <TableCell className="text-muted-foreground">{student.phone || '-'}</TableCell>
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

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={(student) => {
          addStudent(student)
          toast({
            title: 'Aluno Matriculado',
            description: `${student.name} foi cadastrado com sucesso.`,
          })
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Perfil do Aluno</SheetTitle>
            <SheetDescription>Detalhes completos, dados pessoais e observações.</SheetDescription>
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
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {selectedStudent.name}
                    {getStatusBadge(selectedStudent.status)}
                  </h3>
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
                  <p className="font-semibold text-sm truncate">{selectedStudent.course}</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Matrícula
                  </p>
                  <p className="font-semibold text-sm">
                    {new Date(selectedStudent.enrollmentDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Telefone
                  </p>
                  <p className="font-semibold text-sm">
                    {selectedStudent.phone || 'Não informado'}
                  </p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> CPF / RG
                  </p>
                  <p className="font-semibold text-sm">
                    {selectedStudent.cpf || '-'} / {selectedStudent.rg || '-'}
                  </p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border col-span-2">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Endereço
                  </p>
                  <p className="font-semibold text-sm">
                    {selectedStudent.address || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Observações Acadêmicas e Comportamentais
                </h4>

                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar nova observação..."
                    value={newObs}
                    onChange={(e) => setNewObs(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddObservation()}
                  />
                  <Button size="icon" onClick={handleAddObservation} disabled={!newObs.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3 mt-4">
                  {selectedStudent.observations && selectedStudent.observations.length > 0 ? (
                    selectedStudent.observations.map((obs) => (
                      <div
                        key={obs.id}
                        className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-blue-800 dark:text-blue-300 font-medium text-xs">
                            {obs.author}
                          </p>
                          <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">
                            {new Date(obs.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-foreground/90 text-sm">{obs.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-dashed">
                      Nenhuma observação registrada.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
