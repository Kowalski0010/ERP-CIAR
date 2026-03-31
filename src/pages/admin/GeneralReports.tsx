import { FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function GeneralReports() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-zinc-400" />
          Relatórios Gerais
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gere relatórios financeiros, relatórios de turmas, inadimplência e listagens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white hover:border-zinc-300 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Inadimplentes</CardTitle>
            <CardDescription className="text-xs">Faturas em atraso por período.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Módulo pronto para integração de dados.</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm bg-white hover:border-zinc-300 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Ocupação de Turmas</CardTitle>
            <CardDescription className="text-xs">
              Alunos ativos por curso/disciplina.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Módulo pronto para integração de dados.</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm bg-white hover:border-zinc-300 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Receitas por Curso</CardTitle>
            <CardDescription className="text-xs">Pagamentos liquidados.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Módulo pronto para integração de dados.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
