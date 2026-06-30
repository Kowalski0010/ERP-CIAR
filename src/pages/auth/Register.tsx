import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import logoCiar from '@/assets/logo-ciar-e8b89.png'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, UserPlus, Mail } from 'lucide-react'

export default function Register() {
  const { signUp, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Verifique e tente novamente.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('A senha deve conter no mínimo 8 caracteres.')
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError(signUpError.message || 'Erro ao registrar. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-background flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-muted rounded-xl"></div>
          <div className="h-6 w-32 bg-muted rounded"></div>
        </div>
      </div>
    )
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
              Cadastro Realizado!
            </CardTitle>
            <CardDescription>
              Enviamos um e-mail de confirmação para <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-sm font-semibold">Confirme seu e-mail</AlertTitle>
              <AlertDescription className="text-xs mt-1 text-blue-700 dark:text-blue-200">
                Clique no link enviado para seu e-mail para ativar sua conta e acessar o sistema.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full h-11 font-semibold">
              <Link to="/login">Ir para a página de login</Link>
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
            Criar Conta
          </CardTitle>
          <CardDescription>Preencha seus dados para se cadastrar no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erro no Cadastro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                required
                type="text"
                placeholder="João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                required
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Senha</Label>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
