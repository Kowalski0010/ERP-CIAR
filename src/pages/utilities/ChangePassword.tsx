import { useState } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

export default function ChangePassword() {
  const { toast } = useToast()
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')

  const getStrength = (pass: string) => {
    let score = 0
    if (pass.length > 7) score += 25
    if (pass.match(/[A-Z]/)) score += 25
    if (pass.match(/[0-9]/)) score += 25
    if (pass.match(/[^A-Za-z0-9]/)) score += 25
    return score
  }

  const strength = getStrength(newPass)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirm) {
      toast({
        variant: 'destructive',
        title: 'Erro na Confirmação',
        description: 'A nova senha e a confirmação não coincidem.',
      })
      return
    }

    if (strength < 75) {
      toast({
        variant: 'destructive',
        title: 'Senha Fraca',
        description:
          'Por favor, crie uma senha mais forte (inclua números e caracteres especiais).',
      })
      return
    }

    toast({
      title: 'Senha Atualizada',
      description: 'Sua credencial de acesso foi alterada com sucesso.',
    })
    setCurrent('')
    setNewPass('')
    setConfirm('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[600px] mx-auto mt-8">
      <div className="text-center mb-8">
        <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Alteração de Senha</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto">
          Mantenha sua conta segura. Recomendamos atualizar sua senha a cada 90 dias.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Credenciais de Acesso
          </CardTitle>
          <CardDescription>Preencha os campos abaixo para definir uma nova senha.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="current" className="text-xs font-semibold text-zinc-700">
                Senha Atual
              </Label>
              <Input
                id="current"
                type="password"
                required
                className="bg-zinc-50"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new" className="text-xs font-semibold text-zinc-700">
                  Nova Senha
                </Label>
                <Input
                  id="new"
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                {newPass && (
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                      <span>Força da Senha</span>
                      <span>{strength < 50 ? 'Fraca' : strength < 100 ? 'Média' : 'Forte'}</span>
                    </div>
                    <Progress
                      value={strength}
                      className={`h-1.5 ${strength < 50 ? '[&>div]:bg-rose-500' : strength < 100 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-xs font-semibold text-zinc-700">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" className="shadow-sm">
                Cancelar
              </Button>
              <Button type="submit" className="shadow-sm">
                Confirmar Alteração
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-zinc-400 mt-4">
        A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere
        especial.
      </div>
    </div>
  )
}
