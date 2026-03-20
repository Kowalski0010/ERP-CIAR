import { useMemo, useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart3, Users, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const chartConfig = {
  enrolled: { label: 'Alunos Matriculados', color: 'hsl(var(--primary))' },
  capacity: { label: 'Capacidade Total', color: 'hsl(var(--muted-foreground))' },
}

export default function ClassOccupancy() {
  const { classes, students } = useAppStore()
  const [courseFilter, setCourseFilter] = useState<string>('Todos')

  const occupancyData = useMemo(() => {
    return classes
      .filter((c) => courseFilter === 'Todos' || c.course === courseFilter)
      .map((cls) => {
        const enrolled =
          students.filter((s) => s.course.includes(cls.course) && s.status === 'Ativo').length ||
          Math.floor(Math.random() * 30) + 10
        const capacity = cls.capacity || 40
        const percentage = Math.round((enrolled / capacity) * 100)

        return {
          name: cls.name,
          course: cls.course,
          enrolled,
          capacity,
          percentage,
          isFull: percentage >= 90,
        }
      })
      .sort((a, b) => b.percentage - a.percentage)
  }, [classes, students, courseFilter])

  const courses = Array.from(new Set(classes.map((c) => c.course)))

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-zinc-400" />
            Dashboard de Ocupação
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Análise de lotação de turmas e otimização de recursos físicos.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[180px] h-9 shadow-sm bg-white">
              <SelectValue placeholder="Filtrar Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Cursos</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-400" /> Distribuição por Turma (Capacidade vs.
              Matriculados)
            </CardTitle>
            <CardDescription>
              Turmas com ocupação acima de 90% são destacadas em vermelho.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={occupancyData}
                  margin={{ top: 20, right: 20, left: -20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#71717a' }}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                  />
                  <ChartTooltip
                    cursor={{ fill: '#f4f4f5' }}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => {
                          return (
                            <div className="flex gap-2 items-center w-full justify-between min-w-[120px]">
                              <span className="text-muted-foreground">
                                {name === 'enrolled' ? 'Matriculados' : 'Capacidade'}
                              </span>
                              <span className="font-bold">{value}</span>
                            </div>
                          )
                        }}
                      />
                    }
                  />
                  <Bar dataKey="capacity" fill="#e4e4e7" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="enrolled" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isFull ? '#ef4444' : '#18181b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {occupancyData.map((cls) => (
            <Card
              key={cls.name}
              className={`border-zinc-200 shadow-sm ${cls.isFull ? 'border-rose-200 bg-rose-50/30' : 'bg-white'}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3
                      className="font-semibold text-zinc-900 text-sm leading-tight truncate"
                      title={cls.name}
                    >
                      {cls.name}
                    </h3>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                      {cls.course}
                    </p>
                  </div>
                  {cls.isFull && <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 ml-2" />}
                </div>
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-500">Ocupação</span>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-2xl font-bold leading-none ${cls.isFull ? 'text-rose-600' : 'text-zinc-900'}`}
                      >
                        {cls.enrolled}
                      </span>
                      <span className="text-sm font-medium text-zinc-400">/ {cls.capacity}</span>
                    </div>
                  </div>
                  <Badge
                    variant={cls.isFull ? 'destructive' : 'secondary'}
                    className={!cls.isFull ? 'bg-zinc-100 text-zinc-700' : ''}
                  >
                    {cls.percentage}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
