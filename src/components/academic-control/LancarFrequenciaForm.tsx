import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const freqSchema = z.object({
  classId: z.string().min(1, 'Turma obrigatória'),
  date: z.string().min(1, 'Data obrigatória'),
  absentCount: z.coerce.number().min(0, 'Não pode ser negativo'),
})

export function LancarFrequenciaForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof freqSchema>>({
    resolver: zodResolver(freqSchema),
    mode: 'onChange',
    defaultValues: { classId: '', date: new Date().toISOString().split('T')[0], absentCount: 0 },
  })

  const onSubmit = (data: z.infer<typeof freqSchema>) => {
    toast({ title: 'Frequência Salva', description: 'Diário de classe atualizado.' })
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma</FormLabel>
              <FormControl>
                <Input placeholder="Código da Turma..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Referência</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="absentCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total de Faltas Apuradas (Lote Rápido)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Efetivar Lançamento</Button>
        </div>
      </form>
    </Form>
  )
}
