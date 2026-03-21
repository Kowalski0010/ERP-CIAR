import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Download, Building2, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function Integrations() {
  const { toast } = useToast()
  
  const [esocialStatus, setEsocialStatus] = useState<'idle' | 'validating' | 'errors' | 'ready'>('idle')
  const [mecStatus, setMecStatus] = useState<'idle' | 'validating' | 'ready'>('idle')

  const handleValidateEsocial = () => {
    setEsocialStatus('validating')
    setTimeout(() => setEsocialStatus('errors'), 1500)
  }

  const handleFixEsocial = () => {
    setEsocialStatus('validating')
    setTimeout(() => setEsocialStatus('ready'), 1000)
  }

  const handleExportEsocial = () => {
    toast({ title: 'Exportação e-Social Concluída', description: 'Arquivo XML estruturado gerado com sucesso.' })
  }

  const handleValidateMec = () => {
    setMecStatus('validating')
    setTimeout(() => setMecStatus('ready'), 1500)
  }

  const handleExportMec = () => {
    toast({ title: 'Censo Escolar (MEC) Concluído', description: 'Arquivo CSV formatado foi gerado para envio ao INEP.' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Building2 className="h-7 w-7 text-zinc-400" />
            Integrações Oficiais
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Geração de dados formatados para órgãos reguladores educacionais e governamentais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* e-Social Card */}
        <Card className="border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-lg">Exportação e-Social</CardTitle>
            <CardDescription className="text-xs">
              Validação de documentação de colaboradores e estagiários ativos.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {esocialStatus === 'idle' && (
              <div className="text-center py-6 text-zinc-500 text-sm border border-dashed rounded-md">
                Clique abaixo para realizar a varredura na base de dados.
              </div>
            )}
            
            {esocialStatus === 'validating' && (
              <div className="text-center py-6 text-blue-600 text-sm font-medium flex items-center justify-center gap-2 border border-blue-100 bg-blue-50/30 rounded-md">
                <RefreshCw className="h-4 w-4 animate-spin" /> Verificando campos obrigatórios (CPF, PIS)...
              </div>
            )}
            
            {esocialStatus === 'errors' && (
              <div className="space-y-4 animate-fade-in">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erros de Validação Encontrados</AlertTitle>
                  <AlertDescription>
                    A exportação está bloqueada devido a dados obrigatórios faltantes.
                  </AlertDescription>
                </Alert>
                <div className="border border-rose-100 rounded-md overflow-hidden bg-rose-50/30">
                  <Table className="table-compact">
                    <TableHeader>
                      <TableRow className="border-rose-100 hover:bg-transparent">
                        <TableHead className="text-rose-900">Registro</TableHead>
                        <TableHead className="text-rose-900">Pendência</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-rose-100 hover:bg-rose-50/50">
                        <TableCell className="font-medium text-xs">Carlos Souza (Prof)</TableCell>
                        <TableCell className="text-xs">PIS/PASEP não preenchido</TableCell>
                      </TableRow>
                    </TableRow>
                  </TableBody>
                  </Table>
                </div>
                <Button variant="outline" className="w-full text-xs" onClick={handleFixEsocial}>
                  Simular Correção em Lote
                </Button>
              </div>
            )}
            
            {esocialStatus === 'ready' && (
              <div className="text-center py-6 text-emerald-600 text-sm font-medium flex items-center justify-center gap-2 border border-emerald-100 bg-emerald-50 rounded-md animate-fade-in">
                <CheckCircle2 className="h-5 w-5" /> Base de dados íntegra e pronta!
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-zinc-100">
              <Button 
                variant="secondary" 
                className="flex-1 shadow-sm" 
                onClick={handleValidateEsocial}
                disabled={esocialStatus === 'validating'}
              >
                Validar Dados
              </Button>
              <Button 
                className="flex-1 shadow-sm" 
                onClick={handleExportEsocial} 
                disabled={esocialStatus !== 'ready'}
              >
                <Download className="w-4 h-4 mr-2" /> Gerar XML
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* MEC Card */}
        <Card className="border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-lg">Censo Escolar (MEC)</CardTitle>
            <CardDescription className="text-xs">
              Mapeamento estruturado de matrizes curriculares e alunos matriculados.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            
            {mecStatus === 'idle' && (
              <div className="text-center py-6 text-zinc-500 text-sm border border-dashed rounded-md">
                Verifique se o INEP da escola está atualizado antes de prosseguir.
              </div>
            )}
            
            {mecStatus === 'validating' && (
              <div className="text-center py-6 text-blue-600 text-sm font-medium flex items-center justify-center gap-2 border border-blue-100 bg-blue-50/30 rounded-md">
                <RefreshCw className="h-4 w-4 animate-spin" /> Verificando vínculos e status acadêmicos...
              </div>
            )}
            
            {mecStatus === 'ready' && (
              <div className="text-center py-6 text-emerald-600 text-sm font-medium flex items-center justify-center gap-2 border border-emerald-100 bg-emerald-50 rounded-md animate-fade-in">
                <CheckCircle2 className="h-5 w-5" /> 142 alunos processados sem inconsistências.
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-zinc-100 mt-auto">
              <Button 
                variant="secondary" 
                className="flex-1 shadow-sm" 
                onClick={handleValidateMec}
                disabled={mecStatus === 'validating'}
              >
                Validar Dados
              </Button>
              <Button 
                className="flex-1 shadow-sm" 
                onClick={handleExportMec} 
                disabled={mecStatus !== 'ready'}
              >
                <Download className="w-4 h-4 mr-2" /> Gerar Arquivo
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

