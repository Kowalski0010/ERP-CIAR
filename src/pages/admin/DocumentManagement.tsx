import { useState } from 'react'
import {
  Files,
  Search,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Filter,
  Eye,
  MoreHorizontal,
  Download,
  FileArchive,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const mockDocuments = [
  {
    id: '1',
    name: 'Historico_Escolar_Ana_Silva.pdf',
    category: 'Acadêmico',
    owner: 'Secretaria',
    size: '1.2 MB',
    date: '2023-10-25',
    type: 'pdf',
  },
  {
    id: '2',
    name: 'Comprovante_Pagamento_Out.png',
    category: 'Financeiro',
    owner: 'Carlos Oliveira',
    size: '850 KB',
    date: '2023-10-24',
    type: 'image',
  },
  {
    id: '3',
    name: 'Contrato_Professor_Roberto.pdf',
    category: 'RH',
    owner: 'Recursos Humanos',
    size: '2.5 MB',
    date: '2023-10-20',
    type: 'pdf',
  },
  {
    id: '4',
    name: 'Regimento_Interno_2023.pdf',
    category: 'Institucional',
    owner: 'Diretoria',
    size: '4.1 MB',
    date: '2023-01-15',
    type: 'pdf',
  },
  {
    id: '5',
    name: 'Documento_RG_Ana_Silva.jpg',
    category: 'Acadêmico',
    owner: 'Ana Silva',
    size: '1.1 MB',
    date: '2023-02-15',
    type: 'image',
  },
]

export default function DocumentManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [previewDoc, setPreviewDoc] = useState<any>(null)

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'Todos' || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleUpload = () => {
    toast({ title: 'Upload Iniciado', description: 'O envio do arquivo está em andamento.' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <FileArchive className="h-7 w-7 text-zinc-400" />
            Gestão de Documentos (GED)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Repositório centralizado para armazenamento e organização de arquivos digitais.
          </p>
        </div>
      </div>

      <Card className="border-dashed border-2 border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <UploadCloud className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-1">
            Arraste arquivos ou clique para fazer upload
          </h3>
          <p className="text-xs text-zinc-500 mb-4 max-w-sm">
            Formatos suportados: PDF, JPG, PNG, DOCX. Tamanho máximo: 50MB.
          </p>
          <Button onClick={handleUpload} size="sm" className="shadow-sm">
            Selecionar Arquivos
          </Button>
        </CardContent>
      </Card>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome do arquivo ou proprietário..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-zinc-400" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs bg-zinc-50 border-zinc-200">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas as Categorias</SelectItem>
              <SelectItem value="Acadêmico">Acadêmico</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="RH">Recursos Humanos</SelectItem>
              <SelectItem value="Institucional">Institucional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Nome do Arquivo</TableHead>
              <TableHead className="w-[140px]">Categoria</TableHead>
              <TableHead>Proprietário</TableHead>
              <TableHead className="w-[100px] text-right">Tamanho</TableHead>
              <TableHead className="w-[120px]">Data Upload</TableHead>
              <TableHead className="text-right w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc) => (
              <TableRow key={doc.id} className="group hover:bg-zinc-50/80 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {doc.type === 'pdf' ? (
                      <FileText className="h-5 w-5 text-rose-500" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-blue-500" />
                    )}
                    <span
                      className="font-medium text-zinc-900 text-xs truncate max-w-[250px]"
                      title={doc.name}
                    >
                      {doc.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-700 font-medium px-2 py-0 border-zinc-200"
                  >
                    {doc.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-600">{doc.owner}</TableCell>
                <TableCell className="text-xs text-zinc-500 text-right">{doc.size}</TableCell>
                <TableCell className="text-xs text-zinc-500 font-mono">
                  {new Date(doc.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredDocs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  Nenhum arquivo encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-zinc-50">
          {previewDoc && (
            <>
              <DialogHeader className="p-4 border-b border-zinc-200 bg-white shrink-0">
                <DialogTitle className="text-base flex items-center gap-2">
                  {previewDoc.type === 'pdf' ? (
                    <FileText className="h-4 w-4 text-rose-500" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  )}
                  {previewDoc.name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
                {previewDoc.type === 'pdf' ? (
                  <div className="w-full h-full max-w-2xl bg-white border border-zinc-200 shadow-sm rounded-md flex flex-col items-center justify-center p-8 text-zinc-400">
                    <FileText className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-sm">
                      Pré-visualização de documento PDF indisponível no modo mock.
                    </p>
                    <Button className="mt-4" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Baixar Arquivo
                    </Button>
                  </div>
                ) : (
                  <img
                    src={`https://img.usecurling.com/p/800/600?q=document&color=gray`}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded border border-zinc-200 shadow-sm"
                  />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
