import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Badge } from '@/components/ui/badge'
import { Trophy, Plus, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Extracurricular() {
  const {
    extracurricularActivities,
    extracurricularEnrollments,
    students,
    addExtracurricularActivity,
    enrollInExtracurricular,
  } = useAppStore()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('atividades')
  const [isAdding, setIsAdding] = useState(false)
  const [selStudent, setSelStudent] = useState('')
  const [selActivity, setSelActivity] = useState('')

  const handleCreateActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addExtracurricularActivity({
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      instructor: fd.get('instructor') as string,
      schedule: fd.get('schedule') as string,
      monthlyFee: Number(fd.get('fee')),
      status: 'Ativo',
    })
    toast({ title: 'Atividade Criada', description: 'Nova modalidade liberada para matrículas.' })
    setIsAdding(false)
  }

  const handleEnrollment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selStudent || !selActivity) return
    enrollInExtracurricular(selStudent, selActivity)
    toast({
      title: 'Matrícula Concluída',
      description: 'Aluno matriculado. Uma fatura foi gerada automaticamente no módulo financeiro.',
    })
    setSelStudent('')
    setSelActivity('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Trophy className="h-7 w-7 text-zinc-400" />
            Atividades Extra-Curriculares
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestão de modalidades complementares (Esportes, Idiomas) e integração financeira.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto mb-4">
          <TabsTrigger value="atividades">Modalidades Cadastradas</TabsTrigger>
          <TabsTrigger value="matriculas">Novas Matrículas</TabsTrigger>
        </TabsList>

        {activeTab === 'atividades' && (
          <div className="space-y-4">
            {!isAdding ? (
              <>
                <div className="flex justify-end">
                  <Button onClick={() => setIsAdding(true)} className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
                  </Button>
                </div>
                <Card className="border-zinc-200 shadow-sm overflow-hidden bg-white">
                  <Table className="table-compact">
                    <TableHeader className="bg-zinc-50">
                      <TableRow>
                        <TableHead>Atividade / Categoria</TableHead>
                        <TableHead>Instrutor</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead className="text-right">Mensalidade</TableHead>
                        <TableHead className="w-[100px] text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extracurricularActivities.map((act) => (
                        <TableRow key={act.id}>
                          <TableCell>
                            <div className="font-semibold text-zinc-900 text-sm">{act.name}</div>
                            <div className="text-[10px] text-zinc-500 uppercase">
                              {act.category}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-zinc-700">{act.instructor}</TableCell>
                          <TableCell className="text-xs text-zinc-600">{act.schedule}</TableCell>
                          <TableCell className="text-right font-bold text-zinc-900">
                            R${' '}
                            {act.monthlyFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className="border-emerald-200 bg-emerald-50 text-emerald-700"
                            >
                              {act.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </>
            ) : (
              <Card className="border-zinc-200 shadow-sm bg-white">
                <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
                  <CardTitle className="text-base">Cadastro de Modalidade</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleCreateActivity} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da Atividade</Label>
                        <Input name="name" required placeholder="Ex: Futebol Society" />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select name="category" required defaultValue="Esportes">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Esportes">Esportes</SelectItem>
                            <SelectItem value="Idiomas">Idiomas</SelectItem>
                            <SelectItem value="Artes">Artes / Música</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Instrutor Responsável</Label>
                        <Input name="instructor" required placeholder="Ex: Prof. Marcos" />
                      </div>
                      <div className="space-y-2">
                        <Label>Horários (Ex: Ter/Qui 18h)</Label>
                        <Input name="schedule" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Taxa / Mensalidade (R$)</Label>
                        <Input name="fee" type="number" required defaultValue="100" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar Atividade</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'matriculas' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-zinc-200 shadow-sm bg-white lg:col-span-1 h-fit">
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-base">Matricular Aluno</CardTitle>
                <CardDescription className="text-xs">
                  Faturas são geradas na confirmação.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleEnrollment} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Aluno</Label>
                    <Select value={selStudent} onValueChange={setSelStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o aluno" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Atividade</Label>
                    <Select value={selActivity} onValueChange={setSelActivity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a atividade" />
                      </SelectTrigger>
                      <SelectContent>
                        {extracurricularActivities.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={!selStudent || !selActivity} className="w-full">
                    Confirmar Matrícula
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 shadow-sm bg-white lg:col-span-2">
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="text-base">Vínculos Ativos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-compact">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Atividade</TableHead>
                      <TableHead>Data Vínculo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extracurricularEnrollments.map((enr) => (
                      <TableRow key={enr.id}>
                        <TableCell className="font-semibold text-xs">{enr.studentName}</TableCell>
                        <TableCell className="text-xs text-zinc-700">{enr.activityName}</TableCell>
                        <TableCell className="text-xs text-zinc-500">
                          {new Date(enr.enrollmentDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 bg-emerald-50 px-1.5 py-0"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  )
}
