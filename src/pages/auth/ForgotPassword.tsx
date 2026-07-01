import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import logoCiar from '@/assets/logo-ciar-e8b89.png'

export default function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: resetError } = await resetPasswordForEmail(email)

    if (resetError) {
      setError(resetError.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.')
      setLoading(false)
      return
    }

    toast({
      title: 'E-mail Enviado!',
      description: 'Verifique sua caixa de entrada para o link de recuperação de senha.',
    })
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-border">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="mx-auto mb-2 flex justify-center">
              <img src={logoCiar} alt="CIAR" className="h-16 object-contain" />
            </div>
            <div className="mx-auto h-14 w-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
              E-mail Enviado!
            </CardTitle>
            <CardDescription>
              Enviamos um link de recuperação para <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-sm font-semibold">
                Verifique sua caixa de entrada
              </AlertTitle>
              <AlertDescription className="text-xs mt-1 text-blue-700 dark:text-blue-200">
                Clique no link do e-mail para redefinir sua senha. O link expira em alguns minutos.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full h-11 font-semibold">
              <Link to="/login">Voltar para login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto mb-2 flex justify-center">
            <img src={logoCiar} alt="CIAR" className="h-16 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            Recuperar Acesso
          </CardTitle>
          <CardDescription>
            Informe seu e-mail para receber um link de recuperação de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail Cadastrado</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-9 bg-muted/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? (
                'Enviando...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Link de Recuperação
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
