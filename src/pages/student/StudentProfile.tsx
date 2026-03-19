import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { UserCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function StudentProfile() {
  const { students, updateStudent } = useAppStore()
  const { toast } = useToast()
  const student = students[0]

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Dados Atualizados',
      description: 'Suas informações de contato foram salvas com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[800px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-zinc-400" />
          Meu Perfil
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gerencie seus dados cadastrais e informações de contato.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center gap-4 py-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src={student.avatar} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <CardDescription className="font-mono text-xs mt-1">
              RA: {student.id.padStart(8, '0')}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  E-mail Principal
                </Label>
                <Input defaultValue={student.email} type="email" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Telefone Celular
                </Label>
                <Input defaultValue={student.phone} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Curso Matriculado
                </Label>
                <Input
                  defaultValue={student.course}
                  disabled
                  className="h-9 bg-zinc-50 text-zinc-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  CPF
                </Label>
                <Input
                  defaultValue={student.cpf}
                  disabled
                  className="h-9 bg-zinc-50 text-zinc-500 font-mono"
                />
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-6 flex justify-end">
              <Button type="submit" className="shadow-sm">
                <Save className="h-4 w-4 mr-2" /> Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
