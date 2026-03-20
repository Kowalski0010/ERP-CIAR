import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

export default function EnrollmentWorkflow() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || 'efetuar-matricula'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fluxos de Matrícula</h1>
        <p className="text-muted-foreground">Gerencie o ciclo completo de ingresso de alunos.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="efetuar-pre-matricula">1. Efetuar Pré-Matrícula</TabsTrigger>
          <TabsTrigger value="efetivar-pre-matricula">2. Efetivar Pré-Matrícula</TabsTrigger>
          <TabsTrigger value="efetuar-matricula">3. Efetuar Matrícula Direta</TabsTrigger>
          <TabsTrigger value="efetuar-matricula-disciplina">
            4. Matrícula em Disciplinas
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'efetuar-pre-matricula' && 'Registro de Interesse / Pré-Matrícula'}
            {activeTab === 'efetivar-pre-matricula' && 'Conversão de Pré-Matrículas'}
            {activeTab === 'efetuar-matricula' && 'Nova Matrícula (Direta)'}
            {activeTab === 'efetuar-matricula-disciplina' && 'Alocação de Disciplinas'}
          </CardTitle>
          <CardDescription>Siga os passos requeridos para completar o processo.</CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === 'efetuar-pre-matricula' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <Input placeholder="Nome do Candidato" />
              <Input placeholder="E-mail de Contato" />
              <Input placeholder="Telefone / WhatsApp" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Curso de Interesse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">Engenharia de Software</SelectItem>
                </SelectContent>
              </Select>
              <Button className="col-span-1 md:col-span-2 mt-2">Registrar Pré-Matrícula</Button>
            </div>
          )}

          {activeTab === 'efetivar-pre-matricula' && (
            <div className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Candidato</TableHead>
                      <TableHead>Curso Pretendido</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>14/05/2026</TableCell>
                      <TableCell>Lucas Oliveira</TableCell>
                      <TableCell>Engenharia de Software</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Efetivar</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'efetuar-matricula' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex gap-2 mb-4">
                <Badge variant="default" className="text-sm py-1">
                  Passo 1: Dados Pessoais
                </Badge>
                <Badge variant="secondary" className="text-sm py-1">
                  Passo 2: Curso e Plano
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  Passo 3: Contrato
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Nome Completo" />
                <Input placeholder="CPF" />
                <Input placeholder="Data de Nascimento" type="date" />
                <Input placeholder="CEP" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c1">Engenharia de Software</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Plano de Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">Mensalidade Padrão - 12x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Gerar Matrícula e Contrato</Button>
            </div>
          )}

          {activeTab === 'efetuar-matricula-disciplina' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex gap-4">
                <Input placeholder="Buscar Aluno Matriculado..." className="flex-1" />
                <Button variant="secondary">Buscar Grades</Button>
              </div>
              <div className="border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Créditos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>MAT101</TableCell>
                      <TableCell>Cálculo I</TableCell>
                      <TableCell>4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>COMP201</TableCell>
                      <TableCell>Algoritmos</TableCell>
                      <TableCell>6</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <Button>Confirmar Grade Curricular</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
