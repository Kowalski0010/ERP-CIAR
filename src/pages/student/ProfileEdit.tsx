import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { UserCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function ProfileEdit() {
  const { students } = useAppStore()
  const { toast } = useToast()
  const student = students[0]

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Solicitação Enviada',
      description:
        'A alteração de dados pessoais foi enviada para aprovação da secretaria/responsável.',
    })
  }

  if (!student) return <div className="p-8 text-center text-zinc-500">Nenhum dado encontrado.</div>

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[800px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-zinc-400" />
          Alteração de Dados Pessoais
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Atualize suas informações de contato. As alterações precisam ser validadas pela
          instituição.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
          <CardTitle className="text-lg">Dados Cadastrais</CardTitle>
          <CardDescription className="text-xs">
            Campos financeiros e acadêmicos não podem ser alterados por aqui.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Nome Completo
                </Label>
                <Input defaultValue={student.name} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  E-mail Principal
                </Label>
                <Input defaultValue={student.email || ''} type="email" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Telefone Celular
                </Label>
                <Input defaultValue={student.phone || ''} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Endereço Residencial (Rua)
                </Label>
                <Input defaultValue={student.address?.street || ''} className="h-9" />
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-6 flex justify-end">
              <Button type="submit" className="shadow-sm">
                <Save className="h-4 w-4 mr-2" /> Solicitar Alteração
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
