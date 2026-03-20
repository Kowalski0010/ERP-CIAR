import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Administrativo() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || 'reabertura-periodo'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apoio Administrativo</h1>
        <p className="text-muted-foreground">
          Ferramentas de reabertura de sistema e gestão física de recursos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="reabertura-periodo">Reabertura de Período</TabsTrigger>
          <TabsTrigger value="recursos-aula">Recursos de Aula</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'reabertura-periodo'
              ? 'Exceção de Lançamentos Letivos'
              : 'Inventário de Apoio Didático'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'reabertura-periodo' && (
            <div className="space-y-4 max-w-xl">
              <div className="p-4 bg-destructive/10 border-l-4 border-destructive text-destructive-foreground text-sm rounded-r-md mb-6">
                Atenção: A reabertura de período letivo já encerrado permite que professores
                modifiquem notas finais e faltas. Utilize com autorização da diretoria.
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Período Letivo Fechado</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o semestre..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-2">2025.2 - Encerrado em 15/12/2025</SelectItem>
                    <SelectItem value="2025-1">2025.1 - Encerrado em 10/07/2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Justificativa da Auditoria</label>
                <Input placeholder="Motivo da reabertura para registro em log..." />
              </div>
              <Button variant="destructive">Autorizar Reabertura</Button>
            </div>
          )}

          {activeTab === 'recursos-aula' && (
            <div className="space-y-6">
              <div className="flex gap-4 items-end max-w-2xl">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Nome do Recurso</label>
                  <Input placeholder="Ex: Projetor Epson L3150" />
                </div>
                <div className="w-32 space-y-2">
                  <label className="text-sm font-medium">Qtd</label>
                  <Input type="number" defaultValue="1" />
                </div>
                <Button>Adicionar ao Inventário</Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Recurso Físico</TableHead>
                      <TableHead>Quantidade Disponível</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">REC-001</TableCell>
                      <TableCell>Projetor Multimídia</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>Ativo</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">REC-002</TableCell>
                      <TableCell>Notebook Professor</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>Ativo</TableCell>
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
