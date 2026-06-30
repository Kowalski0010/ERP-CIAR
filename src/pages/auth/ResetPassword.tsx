import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import logoCiar from '@/assets/logo-ciar-e8b89.png'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ResetPassword() {
  const { updatePassword, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  const getStrength = (pass: string) => {
    let score = 0
    if (pass.length > 7) score += 25
    if (pass.match(/[A-Z]/)) score += 25
    if (pass.match(/[0-9]/)) score += 25
    if (pass.match(/[^A-Za-z0-9]/)) score += 25
    return score
  }

  const strength = getStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    if (strength < 75) {
      setError('Senha fraca. Use maiúsculas, números e caracteres especiais.')
      setLoading(false)
      return
    }

    const { error: updateError } = await updatePassword(password)

    if (updateError) {
      setError(updateError.message || 'Erro ao atualizar senha. Tente novamente.')
      setLoading(false)
      return
    }

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
              Senha Atualizada!
            </CardTitle>
            <CardDescription>Sua senha foi redefinida com sucesso.</CardDescription>
          </CardHeader>
          <CardContent>
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
            Redefinir Senha
          </CardTitle>
          <CardDescription>Defina uma nova senha para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50"
              />
              {password && (
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                  <span>Força</span>
                  <span>{strength < 50 ? 'Fraca' : strength < 100 ? 'Média' : 'Forte'}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Confirmar Nova Senha</Label>
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
              {loading ? (
                'Atualizando...'
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Confirmar Nova Senha
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
