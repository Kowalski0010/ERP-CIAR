import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CalendarDays, FileText, Download, Activity, Clock, FileBadge } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function PortalDashboard() {
  const { acrPatients, acrAppointments, acrRecords } = useAppStore()
  // Mock logged-in patient
  const patient = acrPatients[0]

  if (!patient)
    return (
      <div className="p-8 text-center text-zinc-500">Acesso negado ou paciente não encontrado.</div>
    )

  const myAppointments = acrAppointments
    .filter((a) => a.patientId === patient.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const upcomingAppointments = myAppointments.filter((a) => new Date(a.date) >= new Date())

  const myRecords = acrRecords
    .filter((r) => r.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Collect all attachments from all records for the document repository view
  const myDocuments = myRecords.flatMap(
    (r) =>
      r.attachments?.map((att) => ({
        ...att,
        recordDate: r.date,
        professional: r.professional,
      })) || [],
  )

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Olá, {patient.name.split(' ')[0]}!
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Bem-vindo(a) ao seu Portal de Saúde e Acompanhamento Clínico.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agenda */}
        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
              <CardTitle className="text-base text-blue-900 flex items-center gap-2">
                <CalendarDays className="h-5 w-5" /> Próximas Sessões
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-100">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((app) => (
                  <div key={app.id} className="p-4 hover:bg-zinc-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-zinc-900">
                        {app.analysisType || 'Consulta'}
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] whitespace-nowrap"
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(app.date).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-zinc-500 flex flex-col items-center">
                  <CalendarDays className="h-8 w-8 mb-2 opacity-20" />
                  Nenhum agendamento futuro encontrado.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle/Right Column: History and Docs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="text-base text-zinc-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-zinc-400" /> Meu Histórico Clínico
              </CardTitle>
              <CardDescription className="text-xs">
                Acompanhe o registro de evoluções e prontuários das suas consultas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-100">
              {myRecords.length > 0 ? (
                myRecords.map((rec) => (
                  <div key={rec.id} className="p-5 hover:bg-zinc-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                          {new Date(rec.date).toLocaleDateString('pt-BR')}
                        </span>
                        <h4 className="font-semibold text-sm text-zinc-900">
                          Atendimento com {rec.professional}
                        </h4>
                      </div>
                      {rec.signed ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 self-start"
                        >
                          Finalizado
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-zinc-100 text-zinc-600 border-zinc-200 self-start"
                        >
                          Em Andamento
                        </Badge>
                      )}
                    </div>
                    {rec.signed ? (
                      <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-4 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                        {rec.notes}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic bg-zinc-50 p-3 rounded-md border border-dashed border-zinc-200">
                        As notas deste atendimento ficarão disponíveis após a assinatura do
                        profissional.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-sm text-zinc-500 flex flex-col items-center">
                  <Activity className="h-10 w-10 mb-3 opacity-20" />
                  Nenhum registro consolidado no seu histórico.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="text-base text-zinc-900 flex items-center gap-2">
                <FileBadge className="h-5 w-5 text-zinc-400" /> Repositório de Documentos e Exames
              </CardTitle>
              <CardDescription className="text-xs">
                Acesse os arquivos e laudos anexados aos seus prontuários.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myDocuments.length > 0 ? (
                myDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg hover:border-blue-300 transition-colors bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-semibold text-zinc-900 truncate"
                          title={doc.name}
                        >
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                          {new Date(doc.recordDate).toLocaleDateString('pt-BR')} •{' '}
                          {doc.professional}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 ml-2 h-8 w-8" asChild>
                      <a href={doc.url} target="_blank" rel="noreferrer" download>
                        <Download className="h-4 w-4 text-zinc-500 hover:text-blue-600" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-1 sm:col-span-2 p-8 text-center text-sm text-zinc-500 flex flex-col items-center">
                  <FileText className="h-8 w-8 mb-2 opacity-20" />
                  Nenhum documento ou exame compartilhado.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
