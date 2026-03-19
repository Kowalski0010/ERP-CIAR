import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Search, ShieldAlert, History } from 'lucide-react'
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

export default function AuditLogs() {
  const { logs } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-zinc-400" />
            Auditoria do Sistema
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Registro de atividades e trilha de auditoria de usuários.
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Filtrar por usuário, ação ou entidade..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        {filteredLogs.length > 0 ? (
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Data / Hora</TableHead>
                <TableHead className="w-[180px]">Usuário</TableHead>
                <TableHead className="w-[200px]">Ação Realizada</TableHead>
                <TableHead>Entidade / Detalhe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                  <TableCell className="font-mono text-xs text-zinc-500">
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
                  <TableCell className="font-medium text-zinc-900 text-xs">{log.action}</TableCell>
                  <TableCell className="text-zinc-600 text-xs">{log.entity}</TableCell>
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
            <p className="text-xs text-zinc-500 mt-1">Ajuste os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  )
}
