import { useAppStore } from '@/contexts/AppContext'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lock } from 'lucide-react'

export default function Login() {
  const { login, isAuthenticated } = useAppStore()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-[#1e3a8a] rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-[#1e3a8a]">
            CIAR Portal
          </CardTitle>
          <CardDescription>Faça login para acessar o sistema integrado</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail ou Matrícula</Label>
              <Input
                required
                type="text"
                placeholder="admin@instituicao.com"
                defaultValue="admin@instituicao.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Senha</Label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Input required type="password" placeholder="••••••••" defaultValue="password" />
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
