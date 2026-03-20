import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, Download, FolderOpen, FileBadge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function StudentDocuments() {
  const { students } = useAppStore()
  const { toast } = useToast()
  const student = students[0]

  if (!student) return <div>Acesso negado.</div>

  const handleDownload = (docName: string) => {
    toast({
      title: 'Download Iniciado',
      description: `Gerando o arquivo PDF: ${docName}`,
    })
  }

  const documents = [
    {
      id: 'doc-1',
      title: 'Declaração de Matrícula',
      description: 'Comprovante oficial de vínculo com a instituição.',
      icon: FileBadge,
      date: 'Gerado na hora',
      color: 'text-blue-500 bg-blue-50',
    },
    {
      id: 'doc-2',
      title: 'Histórico Escolar Parcial',
      description: 'Disciplinas cursadas, notas e carga horária.',
      icon: FileText,
      date: 'Gerado na hora',
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      id: 'doc-3',
      title: 'Contrato de Prestação de Serviços (2ª Via)',
      description: 'Cópia digital do contrato assinado no ato da matrícula.',
      icon: FolderOpen,
      date: new Date(student.enrollmentDate).toLocaleDateString('pt-BR'),
      color: 'text-amber-500 bg-amber-50',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-zinc-400" />
          Meus Documentos
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Emissão de declarações, histórico e segunda via do contrato educacional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="border-zinc-200 shadow-sm bg-white hover:border-zinc-300 transition-colors group"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg shrink-0 ${doc.color}`}>
                  <doc.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-sm text-zinc-900 leading-tight">{doc.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{doc.description}</p>
                  <div className="pt-2 flex items-center justify-between mt-auto">
                    <Badge
                      variant="secondary"
                      className="bg-zinc-100 text-zinc-600 text-[10px] px-2 font-medium"
                    >
                      Data: {doc.date}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <Button
                  variant="outline"
                  className="w-full h-8 text-xs font-medium bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                  onClick={() => handleDownload(doc.title)}
                >
                  <Download className="h-3.5 w-3.5 mr-2" /> Baixar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
