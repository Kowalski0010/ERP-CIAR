import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Plus, Phone, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lead } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { AddStudentDialog } from '@/components/AddStudentDialog'

const columns = [
  { id: 'Novo', label: 'Novo Lead', color: 'border-l-blue-500' },
  { id: 'Contatado', label: 'Contatado', color: 'border-l-amber-500' },
  { id: 'Visita', label: 'Visita Agendada', color: 'border-l-purple-500' },
  { id: 'Pendente', label: 'Matrícula Pendente', color: 'border-l-emerald-500' },
]

export default function Leads() {
  const { leads, updateLeadStatus, addStudent } = useAppStore()
  const { toast } = useToast()
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null)

  const handleAdvance = (lead: Lead) => {
    const currentIndex = columns.findIndex((c) => c.id === lead.status)
    if (currentIndex < columns.length - 1) {
      updateLeadStatus(lead.id, columns[currentIndex + 1].id as Lead['status'])
      toast({ title: 'Lead Movido', description: `${lead.name} avançou no funil.` })
    } else {
      // Trigger conversion dialog
      setConvertingLead(lead)
    }
  }

  const handleConvertSuccess = (student: any) => {
    if (convertingLead) {
      addStudent(student)
      updateLeadStatus(convertingLead.id, 'Ganho')
      toast({
        title: 'Lead Convertido!',
        description: `${student.name} agora é um aluno matriculado.`,
        variant: 'default',
      })
      setConvertingLead(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up flex flex-col h-[calc(100vh-120px)]">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM / Leads</h1>
          <p className="text-muted-foreground">Funil de captação e conversão de alunos.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-stretch">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id)
          return (
            <div
              key={col.id}
              className="min-w-[300px] flex-1 bg-muted/40 rounded-xl p-3 flex flex-col border shadow-inner"
            >
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                  {col.label}
                </h3>
                <span className="bg-background text-xs font-bold px-2 py-1 rounded-full border">
                  {colLeads.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    className={`shadow-sm border-l-4 ${col.color} cursor-pointer hover:-translate-y-1 transition-transform duration-200 group`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-foreground leading-tight">{lead.name}</h4>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(lead.dateAdded).toLocaleDateString('pt-BR').slice(0, 5)}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium mt-1">{lead.courseInterest}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </div>

                      <div className="mt-4 pt-3 border-t flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 text-xs w-full"
                          onClick={() => handleAdvance(lead)}
                        >
                          {lead.status === 'Pendente' ? (
                            <>
                              <UserPlus className="w-3 h-3 mr-1" /> Converter em Aluno
                            </>
                          ) : (
                            'Avançar'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <AddStudentDialog
        open={!!convertingLead}
        onOpenChange={(open) => !open && setConvertingLead(null)}
        initialData={
          convertingLead
            ? {
                name: convertingLead.name,
                phone: convertingLead.phone,
                course: convertingLead.courseInterest,
              }
            : undefined
        }
        onSuccess={handleConvertSuccess}
      />
    </div>
  )
}
