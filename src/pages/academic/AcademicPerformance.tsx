import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { TrendingUp, Filter } from 'lucide-react'

const mockPerformanceData = [
  { subject: 'Cálculo I', avg: 6.8 },
  { subject: 'Física', avg: 7.5 },
  { subject: 'Prog. Web', avg: 8.2 },
  { subject: 'Banco de Dados', avg: 5.5 },
  { subject: 'Eng. de Software', avg: 9.1 },
]

export default function AcademicPerformance() {
  const [turma, setTurma] = useState('T01')
  const [periodo, setPeriodo] = useState('2023-2')

  const chartConfig = {
    avg: { label: 'Média da Turma', color: 'hsl(var(--primary))' },
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-zinc-400" />
            Dashboard de Performance Acadêmica
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Análise visual da distribuição de notas por turma e identificação de gaps pedagógicos.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-700">
            <Filter className="h-4 w-4 text-zinc-400" /> Filtros Consolidados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              Turma (Class)
            </label>
            <Select value={turma} onValueChange={setTurma}>
              <SelectTrigger className="bg-zinc-50 text-xs h-10 border-zinc-200">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T01">T01 - Engenharia de Software</SelectItem>
                <SelectItem value="T02">T02 - Design Gráfico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              Bimestre / Semestre
            </label>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="bg-zinc-50 text-xs h-10 border-zinc-200">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-1">1º Semestre 2023</SelectItem>
                <SelectItem value="2023-2">2º Semestre 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 py-4">
            <CardTitle className="text-base text-zinc-900">
              Média de Notas por Disciplina (Visão Geral)
            </CardTitle>
            <CardDescription className="text-xs">
              Disciplinas com média abaixo de 7.0 são destacadas em alerta para reforço pedagógico.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockPerformanceData}
                  margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="subject"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                  />
                  <RechartsTooltip cursor={{ fill: '#f4f4f5' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {mockPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.avg < 7.0 ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
