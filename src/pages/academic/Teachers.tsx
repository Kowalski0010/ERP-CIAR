import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, Plus, MoreHorizontal, Clock, UserX, Briefcase, Award } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddTeacherDialog } from '@/components/AddTeacherDialog'
import { useToast } from '@/hooks/use-toast'

export default function Teachers() {
  const { teachers, addTeacher } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalTeachers = teachers.length
  const activeTeachers = teachers.filter((t) => t.status === 'Ativo').length
  const totalWorkload = teachers.reduce((acc, curr) => acc + curr.workload, 0)

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Corpo Docente</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestão de professores, especialidades e alocação de carga horária.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shadow-sm h-9 px-4">
          <Plus className="mr-2 h-4 w-4" /> Novo Docente
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-zinc-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Total Registrados
              </p>
              <p className="text-2xl font-bold text-zinc-900">{totalTeachers}</p>
            </div>
            <div className="p-2 rounded-md bg-zinc-100 text-zinc-700">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-zinc-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Docentes Ativos
              </p>
              <p className="text-2xl font-bold text-zinc-900">{activeTeachers}</p>
            </div>
            <div className="p-2 rounded-md bg-zinc-100 text-zinc-700">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-zinc-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Carga Horária Semanal
              </p>
              <p className="text-2xl font-bold text-zinc-900">{totalWorkload}h</p>
            </div>
            <div className="p-2 rounded-md bg-zinc-100 text-zinc-700">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-2 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome ou disciplina..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <Table className="table-compact">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Docente</TableHead>
                <TableHead className="w-[140px]">Documento (CPF)</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead className="w-[120px]">Carga Semanal</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((teacher) => (
                <TableRow key={teacher.id} className="group hover:bg-zinc-50/80 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 rounded-sm border border-zinc-200">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback className="bg-zinc-100 text-zinc-900 text-[10px] font-semibold rounded-sm">
                          {teacher.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-zinc-900 truncate">{teacher.name}</span>
                        <span className="text-[10px] text-zinc-500 truncate">{teacher.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-zinc-600">
                    {teacher.cpf || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {teacher.subjects.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="font-medium text-[10px] py-0 px-1.5 bg-zinc-100 text-zinc-700 border-transparent"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" /> {teacher.workload}h
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={teacher.status === 'Ativo' ? 'status-success' : 'status-neutral'}
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                    </Button>
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
            <h3 className="text-sm font-semibold text-zinc-900">Nenhum professor encontrado</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Verifique os termos da busca ou cadastre um novo docente.
            </p>
          </div>
        )}
      </div>

      <AddTeacherDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={(t) => {
          addTeacher(t)
          toast({
            title: 'Registro Salvo',
            description: 'O docente foi cadastrado com sucesso no sistema.',
          })
        }}
      />
    </div>
  )
}
