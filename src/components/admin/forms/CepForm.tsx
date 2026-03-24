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
import { CepRecord } from '@/lib/types'

const schema = z.object({
  cep: z.string().min(8, 'CEP inválido'),
  street: z.string().min(3, 'Rua obrigatória'),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Sigla de UF inválida'),
})

export function CepForm({
  onCancel,
  initialData,
}: {
  onCancel: () => void
  initialData?: CepRecord | null
}) {
  const { toast } = useToast()
  const { addCep, updateCep } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      cep: initialData?.cep || '',
      street: initialData?.street || '',
      neighborhood: initialData?.neighborhood || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (initialData?.id) {
      updateCep(initialData.id, data)
      toast({ title: 'CEP Atualizado', description: 'Registro atualizado com sucesso.' })
    } else {
      addCep(data)
      toast({ title: 'CEP Salvo', description: 'Registro criado com sucesso.' })
    }
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input placeholder="00000-000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Rua das Flores" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: SP" maxLength={2} {...field} />
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
