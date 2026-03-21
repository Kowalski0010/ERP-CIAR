import { useState } from 'react'
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
import { FileText, Save, History, CalendarClock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ClinicalRecords() {
  const { acrPatients, acrRecords, addAcrRecord } = useAppStore()
  const { toast } = useToast()

  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [newNote, setNewNote] = useState('')

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

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-zinc-400" />
            Prontuários Clínicos
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Registro de evoluções, notas e acompanhamento contínuo dos pacientes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base text-zinc-800">Selecione o Paciente</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger className="w-full">
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
                  <p className="text-xs text-zinc-700 bg-white p-2 rounded border border-zinc-200 shadow-sm">
                    <strong>Motivo inicial:</strong> {selectedPatient.background}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-zinc-200 shadow-sm bg-white flex flex-col h-full min-h-[500px]">
          {selectedPatient ? (
            <>
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-zinc-400" /> Histórico de Evolução
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                  {patientRecords.map((rec) => (
                    <div key={rec.id} className="relative pl-6 border-l-2 border-zinc-200 ml-2">
                      <div className="absolute w-3 h-3 bg-zinc-300 rounded-full -left-[7px] top-1 border-2 border-white" />
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                          <CalendarClock className="w-3.5 h-3.5 text-zinc-400" />
                          {new Date(rec.date).toLocaleString('pt-BR')}
                        </span>
                        <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-medium">
                          {rec.professional}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-700 bg-zinc-50 p-3 rounded-md border border-zinc-200 whitespace-pre-wrap">
                        {rec.notes}
                      </p>
                    </div>
                  ))}
                  {patientRecords.length === 0 && (
                    <div className="text-center py-8 text-zinc-400 text-sm">
                      Nenhum registro clínico salvo para este paciente.
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100 pt-6 mt-auto">
                  <h4 className="text-sm font-semibold text-zinc-800 mb-3">Nova Evolução</h4>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Descreva as observações da sessão atual..."
                    className="min-h-[120px] resize-none mb-3 bg-zinc-50"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveRecord} disabled={!newNote.trim()}>
                      <Save className="w-4 h-4 mr-2" /> Salvar Prontuário
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-400">
              <FileText className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold text-zinc-700">Nenhum Paciente Selecionado</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Selecione um paciente na lista lateral para visualizar e adicionar notas ao
                prontuário.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
