import { useState, useMemo, useEffect } from 'react'
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
  Download,
  FileSpreadsheet,
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

  // Global shortcut for opening modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsAddDialogOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const handleExport = (type: string) => {
    toast({
      title: `Exportando ${type}`,
      description: `Gerando arquivo ${type} da lista de alunos. O download iniciará em breve.`,
    })
  }

  const totalActive = students.filter((s) => s.status === 'Ativo').length
  const totalGraduated = students.filter((s) => s.status === 'Formado').length
  const totalLate = studentsWithFinance.filter((s) => s.financialStatus === 'Inadimplente').length

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Alunos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de matrículas, documentação e histórico de discentes.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0"
            onClick={() => handleExport('Excel')}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />{' '}
            Excel
          </Button>
          <Button
            variant="outline"
            className="shadow-sm h-10 px-4 text-xs font-semibold shrink-0"
            onClick={() => handleExport('PDF')}
          >
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="shadow-sm h-10 px-4 shrink-0 font-semibold group"
            title="Atalho: Ctrl + N"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Matrícula
            <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
              Ctrl+N
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Matrículas Ativas
              </p>
              <p className="text-2xl font-bold text-foreground">{totalActive}</p>
            </div>
            <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Egressos (Formados)
              </p>
              <p className="text-2xl font-bold text-foreground">{totalGraduated}</p>
            </div>
            <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Inadimplência
              </p>
              <p className="text-2xl font-bold text-foreground">{totalLate}</p>
            </div>
            <div className="p-2 rounded-md bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            className="pl-9 h-10 bg-muted/50 border-input focus-visible:border-ring w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 border-border"
            title="Filtros Avançados"
          >
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div className="flex bg-muted/50 p-1.5 rounded-md shrink-0 border border-border">
            {['Todos', 'Ativo', 'Inativo', 'Formado'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`text-xs h-7 px-3 font-semibold transition-colors ${filterStatus === status ? 'shadow-sm bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="table-compact">
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
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
                  <TableRow key={student.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded border border-border shadow-sm">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-muted text-foreground text-xs font-bold rounded">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground text-sm truncate">
                            {student.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {student.cpf || 'Não informado'}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-foreground/80">
                        {student.course}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          student.status === 'Ativo'
                            ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                            : student.status === 'Inativo'
                              ? 'border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
                              : 'border-border bg-muted/50 text-muted-foreground'
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
                            ? 'border-transparent bg-transparent text-emerald-600 dark:text-emerald-400'
                            : 'border-amber-200 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                        }
                      >
                        {student.financialStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-widest">
                            Opções de Matrícula
                          </DropdownMenuLabel>
                          <DropdownMenuItem className="text-sm font-medium cursor-pointer">
                            Ficha Completa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-sm font-medium cursor-pointer">
                            Histórico Escolar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 focus:text-blue-700 dark:focus:text-blue-300 focus:bg-blue-50 dark:focus:bg-blue-950/50 cursor-pointer flex items-center gap-2"
                            onClick={() => handleGenerateInvoice(student.id, student.name)}
                          >
                            <FileText className="w-4 h-4" /> Gerar Fatura / Boleto
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-sm font-medium text-rose-600 dark:text-rose-400 focus:text-rose-700 dark:focus:text-rose-300 focus:bg-rose-50 dark:focus:bg-rose-950/50 cursor-pointer">
                            Bloquear Matrícula
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/10">
            <div className="h-12 w-12 bg-background border border-border rounded-lg flex items-center justify-center mb-3 shadow-sm">
              <UserX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Nenhum registro encontrado</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Não encontramos alunos para os filtros aplicados. Tente ajustar a busca.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-9 text-xs"
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
