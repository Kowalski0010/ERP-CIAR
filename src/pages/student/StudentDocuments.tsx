import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Download, FolderOpen, PenTool } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function StudentDocuments() {
  const { students, signDocument } = useAppStore()
  const { toast } = useToast()
  const student = students[0]

  if (!student) return <div>Acesso negado.</div>

  const handleDownload = (docName: string) => {
    toast({
      title: 'Download Iniciado',
      description: `Gerando o arquivo PDF: ${docName}`,
    })
  }

  const handleSign = (docId: string) => {
    signDocument(student.id, docId)
    toast({
      title: 'Documento Assinado',
      description: 'Sua assinatura digital foi registrada com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-zinc-400" />
          Documentos e Assinaturas
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Acesse os arquivos emitidos e pendências de assinatura digital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {student.documents && student.documents.length > 0 ? (
          student.documents.map((doc) => (
            <Card
              key={doc.id}
              className="border-zinc-200 shadow-sm bg-white hover:border-zinc-300 transition-colors group flex flex-col"
            >
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="font-semibold text-sm text-zinc-900 leading-tight">{doc.title}</h3>
                  <Badge
                    variant={doc.status === 'Assinado' ? 'outline' : 'destructive'}
                    className={`whitespace-nowrap ${doc.status === 'Assinado' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : ''}`}
                  >
                    {doc.status}
                  </Badge>
                </div>

                <div className="pt-2 flex items-center gap-4 mt-auto mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-600 text-[10px] px-2 font-medium"
                  >
                    Tipo: {doc.type}
                  </Badge>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Data: {new Date(doc.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-2 mt-auto">
                  {doc.status === 'Pendente' && (
                    <Button
                      className="flex-1 text-xs h-9 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSign(doc.id)}
                    >
                      <PenTool className="w-3.5 h-3.5 mr-2" /> Assinar Digitalmente
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1 h-9 text-xs font-medium bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                    onClick={() => handleDownload(doc.title)}
                  >
                    <Download className="h-3.5 w-3.5 mr-2" /> Baixar Cópia
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50 border border-zinc-200 rounded-lg border-dashed">
            <FolderOpen className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-sm font-semibold text-zinc-700">Nenhum documento disponível</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Não há contratos ou declarações vinculadas ao seu perfil no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
