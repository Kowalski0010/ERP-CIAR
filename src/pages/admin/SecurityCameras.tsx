import { Card } from '@/components/ui/card'
import { Cctv, AlertCircle } from 'lucide-react'

export default function SecurityCameras() {
  const cameras = [
    { id: 1, name: 'Portão Principal', status: 'online' },
    { id: 2, name: 'Pátio Central', status: 'online' },
    { id: 3, name: 'Corredor Blocos A/B', status: 'online' },
    { id: 4, name: 'Refeitório', status: 'online' },
    { id: 5, name: 'Estacionamento Frontal', status: 'online' },
    { id: 6, name: 'Biblioteca (Fundos)', status: 'offline' },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <Cctv className="h-7 w-7 text-zinc-400" />
          Monitoramento CFTV
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Acesso em tempo real às câmeras de segurança da instituição.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((cam) => (
          <Card
            key={cam.id}
            className="overflow-hidden bg-black text-white border-zinc-800 shadow-md"
          >
            <div className="relative aspect-video flex items-center justify-center bg-zinc-900">
              {cam.status === 'online' ? (
                <>
                  <img
                    src={`https://img.usecurling.com/p/600/400?q=cctv,hallway&seed=${cam.id}`}
                    alt={cam.name}
                    className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-mono text-red-500 flex items-center gap-2 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-mono text-zinc-200 backdrop-blur-sm">
                    CAM 0{cam.id} - {cam.name}
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    {new Date().toLocaleTimeString('pt-BR')}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-xs font-mono uppercase tracking-widest">Sinal Perdido</span>
                  <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-mono text-zinc-400 backdrop-blur-sm">
                    CAM 0{cam.id} - {cam.name}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
