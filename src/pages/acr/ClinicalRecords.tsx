import { useState, useRef } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  FileText,
  Save,
  History,
  CalendarClock,
  PenTool,
  UploadCloud,
  Paperclip,
  Download,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function ClinicalRecords() {
  const { acrPatients, acrRecords, addAcrRecord, signAcrRecord, addAcrAttachment } = useAppStore()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [newNote, setNewNote] = useState('')
  const [signingId, setSigningId] = useState<string | null>(null)

  const selectedPatient = acrPatients.find((p) => p.id === selectedPatientId)
  const patientRecords = acrRecords
    .filter((r) => r.patientId === selectedPatientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSaveRecord = () => {
    if (!selectedPatient || !newNote.trim()) return

    addAcrRecord({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      notes: newNote,
    })

    toast({
      title: 'Prontuário Atualizado',
      description: 'As anotações clínicas foram salvas no histórico.',
    })
    setNewNote('')
  }

  const confirmSign = () => {
    if (!signingId) return
    signAcrRecord(signingId)
    toast({
      title: 'Prontuário Assinado',
      description: 'O registro foi assinado digitalmente e notificado ao paciente.',
    })
    setSigningId(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, recordId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    addAcrAttachment(recordId, {
      name: file.name,
      url: `https://img.usecurling.com/p/200/300?q=document&seed=${Math.random()}`,
    })

    toast({
      title: 'Anexo Salvo',
      description: `O arquivo ${file.name} foi vinculado ao prontuário.`,
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-zinc-400" />
            Prontuários Clínicos
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Registro de evoluções, notas, anexos de exames e assinatura digital.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base text-zinc-800">Selecione o Paciente</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger className="w-full bg-zinc-50 h-11 sm:h-10">
                <SelectValue placeholder="Busque pelo paciente..." />
              </SelectTrigger>
              <SelectContent>
                {acrPatients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPatient && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md">
                  <h4 className="font-bold text-zinc-900 text-sm mb-1">{selectedPatient.name}</h4>
                  <p className="text-xs text-zinc-500 mb-3">
                    Idade:{' '}
                    {new Date().getFullYear() - new Date(selectedPatient.birthDate).getFullYear()}{' '}
                    anos
                  </p>
                  <p className="text-xs text-zinc-700 bg-white p-3 rounded border border-zinc-200 shadow-sm leading-relaxed">
                    <strong>Motivo inicial:</strong> {selectedPatient.background}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-zinc-200 shadow-sm bg-white flex flex-col h-full min-h-[600px]">
          {selectedPatient ? (
            <>
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-zinc-400" /> Histórico de Evolução
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
                  {patientRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="relative pl-4 sm:pl-6 border-l-2 border-zinc-200 ml-2 animate-fade-in"
                    >
                      <div className="absolute w-3 h-3 bg-zinc-300 rounded-full -left-[7px] top-1 border-2 border-white" />

                      <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                            <CalendarClock className="w-3.5 h-3.5 text-zinc-400" />
                            {new Date(rec.date).toLocaleString('pt-BR')}
                          </span>
                          <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-medium border border-zinc-200">
                            {rec.professional}
                          </span>
                        </div>
                        {rec.signed ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50 self-start sm:self-auto"
                          >
                            <PenTool className="w-3 h-3 mr-1" /> Assinado
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs w-full sm:w-auto mt-2 sm:mt-0"
                            onClick={() => setSigningId(rec.id)}
                          >
                            Finalizar e Assinar
                          </Button>
                        )}
                      </div>

                      <div
                        className={cn(
                          'p-4 rounded-md border text-sm leading-relaxed whitespace-pre-wrap',
                          rec.signed
                            ? 'bg-zinc-50 border-zinc-200 text-zinc-600'
                            : 'bg-white border-zinc-300 text-zinc-800 shadow-sm',
                        )}
                      >
                        {rec.notes}
                      </div>

                      {/* Attachments Section */}
                      <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-2 items-start sm:items-center">
                        {rec.attachments?.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded text-xs w-full sm:w-auto"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Paperclip className="w-3 h-3 shrink-0" />
                              <span className="font-medium truncate max-w-[200px] sm:max-w-[150px]">
                                {att.name}
                              </span>
                            </div>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-2 text-blue-500 hover:text-blue-900 shrink-0 p-1 bg-white rounded"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                        {!rec.signed && (
                          <label className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-500 hover:text-blue-600 cursor-pointer border border-dashed border-zinc-300 px-3 py-2 rounded hover:bg-zinc-50 transition-colors w-full sm:w-auto">
                            <UploadCloud className="w-4 h-4 shrink-0" /> Anexar Exame/Doc
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, rec.id)}
                            />
                          </label>
                        )}
                      </div>

                      {rec.signed && (
                        <p className="text-[10px] text-zinc-400 mt-2 font-mono">
                          Assinado por {rec.signedBy} em{' '}
                          {new Date(rec.signedAt!).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))}
                  {patientRecords.length === 0 && (
                    <div className="text-center py-8 text-zinc-400 text-sm">
                      Nenhum registro clínico salvo para este paciente.
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-200 pt-6 mt-auto">
                  <h4 className="text-sm font-semibold text-zinc-800 mb-3">Nova Evolução</h4>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Descreva as observações da sessão atual..."
                    className="min-h-[120px] resize-none mb-4 bg-white focus-visible:ring-zinc-400 text-base sm:text-sm"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <span className="text-xs text-zinc-500">
                      Você poderá anexar arquivos após salvar o rascunho inicial.
                    </span>
                    <Button
                      onClick={handleSaveRecord}
                      disabled={!newNote.trim()}
                      className="shadow-sm w-full sm:w-auto h-11 sm:h-10"
                    >
                      <Save className="w-4 h-4 mr-2" /> Salvar Prontuário
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center text-zinc-400">
              <FileText className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold text-zinc-700">Nenhum Paciente Selecionado</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Selecione um paciente na lista para visualizar e adicionar notas ao prontuário.
              </p>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={!!signingId} onOpenChange={(o) => !o && setSigningId(null)}>
        <DialogContent className="w-[95vw] sm:w-full max-w-md rounded-xl sm:rounded-lg">
          <DialogHeader>
            <DialogTitle>Assinatura Digital de Prontuário</DialogTitle>
            <DialogDescription>
              Ao assinar digitalmente este registro, ele será bloqueado contra edições futuras para
              garantir conformidade legal e integridade dos dados. O paciente será notificado da
              disponibilidade.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setSigningId(null)}
              className="w-full sm:w-auto h-11 sm:h-10"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmSign}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto h-11 sm:h-10"
            >
              <PenTool className="w-4 h-4 mr-2" /> Confirmar e Assinar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
