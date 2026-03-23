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

const editarSchema = z.object({
  id: z.string().min(1, 'Matrícula é obrigatória'),
  name: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
})

export function EditarAlunoForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof editarSchema>>({
    resolver: zodResolver(editarSchema),
    mode: 'onChange',
    defaultValues: { id: '', name: '', email: '' },
  })

  const onSubmit = (data: z.infer<typeof editarSchema>) => {
    toast({ title: 'Aluno Atualizado', description: 'Registro acadêmico modificado.' })
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula / ID</FormLabel>
              <FormControl>
                <Input placeholder="Buscar por Matrícula..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail Pessoal</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Atualizar Aluno</Button>
        </div>
      </form>
    </Form>
  )
}

const trocarSchema = z.object({
  studentId: z.string().min(1, 'Matrícula obrigatória'),
  newClass: z.string().min(1, 'Nova turma obrigatória'),
})

export function TrocarTurmaForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof trocarSchema>>({
    resolver: zodResolver(trocarSchema),
    mode: 'onChange',
    defaultValues: { studentId: '', newClass: '' },
  })

  const onSubmit = (data: z.infer<typeof trocarSchema>) => {
    toast({ title: 'Transferência Concluída', description: 'Aluno movido para nova turma.' })
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno (Matrícula)</FormLabel>
              <FormControl>
                <Input placeholder="Digite a matrícula..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma de Destino</FormLabel>
              <FormControl>
                <Input placeholder="Código da nova turma..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Efetivar Troca</Button>
        </div>
      </form>
    </Form>
  )
}
