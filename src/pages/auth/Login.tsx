import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
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
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('Admin')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentUserRole(role)
    login()

    if (role === 'Aluno') {
      navigate('/student/dashboard')
    } else if (role === 'Responsável') {
      navigate('/parent/dashboard')
    } else if (role === 'Paciente') {
      navigate('/portal')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto w-16 h-16 bg-[#1e3a8a] rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-[#1e3a8a]">
            CIAR Portal
          </CardTitle>
          <CardDescription>Faça login para acessar o sistema integrado</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-sm font-semibold">Acesso de Demonstração</AlertTitle>
            <AlertDescription className="text-xs mt-1 text-blue-700">
              As credenciais já estão preenchidas para facilitar o acesso. Basta escolher o{' '}
              <strong>Perfil de Acesso</strong> desejado e clicar em "Entrar no Sistema".
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <Select value={role} onValueChange={(v: Role) => setRole(v)}>
                <SelectTrigger className="bg-white">
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
              <Label>E-mail ou Matrícula</Label>
              <Input
                required
                type="text"
                placeholder="admin@instituicao.com"
                defaultValue="demo@instituicao.com"
                className="bg-zinc-50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Senha</Label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Input
                required
                type="password"
                placeholder="••••••••"
                defaultValue="demo1234"
                className="bg-zinc-50"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-semibold"
            >
              Entrar no Sistema
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
