import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { FileBadge, QrCode, Download, Printer } from 'lucide-react'

export default function Certificados() {
  const { students } = useAppStore()
  const { toast } = useToast()

  const [studentId, setStudentId] = useState<string>('')
  const [docType, setDocType] = useState<string>('conclusao')
  const [isGenerated, setIsGenerated] = useState(false)

  const selectedStudent = students.find((s) => s.id === studentId)

  const handleGenerate = () => {
    if (!studentId) return
    setIsGenerated(true)
    toast({
      title: 'Documento Gerado',
      description: 'O certificado digital está pronto para emissão e assinatura.',
    })
  }

  const handleAction = (action: string) => {
    toast({ title: `Ação: ${action}`, description: 'Processando solicitação...' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <FileBadge className="h-7 w-7 text-zinc-400" />
            Emissão de Certificados
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Geração de certificados de conclusão e declarações com validação por QR Code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base text-zinc-800">Parâmetros de Emissão</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">Selecionar Aluno</Label>
              <Select
                value={studentId}
                onValueChange={(v) => {
                  setStudentId(v)
                  setIsGenerated(false)
                }}
              >
                <SelectTrigger className="bg-zinc-50">
                  <SelectValue placeholder="Busque um aluno..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.cpf})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">Tipo de Documento</Label>
              <Select
                value={docType}
                onValueChange={(v) => {
                  setDocType(v)
                  setIsGenerated(false)
                }}
              >
                <SelectTrigger className="bg-zinc-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conclusao">Certificado de Conclusão</SelectItem>
                  <SelectItem value="matricula">Declaração de Matrícula</SelectItem>
                  <SelectItem value="historico">Histórico Escolar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full shadow-sm mt-4"
              onClick={handleGenerate}
              disabled={!studentId}
            >
              Gerar Documento Digital
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {isGenerated && selectedStudent ? (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('Imprimir')}
                  className="h-8"
                >
                  <Printer className="w-4 h-4 mr-1.5" /> Imprimir
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAction('Baixar PDF')}
                  className="h-8"
                >
                  <Download className="w-4 h-4 mr-1.5" /> Baixar PDF
                </Button>
              </div>

              <div className="bg-white border border-zinc-300 shadow-md p-10 relative flex flex-col items-center text-center min-h-[500px]">
                {/* Decorative border */}
                <div className="absolute inset-4 border-4 border-double border-zinc-200 pointer-events-none" />

                <img
                  src="https://img.usecurling.com/i?q=university&color=gray&shape=lineal-color"
                  alt="Logo"
                  className="h-16 w-16 mb-6 opacity-80"
                />

                <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-8 tracking-wide">
                  {docType === 'conclusao' ? 'CERTIFICADO DE CONCLUSÃO' : 'DECLARAÇÃO DE MATRÍCULA'}
                </h2>

                <p className="text-zinc-700 max-w-lg leading-relaxed mb-6">
                  Certificamos para os devidos fins que{' '}
                  <strong className="text-zinc-900 text-lg uppercase">
                    {selectedStudent.name}
                  </strong>
                  , portador(a) do CPF <strong>{selectedStudent.cpf}</strong>,
                  {docType === 'conclusao'
                    ? ' concluiu com êxito todos os requisitos do curso de '
                    : ' está regularmente matriculado(a) no curso de '}
                  <strong className="text-zinc-900">{selectedStudent.course}</strong> nesta
                  instituição.
                </p>

                <div className="mt-auto flex w-full justify-between items-end px-8 pt-8 border-t border-zinc-100">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-zinc-900">Data de Emissão</p>
                    <p className="text-xs text-zinc-500">
                      {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="p-2 border border-zinc-300 bg-zinc-50 rounded mb-2">
                      <QrCode className="h-16 w-16 text-zinc-800" />
                    </div>
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
                      Autenticidade Digital
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      CIAR-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card className="h-full border-dashed border-2 border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center text-center p-12">
              <FileBadge className="h-16 w-16 mb-4 text-zinc-300" />
              <h3 className="text-sm font-semibold text-zinc-700">Nenhum documento gerado</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Selecione os parâmetros ao lado para visualizar a prévia do certificado e obter o QR
                Code de validação.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
