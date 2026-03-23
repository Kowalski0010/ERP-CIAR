import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'

export default function Orders() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-zinc-400" />
            Pedidos de Compra
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestão de ordens de compra e aquisições da instituição.
          </p>
        </div>
      </div>
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
          <CardTitle className="text-base text-zinc-800">Módulo em Construção</CardTitle>
        </CardHeader>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <ShoppingCart className="h-16 w-16 text-zinc-200 mb-4" />
          <p className="text-sm text-zinc-500 max-w-md">
            Esta funcionalidade está sendo implementada e estará disponível na próxima atualização
            do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
