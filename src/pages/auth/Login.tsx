import { useState, useEffect } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lock, Info } from 'lucide-react'
import { Role } from '@/lib/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Login() {
  const { login, isAuthenticated, setCurrentUserRole } = useAppStore()
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('Admin')
  const [email, setEmail] = useState('demo@instituicao.com')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated || user) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('Credenciais inválidas. Verifique o e-mail e senha.')
      setLoading(false)
      return
    }

    setCurrentUserRole(role)
    login(role)
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            CIAR Portal
          </CardTitle>
          <CardDescription>Faça login para acessar o sistema integrado</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-sm font-semibold">Acesso de Demonstração</AlertTitle>
            <AlertDescription className="text-xs mt-1 text-blue-700 dark:text-blue-200">
              As credenciais já estão preenchidas para facilitar o acesso. Basta escolher o{' '}
              <strong>Perfil de Acesso</strong> desejado e clicar em "Entrar no Sistema".
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erro no Login</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <Select value={role} onValueChange={(v: Role) => setRole(v)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrador (Visão Completa)</SelectItem>
                  <SelectItem value="Secretaria">Secretaria Escolar</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Professor">Corpo Docente</SelectItem>
                  <SelectItem value="Aluno">Portal do Aluno</SelectItem>
                  <SelectItem value="Responsável">Portal do Responsável</SelectItem>
                  <SelectItem value="Paciente">Portal do Paciente (Clínica)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                required
                type="email"
                placeholder="admin@instituicao.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Senha</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
