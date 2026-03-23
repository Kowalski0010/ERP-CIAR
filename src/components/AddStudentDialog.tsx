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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Student, FinancialPlan } from '@/lib/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const studentSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório (mínimo 3 caracteres)'),
  cpf: z.string().min(11, 'CPF obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone obrigatório'),
  course: z.string().min(1, 'Curso é obrigatório'),
  planValue: z.coerce.number().min(1, 'Valor do plano obrigatório'),
  installments: z.coerce.number().min(1, 'Número de parcelas inválido'),
})

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (student: Student, plan: FinancialPlan) => void
  initialData?: {
    name?: string
    phone?: string
    course?: string
  }
}

export function AddStudentDialog({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: AddStudentDialogProps) {
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: initialData?.name || '',
      cpf: '',
      email: '',
      phone: initialData?.phone || '',
      course: initialData?.course || 'Engenharia de Software',
      planValue: 850,
      installments: 12,
    },
  })

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    const student: Student = {
      id: `S${Math.floor(Math.random() * 10000)}`,
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      course: data.course,
      status: 'Ativo',
      enrollmentDate: new Date().toISOString(),
      avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${Math.floor(Math.random() * 100)}`,
    }

    const plan: FinancialPlan = {
      value: data.planValue,
      installments: data.installments,
      firstDueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days from now
    }

    onSuccess(student, plan)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Nova Matrícula</DialogTitle>
          <DialogDescription>
            Insira os dados do novo aluno e as condições do plano financeiro.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                Dados Pessoais
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail Principal</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="joao@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                Dados Acadêmicos e Financeiros
              </h3>

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Engenharia de Software">
                          Engenharia de Software
                        </SelectItem>
                        <SelectItem value="Administração">Administração</SelectItem>
                        <SelectItem value="Direito">Direito</SelectItem>
                        <SelectItem value="Design Gráfico">Design Gráfico</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="planValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Mensal (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº de Parcelas</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-border mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Finalizar Matrícula</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
