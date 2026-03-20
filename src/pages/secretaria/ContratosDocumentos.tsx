import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Printer, FileText } from 'lucide-react'

export default function ContratosDocumentos() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || '2a-via-contrato'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos e Contratos</h1>
        <p className="text-muted-foreground">
          Emissão de segundas vias e impressão de documentos institucionais.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="2a-via-contrato">2ª via do Contrato</TabsTrigger>
          <TabsTrigger value="imprimir-documentos">Imprimir Documentos</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === '2a-via-contrato'
              ? 'Gerar 2ª Via do Contrato'
              : 'Impressão de Documentos'}
          </CardTitle>
          <CardDescription>Busque o aluno e selecione a ação desejada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Buscar Aluno</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Nome, CPF ou Matrícula..." className="pl-8" />
              </div>
            </div>
            {activeTab === 'imprimir-documentos' && (
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Tipo de Documento</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="declaracao">Declaração de Matrícula</SelectItem>
                    <SelectItem value="historico">Histórico Escolar Parcial</SelectItem>
                    <SelectItem value="certificado">Certificado de Conclusão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="pt-2">
            <Button className="w-full sm:w-auto">
              {activeTab === '2a-via-contrato' ? (
                <>
                  <FileText className="mr-2 h-4 w-4" /> Gerar 2ª Via
                </>
              ) : (
                <>
                  <Printer className="mr-2 h-4 w-4" /> Imprimir Documento
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
