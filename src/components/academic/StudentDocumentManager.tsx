import { useState } from 'react'
import { Upload, Download, FileText, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StudentDocument } from '@/lib/types'
import { uploadDocument, downloadDocument } from '@/services/storage'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export const DOCUMENT_TYPES = [
  { key: 'rg', label: 'RG' },
  { key: 'cpf', label: 'CPF' },
  { key: 'comprovante_endereco', label: 'Comprovante de Endereço' },
  { key: 'diploma_graduacao', label: 'Diploma de Graduação' },
  { key: 'certificados_pos', label: 'Certificados de Pós-Graduação' },
  { key: 'foto', label: 'Foto' },
  { key: 'comprovante_pagamento', label: 'Comprovante de Pagamento de Matrícula' },
] as const

interface Props {
  studentId?: string
  documents: StudentDocument[]
  onDocumentsChange: (docs: StudentDocument[]) => void
  onPendingFilesChange?: React.Dispatch<React.SetStateAction<Record<string, File>>>
}

export function StudentDocumentManager({
  studentId,
  documents,
  onDocumentsChange,
  onPendingFilesChange,
}: Props) {
  const { toast } = useToast()
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  const handleFile = async (docType: string, label: string, file: File) => {
    if (studentId) {
      setUploadingKey(docType)
      try {
        const result = await uploadDocument(studentId, docType, file)
        const newDoc: StudentDocument = { docType, label, ...result }
        onDocumentsChange([...documents.filter((d) => d.docType !== docType), newDoc])
        toast({ title: 'Documento enviado', description: label })
      } catch {
        toast({ title: 'Erro ao enviar', description: label, variant: 'destructive' })
      } finally {
        setUploadingKey(null)
      }
    } else {
      onPendingFilesChange?.((prev) => ({ ...prev, [docType]: file }))
      const placeholder: StudentDocument = {
        docType,
        label,
        url: URL.createObjectURL(file),
        path: '',
        name: file.name,
        type: file.type,
        date: new Date().toISOString(),
      }
      onDocumentsChange([...documents.filter((d) => d.docType !== docType), placeholder])
    }
  }

  const handleDownload = async (doc: StudentDocument) => {
    if (!doc.path) return
    try {
      const blob = await downloadDocument(doc.path)
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = doc.name
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast({ title: 'Erro no download', variant: 'destructive' })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DOCUMENT_TYPES.map(({ key, label }) => {
        const doc = documents.find((d) => d.docType === key)
        const isUploading = uploadingKey === key
        return (
          <Card key={key} className={cn('border-dashed', doc && 'border-solid')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{label}</span>
                {doc && <Check className="h-4 w-4 text-emerald-600" />}
              </div>
              {doc ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <FileText className="h-3 w-3 shrink-0" /> {doc.name}
                  </span>
                  {doc.path && (
                    <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                      <Download className="h-3 w-3 mr-1" /> Baixar
                    </Button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-4 hover:bg-muted/50 rounded transition-colors">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                  <span className="text-xs mt-1 text-muted-foreground">
                    {isUploading ? 'Enviando...' : 'Clique para enviar'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFile(key, label, f)
                    }}
                  />
                </label>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
