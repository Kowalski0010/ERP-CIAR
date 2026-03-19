import { useState, useMemo } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  Plus,
  MoreHorizontal,
  SlidersHorizontal,
  UserX,
  GraduationCap,
  AlertCircle,
  Users,
  FileText,
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
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddStudentDialog } from '@/components/AddStudentDialog'
import { useToast } from '@/hooks/use-toast'

export default function Students() {
  const { students, payments, enrollStudent, generateInvoice } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const studentsWithFinance = useMemo(() => {
    return students.map((s) => {
      const studentPayments = payments.filter((p) => p.studentId === s.id)
      const hasLate = studentPayments.some((p) => p.status === 'Atrasado')
      return { ...s, financialStatus: hasLate ? 'Inadimplente' : 'Regular' }
    })
  }, [students, payments])

  const filteredStudents = studentsWithFinance.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.cpf && s.cpf.includes(searchTerm))
    const matchesStatus = filterStatus === 'Todos' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleGenerateInvoice = (studentId: string, name: string) => {
    generateInvoice(studentId, 850) // Default amount for mock
    toast({
      title: 'Fatura Gerada',
      description: `Um novo boleto foi emitido para ${name} e adicionado ao financeiro.`,
    })
  }

  const totalActive = students.filter((s) => s.status === 'Ativo').length
  const totalGraduated = students.filter((s) => s.status === 'Formado').length
  const totalLate = studentsWithFinance.filter((s) => s.financialStatus === 'Inadimplente').length

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Alunos</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestão de matrículas, documentação e histórico de discentes.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-sm h-9 px-4">
          <Plus className="mr-2 h-4 w-4" /> Nova Matrícula
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-zinc-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Matrículas Ativas
              </p>
              <p className="text-2xl font-bold text-zinc-900">{totalActive}</p>
            </div>
            <div className="p-2 rounded-md bg-zinc-100 text-zinc-700">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-zinc-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Egressos (Formados)
              </p>
              <p className="text-2xl font-bold text-zinc-900">{totalGraduated}</p>
            </div>
            <div className="p-2 rounded-md bg-zinc-100 text-zinc-700">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-zinc-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Inadimplência
              </p>
              <p className="text-2xl font-bold text-zinc-900">{totalLate}</p>
            </div>
            <div className="p-2 rounded-md bg-rose-50 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            title="Filtros Avançados"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <div className="flex bg-zinc-100 p-1 rounded-md shrink-0">
            {['Todos', 'Ativo', 'Inativo', 'Formado'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`text-[11px] h-7 px-3 font-medium ${filterStatus === status ? 'shadow-sm bg-white' : 'text-zinc-500'}`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        {filteredStudents.length > 0 ? (
          <Table className="table-compact">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-zinc-50/50">
                <TableHead className="w-[280px]">Aluno / Contato</TableHead>
                <TableHead className="w-[140px]">Documento (CPF)</TableHead>
                <TableHead>Curso Vinculado</TableHead>
                <TableHead className="w-[120px]">Status Acadêmico</TableHead>
                <TableHead className="w-[140px]">Situação Financeira</TableHead>
                <TableHead className="text-right w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="group hover:bg-zinc-50/80 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 rounded-sm border border-zinc-200">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-zinc-100 text-zinc-900 text-[10px] font-semibold rounded-sm">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-zinc-900 truncate">{student.name}</span>
                        <span className="text-[10px] text-zinc-500 truncate">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-zinc-600">
                    {student.cpf || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-zinc-700">{student.course}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        student.status === 'Ativo'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : student.status === 'Inativo'
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        student.financialStatus === 'Regular'
                          ? 'border-transparent bg-transparent text-emerald-600'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }
                    >
                      {student.financialStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right p-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuLabel className="text-xs">Opções</DropdownMenuLabel>
                        <DropdownMenuItem className="text-xs">Ficha Completa</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">Histórico Escolar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-xs font-medium text-blue-600 focus:text-blue-700 cursor-pointer flex items-center gap-2"
                          onClick={() => handleGenerateInvoice(student.id, student.name)}
                        >
                          <FileText className="w-3.5 h-3.5" /> Gerar Fatura / Boleto
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs text-destructive focus:text-destructive">
                          Bloquear Matrícula
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50">
            <div className="h-12 w-12 bg-white border border-zinc-200 rounded-lg flex items-center justify-center mb-3 shadow-sm">
              <UserX className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">Nenhum registro encontrado</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Não encontramos alunos para os filtros aplicados. Tente ajustar a busca.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-8 text-xs"
              onClick={() => setSearchTerm('')}
            >
              Limpar Filtros
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
    </div>
  )
}
