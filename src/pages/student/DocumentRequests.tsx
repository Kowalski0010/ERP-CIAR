import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function DocumentRequests() {
  const { students } = useAppStore()
  const { toast } = useToast()
  const student = students[0]

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Requisição Efetuada',
      description: 'Sua solicitação de documento foi enviada para a secretaria.',
    })
  }

  if (!student) return <div className="p-8 text-center text-zinc-500">Nenhum dado encontrado.</div>

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[800px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-zinc-400" />
          Requisição de Documentos
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Solicite declarações, recibos de Imposto de Renda e relatórios diversos.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
          <CardTitle className="text-lg">Nova Solicitação</CardTitle>
          <CardDescription className="text-xs">
            Selecione o tipo de documento desejado. Prazos podem variar de acordo com a solicitação.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleRequest} className="space-y-6 max-w-md">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Tipo de Documento
              </Label>
              <Select defaultValue="declaracao_vinculo">
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o documento..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="declaracao_vinculo">Declaração de Vínculo</SelectItem>
                  <SelectItem value="historico_parcial">Histórico Escolar Parcial</SelectItem>
                  <SelectItem value="recibo_ir">Recibo para Imposto de Renda</SelectItem>
                  <SelectItem value="relatorio_faltas">Relatório de Frequência e Faltas</SelectItem>
                  <SelectItem value="ementa_disciplinas">Ementa de Disciplinas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-zinc-100 pt-6 flex justify-start">
              <Button type="submit" className="shadow-sm">
                <Send className="h-4 w-4 mr-2" /> Enviar Requisição
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
