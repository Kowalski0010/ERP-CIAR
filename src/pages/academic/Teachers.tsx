import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, Plus, MoreHorizontal, Clock, UserX } from 'lucide-react'
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

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corpo Docente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de professores e documentação.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Novo Professor
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm p-3 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou disciplina..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <Table className="table-compact">
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Docente</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((teacher) => (
                <TableRow key={teacher.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {teacher.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{teacher.name}</span>
                        <span className="text-xs text-muted-foreground">{teacher.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {teacher.subjects.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="font-normal text-[10px] py-0 px-2 bg-muted/50 border-transparent"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> {teacher.workload}h/sem
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="status-success">
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
            <h3 className="text-lg font-medium text-foreground">Nenhum professor encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">
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
