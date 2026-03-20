import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import { Search, Check, X } from 'lucide-react'

export default function AlunoOperacoes() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || 'ocorrencias-aluno'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico e Requerimentos</h1>
        <p className="text-muted-foreground">
          Acompanhe a vida acadêmica e solicitações dos alunos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="ocorrencias-aluno">Ocorrências do Aluno</TabsTrigger>
          <TabsTrigger value="requerimentos">Requerimentos Pendentes</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'ocorrencias-aluno'
              ? 'Diário de Ocorrências'
              : 'Gestão de Requerimentos'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'ocorrencias-aluno' && (
            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar Aluno..." className="pl-8" />
              </div>

              <div className="relative border-l-2 border-muted ml-3 pl-6 space-y-6 my-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-destructive" />
                  <p className="text-sm font-semibold">Falta Disciplinar Grave</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    12/05/2026 - Registrado por: Coordenação
                  </p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">
                    Uso inadequado das instalações do laboratório de informática.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                  <p className="text-sm font-semibold">Mérito Acadêmico</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    10/04/2026 - Registrado por: Direção
                  </p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">
                    Vencedor da maratona interna de programação.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t max-w-2xl">
                <label className="text-sm font-medium">Registrar Nova Ocorrência</label>
                <Input placeholder="Título da ocorrência..." />
                <Input placeholder="Descrição detalhada..." className="h-20" />
                <Button>Salvar no Histórico</Button>
              </div>
            </div>
          )}

          {activeTab === 'requerimentos' && (
            <div className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Tipo de Solicitação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Decisão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">REQ-1092</TableCell>
                      <TableCell>Mariana Costa</TableCell>
                      <TableCell>Revisão de Nota (Cálculo II)</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                          Em Análise
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">REQ-1093</TableCell>
                      <TableCell>Pedro Henrique</TableCell>
                      <TableCell>Abono de Faltas (Atestado)</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                          Em Análise
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
