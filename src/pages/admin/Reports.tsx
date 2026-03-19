import { BarChart3, Download, FileSpreadsheet, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { mockFinancialChart } from '@/lib/mockData'

const chartConfig = {
  receitas: { label: 'Receitas', color: 'hsl(var(--primary))' },
  despesas: { label: 'Despesas', color: 'hsl(var(--muted-foreground))' },
}

export default function Reports() {
  const { toast } = useToast()

  const handleExport = (type: 'PDF' | 'Excel') => {
    toast({
      title: 'Gerando Relatório',
      description: `O download do arquivo ${type} iniciará em instantes.`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-zinc-400" />
            Relatórios Avançados (BI)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Extração de dados e análises gerenciais em PDF ou Excel.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-zinc-100">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400" /> Parâmetros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 bg-zinc-50/50">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              Módulo
            </label>
            <Select defaultValue="financeiro">
              <SelectTrigger className="bg-white text-xs h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academico">Acadêmico (Matrículas)</SelectItem>
                <SelectItem value="financeiro">Financeiro (Receitas/Inadimplência)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              Período
            </label>
            <Select defaultValue="ano">
              <SelectTrigger className="bg-white text-xs h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Últimos 30 dias</SelectItem>
                <SelectItem value="semestre">Semestre Atual</SelectItem>
                <SelectItem value="ano">Ano Letivo 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 flex items-end gap-2">
            <Button className="flex-1 h-9 shadow-sm" onClick={() => handleExport('PDF')}>
              <Download className="h-4 w-4 mr-2" /> PDF Gerencial
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-9 shadow-sm"
              onClick={() => handleExport('Excel')}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" /> Base de Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Prévia: Desempenho Financeiro (2023)</CardTitle>
            <CardDescription>
              Visão consolidada de Receitas vs Despesas Operacionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockFinancialChart}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    tickFormatter={(val) => `R$${val / 1000}k`}
                  />
                  <ChartTooltip cursor={{ fill: '#f4f4f5' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="receitas" fill="#18181b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="despesas" fill="#a1a1aa" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
