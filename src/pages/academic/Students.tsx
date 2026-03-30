import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Student } from '@/lib/types'
import { getStudents, deleteStudent } from '@/services/students'
import { useToast } from '@/hooks/use-toast'
import { StudentForm } from '@/components/academic/StudentForm'

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined)
  const { toast } = useToast()

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os alunos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return
    try {
      await deleteStudent(id)
      toast({ title: 'Sucesso', description: 'Aluno excluído.' })
      fetchStudents()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o aluno.',
        variant: 'destructive',
      })
    }
  }

  const handleOpenSheet = (student?: Student) => {
    setSelectedStudent(student)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setSelectedStudent(undefined)
  }

  const handleSuccess = () => {
    handleCloseSheet()
    fetchStudents()
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cpf?.includes(searchTerm),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">Gerencie o cadastro de alunos da instituição.</p>
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Aluno
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, matrícula ou CPF..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matrícula</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Curso na IES</TableHead>
              <TableHead>Graduação Anterior</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Carregando alunos...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.registrationCode || '-'}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.previousGraduation || '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Ativo'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenSheet(student)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{selectedStudent ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}</SheetTitle>
          </SheetHeader>
          {isSheetOpen && (
            <StudentForm
              initialData={selectedStudent}
              onSuccess={handleSuccess}
              onCancel={handleCloseSheet}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
