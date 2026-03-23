import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldCheck, Mail, KeyRound, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Token Enviado',
      description: 'Enviamos instruções seguras para sua caixa de entrada.',
    })
    setStep(2)
  }

  const handleValidateToken = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Senha Redefinida',
      description: 'Sua senha foi atualizada com sucesso. Acesse o sistema.',
    })
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#1e3a8a]" />
        <CardHeader className="pb-6">
          <Button variant="ghost" size="icon" className="h-8 w-8 mb-4 -ml-2 text-zinc-500" asChild>
            <Link to="/login">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CardTitle className="text-xl font-bold">Recuperação de Acesso</CardTitle>
          <CardDescription>
            Fluxo seguro para redefinir sua senha de forma independente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendEmail} className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label>E-mail Cadastrado</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    required
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                Enviar Link de Recuperação
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleValidateToken} className="space-y-4 animate-fade-in">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 mb-4">
                Enviamos um código de segurança com 6 dígitos para <strong>{email}</strong>.
              </div>
              <div className="space-y-2">
                <Label>Token de Validação</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    required
                    placeholder="000000"
                    className="pl-9 font-mono tracking-[0.5em] text-center text-lg"
                    maxLength={6}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                Validar Código Seguro
              </Button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input required type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <Input required type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                <ShieldCheck className="h-4 w-4 mr-2" /> Confirmar Nova Senha
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
