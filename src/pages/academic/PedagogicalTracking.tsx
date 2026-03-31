import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { GraduationCap, Search, Target, TrendingUp, AlertCircle, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCourses } from '@/services/courses'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useAppStore } from '@/contexts/AppContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const mockPerformanceData: any[] = []

const chartConfig = {
  media: { label: 'Desempenho Aluno', color: 'hsl(var(--primary))' },
  mediaTurma: { label: 'Média da Turma', color: 'hsl(var(--muted-foreground))' },
}

export default function PedagogicalTracking() {
  const { students } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(students[0])
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    getCourses().then(setCourses).catch(console.error)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-zinc-400" />
            Acompanhamento Pedagógico
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Análise de evolução acadêmica, rendimento e alertas de intervenção.
          </p>
        </div>
      </div>

      <Tabs defaultValue="acompanhamento" className="w-full">
        <TabsList className="mb-4 bg-zinc-100">
          <TabsTrigger value="acompanhamento" className="data-[state=active]:bg-white">
            Acompanhamento do Aluno
          </TabsTrigger>
          <TabsTrigger value="cursos" className="data-[state=active]:bg-white">
            Cursos Cadastrados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="acompanhamento" className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3">
            <div className="relative max-w-lg flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Pesquisar aluno por nome ou matrícula..."
                  className="pl-9 h-9 bg-zinc-50 focus-visible:ring-zinc-300 w-full text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="sm" className="h-9">
                Buscar Histórico
              </Button>
            </div>
          </div>

          {selectedStudent && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-zinc-200 shadow-sm overflow-hidden relative">
                  <div className="h-24 bg-blue-600/10 border-b border-zinc-100" />
                  <div className="px-6 pb-6 -mt-10 relative">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-sm mb-3">
                      <AvatarImage src={selectedStudent.avatar} />
                      <AvatarFallback className="text-lg bg-zinc-100 text-zinc-900 font-bold">
                        {selectedStudent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-zinc-900 leading-tight">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-xs text-zinc-500 mb-4">
                      {selectedStudent.course} • Matrícula:{' '}
                      {selectedStudent.registrationCode || 'N/A'} • Ativa
                    </p>

                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="flex justify-between text-xs mb-1 font-medium text-zinc-600">
                          <span>Progresso do Curso</span>
                          <span className="font-bold text-zinc-900">65%</span>
                        </div>
                        <Progress value={65} className="h-1.5" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-1">
                            CRA Atual
                          </p>
                          <p className="text-2xl font-bold text-zinc-900 flex items-center gap-1">
                            8.5 <TrendingUp className="h-4 w-4 text-emerald-500" />
                          </p>
                        </div>
                        <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-1">
                            Frequência
                          </p>
                          <p className="text-2xl font-bold text-zinc-900 flex items-center gap-1">
                            92%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-zinc-200 shadow-sm bg-amber-50/50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-900">
                      <AlertCircle className="h-4 w-4" /> Alertas Pedagógicos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-white p-3 rounded border border-amber-200 text-xs">
                      <p className="font-semibold text-amber-900">Risco de Reprovação (Falta)</p>
                      <p className="text-amber-700 mt-1">
                        Disciplina de Estatística Aplicada atingiu 20% de faltas no semestre atual.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card className="border-zinc-200 shadow-sm">
                  <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-zinc-400" /> Evolução de Desempenho (Série
                      Histórica)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ChartContainer config={chartConfig} className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={mockPerformanceData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                          <XAxis
                            dataKey="term"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#71717a' }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#71717a' }}
                            domain={[0, 10]}
                          />
                          <ChartTooltip
                            cursor={{ fill: '#f4f4f5' }}
                            content={<ChartTooltipContent />}
                          />
                          <Line
                            type="monotone"
                            dataKey="media"
                            stroke="var(--color-media)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--color-media)' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="mediaTurma"
                            stroke="var(--color-mediaTurma)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-sm">
                  <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-zinc-400" /> Quadro de Disciplinas (Semestre
                      Atual)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-zinc-100">
                      {[].map((disc: any) => (
                        <div
                          key={disc.nome}
                          className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                        >
                          <div>
                            <h4 className="font-semibold text-sm text-zinc-900">{disc.nome}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">Frequência: {disc.freq}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                                Média Parcial
                              </p>
                              <p
                                className={`font-mono font-bold text-lg leading-tight ${disc.media < 7 ? 'text-amber-600' : 'text-zinc-900'}`}
                              >
                                {disc.media.toFixed(1)}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`w-24 justify-center ${disc.media < 7 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                            >
                              {disc.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cursos">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle>Cursos Oferecidos</CardTitle>
              <CardDescription>
                Consulte todos os cursos acadêmicos cadastrados na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow>
                    <TableHead className="pl-6">Nome do Curso</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Duração (Meses)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="pl-6 font-medium text-zinc-900">
                        {course.name}
                      </TableCell>
                      <TableCell className="text-zinc-600">{course.mode}</TableCell>
                      <TableCell className="text-zinc-600">{course.duration}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            course.status === 'Ativo'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }
                        >
                          {course.status || 'Ativo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {courses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-zinc-500">
                        Nenhum curso encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
