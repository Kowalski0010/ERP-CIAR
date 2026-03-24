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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Student, FinancialPlan, SystemAttachment } from '@/lib/types'
import { FileUpload } from '@/components/FileUpload'
import { Check } from 'lucide-react'

const studentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  course: z.string().min(1, 'Selecione um curso'),
  planInstallments: z.coerce.number().min(1, 'Número de parcelas deve ser maior que 0'),
  planValue: z.coerce.number().min(0.01, 'Valor da parcela deve ser maior que zero'),
  planFirstDueDate: z.string().min(1, 'A data do 1º vencimento é obrigatória'),
  avatar: z.string().optional(),
  rgDoc: z.string().optional(),
  cpfDoc: z.string().optional(),
  addressDoc: z.string().optional(),
  diplomaDoc: z.string().optional(),
})

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: { name: string; phone: string; course: string }
  onSuccess: (student: Student, plan: FinancialPlan) => void
}

export function AddStudentDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: AddStudentDialogProps) {
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      course: '',
      planInstallments: 12,
      planValue: 850,
      planFirstDueDate: new Date().toISOString().split('T')[0],
      avatar: '',
      rgDoc: '',
      cpfDoc: '',
      addressDoc: '',
      diplomaDoc: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name || '',
          email: '',
          phone: initialData.phone || '',
          cpf: '',
          course: initialData.course || '',
          planInstallments: 12,
          planValue: 850,
          planFirstDueDate: new Date().toISOString().split('T')[0],
          avatar: '',
          rgDoc: '',
          cpfDoc: '',
          addressDoc: '',
          diplomaDoc: '',
        })
      } else {
        form.reset()
      }
    }
  }, [open, initialData, form])

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    const attachments: SystemAttachment[] = []
    if (data.rgDoc)
      attachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Cópia do RG',
        url: data.rgDoc,
        type: 'RG',
        date: new Date().toISOString(),
      })
    if (data.cpfDoc)
      attachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Cópia do CPF',
        url: data.cpfDoc,
        type: 'CPF',
        date: new Date().toISOString(),
      })
    if (data.addressDoc)
      attachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Comprovante de Endereço',
        url: data.addressDoc,
        type: 'Endereço',
        date: new Date().toISOString(),
      })
    if (data.diplomaDoc)
      attachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Diploma ou Histórico',
        url: data.diplomaDoc,
        type: 'Acadêmico',
        date: new Date().toISOString(),
      })

    const student: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      course: data.course,
      status: 'Ativo',
      enrollmentDate: new Date().toISOString(),
      avatar: data.avatar,
      attachments,
    }

    const plan: FinancialPlan = {
      installments: data.planInstallments,
      value: data.planValue,
      firstDueDate: data.planFirstDueDate,
    }

    onSuccess(student, plan)
    onOpenChange(false)
  }

  const renderDocUpload = (name: any, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {field.value ? (
              <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/30">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium truncate flex-1">Arquivo anexado</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] px-2"
                  onClick={() => field.onChange('')}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <FileUpload
                accept="image/*,application/pdf"
                label={`Anexar ${label}`}
                onUpload={(files) => field.onChange(files[0]?.url)}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Nova Matrícula</DialogTitle>
          <DialogDescription>
            Insira os dados do aluno, documentação e informações financeiras.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Dados Pessoais
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Foto do Aluno (Avatar)</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <div className="flex items-center gap-4 p-3 border border-border rounded-md bg-muted/30">
                          <img
                            src={field.value}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover border shadow-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => field.onChange('')}
                          >
                            Remover Foto
                          </Button>
                        </div>
                      ) : (
                        <FileUpload
                          accept="image/*"
                          label="Clique ou arraste a foto do perfil"
                          onUpload={(files) => field.onChange(files[0]?.url)}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João da Silva" {...field} />
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
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="joao@email.com" {...field} />
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
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2 mt-6">
              Documentação (Anexos)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderDocUpload('rgDoc', 'Cópia do RG')}
              {renderDocUpload('cpfDoc', 'Cópia do CPF')}
              {renderDocUpload('addressDoc', 'Comprovante de Endereço')}
              {renderDocUpload('diplomaDoc', 'Diploma / Histórico Escolar')}
            </div>

            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2 mt-6">
              Plano Financeiro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="planInstallments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd. Parcelas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="planValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mensalidade (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="planFirstDueDate"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>1º Vencimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Efetivar Matrícula</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
