import { Button } from '@/components/ui/button'

export function LancarFrequenciaForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form className="space-y-4 text-center py-6">
      <p className="text-muted-foreground mb-4">
        A chamada agora é feita digitalmente pelo módulo:
        <br /> <strong>Pedagógico &gt; Chamada Digital (QR Code)</strong>.
      </p>
      <Button type="button" onClick={onCancel}>
        Voltar
      </Button>
    </form>
  )
}
