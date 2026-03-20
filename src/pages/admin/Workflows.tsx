import { useState } from 'react'
import { Columns, Plus, Clock, CheckCircle2, User, Building, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Task = {
  id: string
  title: string
  requester: string
  department: string
  priority: 'Alta' | 'Média' | 'Baixa'
  status: 'Pendente' | 'Em Andamento' | 'Em Revisão' | 'Concluído'
  date: string
}

const mockTasks: Task[] = [
  {
    id: 'TK-101',
    title: 'Emissão de Histórico Escolar',
    requester: 'Ana Silva',
    department: 'Secretaria',
    priority: 'Alta',
    status: 'Pendente',
    date: '2023-10-25',
  },
  {
    id: 'TK-102',
    title: 'Aprovação de Estágio',
    requester: 'Carlos Oliveira',
    department: 'Coordenação',
    priority: 'Média',
    status: 'Pendente',
    date: '2023-10-24',
  },
  {
    id: 'TK-103',
    title: 'Solicitação de Férias',
    requester: 'Márcia Ferreira',
    department: 'RH',
    priority: 'Baixa',
    status: 'Em Andamento',
    date: '2023-10-22',
  },
  {
    id: 'TK-104',
    title: 'Reembolso de Despesas',
    requester: 'Jorge Martins',
    department: 'Financeiro',
    priority: 'Alta',
    status: 'Em Revisão',
    date: '2023-10-20',
  },
  {
    id: 'TK-105',
    title: 'Trancamento de Matrícula',
    requester: 'João Pedro',
    department: 'Secretaria',
    priority: 'Alta',
    status: 'Concluído',
    date: '2023-10-18',
  },
  {
    id: 'TK-106',
    title: 'Ajuste de Grade Curricular',
    requester: 'Fernanda Lima',
    department: 'Coordenação',
    priority: 'Média',
    status: 'Concluído',
    date: '2023-10-15',
  },
]

const columnConfig = [
  { id: 'Pendente', label: 'Pendente', color: 'bg-zinc-200/50', border: 'border-zinc-300' },
  { id: 'Em Andamento', label: 'Em Andamento', color: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'Em Revisão', label: 'Revisão', color: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'Concluído', label: 'Concluído', color: 'bg-emerald-50', border: 'border-emerald-200' },
]

export default function Workflows() {
  const [tasks] = useState<Task[]>(mockTasks)

  const getPriorityColor = (priority: string) => {
    if (priority === 'Alta') return 'text-rose-600 bg-rose-50 border-rose-200'
    if (priority === 'Média') return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }

  return (
    <div className="space-y-6 animate-fade-in-up flex flex-col h-[calc(100vh-100px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Columns className="h-7 w-7 text-zinc-400" />
            Fluxos Administrativos
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Quadro Kanban para acompanhamento de chamados e processos internos.
          </p>
        </div>
        <Button className="shadow-sm h-9 px-4 shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-stretch">
        {columnConfig.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id)
          return (
            <div key={col.id} className="min-w-[320px] w-[320px] flex flex-col h-full">
              <div
                className={`flex items-center justify-between mb-3 p-3 rounded-t-md border-b-2 ${col.color} ${col.border}`}
              >
                <h3 className="font-semibold text-sm text-zinc-800 uppercase tracking-wider">
                  {col.label}
                </h3>
                <Badge variant="secondary" className="bg-white text-zinc-600 font-medium shadow-sm">
                  {colTasks.length}
                </Badge>
              </div>

              <div className="bg-zinc-100/50 rounded-b-lg p-2 flex flex-col gap-3 flex-1 overflow-y-auto border border-t-0 border-zinc-200">
                {colTasks.length === 0 ? (
                  <div className="h-24 flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-md">
                    <p className="text-xs font-medium">Nenhum chamado</p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="shadow-sm border-zinc-200 cursor-pointer hover:border-zinc-400 transition-colors bg-white group"
                    >
                      <CardContent className="p-3.5">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] bg-zinc-50 text-zinc-500 px-1.5 py-0"
                          >
                            {task.id}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-[13px] text-zinc-900 leading-tight mb-3">
                          {task.title}
                        </h4>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                            <User className="w-3.5 h-3.5 opacity-70" />
                            <span className="truncate">{task.requester}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                            <Building className="w-3.5 h-3.5 opacity-70" />
                            <span className="truncate">{task.department}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100">
                          <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {new Date(task.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </div>
                          {task.status === 'Concluído' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
