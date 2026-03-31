import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Teacher } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'

const teacherSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  subjects: z.string().optional(),
  workload: z.coerce.number().optional(),
})

interface AddTeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (teacher: Teacher) => void
}

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: AddTeacherDialogProps) {
  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      rg: '',
      subjects: '',
      workload: 20,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = async (data: z.infer<typeof teacherSchema>) => {
    const registrationCode = `${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const { data: saved, error } = await supabase
        .from('teachers')
        .insert([
          {
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            cpf: data.cpf || null,
            rg: data.rg || null,
            subjects: data.subjects || null,
            workload: data.workload || 40,
            status: 'Ativo',
          },
        ])
        .select()
        .single()

      if (error) throw error

      onSuccess({ ...saved, registrationCode } as any)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      const teacher = {
        id: Math.random().toString(36).substr(2, 9),
        registrationCode,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        rg: data.rg,
        subjects: data.subjects ? data.subjects.split(',').map((s) => s.trim()) : [],
        workload: data.workload || 40,
        status: 'Ativo',
      }
      onSuccess(teacher as any)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Cadastrar Docente</DialogTitle>
          <DialogDescription>Preencha as informações do novo professor.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Roberto Lemos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="roberto@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 90000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disciplinas (Separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input placeholder="Cálculo I, Física..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carga Horária Semanal (h)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Docente</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
