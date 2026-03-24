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
import { useAppStore } from '@/contexts/AppContext'
import { Convenio } from '@/lib/types'

const schema = z.object({
  name: z.string().min(3, 'Nome do parceiro obrigatório'),
  contract: z.string().min(2, 'Número do contrato obrigatório'),
  discount: z.coerce.number().min(0).max(100, 'Desconto não pode exceder 100%'),
})

export function ConvenioForm({
  onCancel,
  initialData,
}: {
  onCancel: () => void
  initialData?: Convenio | null
}) {
  const { toast } = useToast()
  const { addConvenio, updateConvenio } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      contract: initialData?.contract || '',
      discount: initialData?.discount || 0,
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (initialData?.id) {
      updateConvenio(initialData.id, data)
      toast({ title: 'Convênio Atualizado', description: 'Registro atualizado com sucesso.' })
    } else {
      addConvenio(data)
      toast({ title: 'Convênio Salvo', description: 'Registro criado com sucesso.' })
    }
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Parceiro/Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sindicato XYZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contract"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº do Contrato Base</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: CONV-2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desconto Fixo (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? 'Atualizar Registro' : 'Salvar Registro'}</Button>
        </div>
      </form>
    </Form>
  )
}
