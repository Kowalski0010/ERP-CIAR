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
  const { students, enrollStudent, updateStudent, currentUserRole } = useAppStore()
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
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie cadastros detalhados e histórico acadêmico.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
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
              className="text-sm"
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
            {filteredStudents.map((student) => (
              <TableRow
                key={student.id}
                className="group cursor-pointer hover:bg-muted/30"
                onClick={() => {
                  setSelectedStudent(student)
                  setIsSheetOpen(true)
                }}
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
                <TableCell>
                  <Badge
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={(student, plan) => {
          enrollStudent(student, plan)
          toast({
            title: 'Aluno Matriculado',
            description: `${student.name} foi cadastrado e financeiro gerado.`,
          })
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedStudent && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">CPF</p>
                  <p className="font-semibold text-sm">{selectedStudent.cpf || '-'}</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                  <p className="font-semibold text-sm">{selectedStudent.phone || '-'}</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg border col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Endereço</p>
                  <p className="font-semibold text-sm">
                    {selectedStudent.address
                      ? `${selectedStudent.address.street}, ${selectedStudent.address.number} - ${selectedStudent.address.city}/${selectedStudent.address.state}`
                      : 'Não informado'}
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
