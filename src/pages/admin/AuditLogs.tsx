import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, ShieldAlert, History, Filter } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AuditLogs() {
  const { logs } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState('Todos')
  const [dateFilter, setDateFilter] = useState('Todos')

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.targetStudent && log.targetStudent.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesModule =
        moduleFilter === 'Todos' ||
        log.entity.includes(moduleFilter) ||
        log.action.includes(moduleFilter)

      // Simple date filter logic for mock
      let matchesDate = true
      const logDate = new Date(log.timestamp)
      const now = new Date()
      if (dateFilter === 'Hoje') {
        matchesDate = logDate.toDateString() === now.toDateString()
      } else if (dateFilter === '7d') {
        matchesDate = logDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }

      return matchesSearch && matchesModule && matchesDate
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-zinc-400" />
            Auditoria Acadêmica e Sistema
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Registro imutável de alterações cadastrais e acadêmicas.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar usuário, aluno alvo ou ação..."
              className="pl-9 h-9 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Módulo/Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Módulos</SelectItem>
                <SelectItem value="Secretaria">Secretaria (Cadastros)</SelectItem>
                <SelectItem value="Notas">Acadêmico (Notas)</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todo o Histórico</SelectItem>
                <SelectItem value="Hoje">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        {filteredLogs.length > 0 ? (
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[160px]">Data / Hora</TableHead>
                <TableHead className="w-[180px]">Usuário Responsável</TableHead>
                <TableHead className="w-[200px]">Ação</TableHead>
                <TableHead className="w-[200px]">Aluno Alvo</TableHead>
                <TableHead>Detalhes da Modificação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-mono text-[11px] text-zinc-500 font-medium">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-zinc-100 border-zinc-200 text-zinc-700 font-medium text-[10px]"
                    >
                      {log.user}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900 text-xs">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-zinc-700">
                    {log.targetStudent || <span className="text-zinc-400 italic">N/A</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-600 font-medium">{log.entity}</span>
                      {log.details && (
                        <span className="text-[11px] bg-amber-50 text-amber-800 p-1 rounded border border-amber-200 leading-tight inline-block w-fit">
                          {log.details}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50">
            <div className="h-12 w-12 bg-white border border-zinc-200 rounded-lg flex items-center justify-center mb-3 shadow-sm">
              <History className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">Nenhum registro encontrado</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Ajuste os filtros de busca para ver resultados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
