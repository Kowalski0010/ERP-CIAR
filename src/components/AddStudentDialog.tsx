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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Student, FinancialPlan, SystemAttachment } from '@/lib/types'
import { FileUpload } from '@/components/FileUpload'
import { Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const studentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  course: z.string().min(1, 'Selecione um curso'),
  nationality: z.string().optional(),
  birthCity: z.string().optional(),
  birthDate: z.string().optional(),
  rg: z.string().optional(),
  rgIssuer: z.string().optional(),
  maritalStatus: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressZipCode: z.string().optional(),
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
  const { toast } = useToast()

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      course: '',
      nationality: '',
      birthCity: '',
      birthDate: '',
      rg: '',
      rgIssuer: '',
      maritalStatus: '',
      motherName: '',
      fatherName: '',
      addressStreet: '',
      addressNumber: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
      addressZipCode: '',
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
      form.reset({
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        course: initialData?.course || '',
        planInstallments: 12,
        planValue: 850,
        planFirstDueDate: new Date().toISOString().split('T')[0],
      })
    }
  }, [open, initialData, form])

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    const attachments: SystemAttachment[] = []
    const addDoc = (url: string | undefined, name: string, type: string) => {
      if (url)
        attachments.push({
          id: Math.random().toString(36).substr(2, 9),
          name,
          url,
          type,
          date: new Date().toISOString(),
        })
    }

    addDoc(data.rgDoc, 'Cópia do RG', 'RG')
    addDoc(data.cpfDoc, 'Cópia do CPF', 'CPF')
    addDoc(data.addressDoc, 'Comprovante de Endereço', 'Endereço')
    addDoc(data.diplomaDoc, 'Diploma / Histórico', 'Acadêmico')

    const registrationCode = `${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`

    const student: Student = {
      id: Math.random().toString(36).substr(2, 9),
      registrationCode,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      rg: data.rg,
      rgIssuer: data.rgIssuer,
      nationality: data.nationality,
      birthCity: data.birthCity,
      birthDate: data.birthDate,
      maritalStatus: data.maritalStatus,
      motherName: data.motherName,
      fatherName: data.fatherName,
      course: data.course,
      status: 'Ativo',
      enrollmentDate: new Date().toISOString(),
      avatar: data.avatar,
      address: {
        street: data.addressStreet || '',
        number: data.addressNumber || '',
        neighborhood: data.addressNeighborhood || '',
        city: data.addressCity || '',
        state: data.addressState || '',
        zipCode: data.addressZipCode || '',
      },
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

  const renderInput = (name: any, label: string, type = 'text', placeholder = '', colSpan = 1) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={colSpan === 2 ? 'sm:col-span-2' : ''}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} value={field.value || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

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

  const onInvalid = () => {
    toast({
      title: 'Atenção',
      description:
        'Existem campos obrigatórios não preenchidos ou inválidos. Verifique todas as abas.',
      variant: 'destructive',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Nova Matrícula</DialogTitle>
          <DialogDescription>
            Insira os dados completos do aluno, documentação e informações financeiras.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4 pt-4">
            <Tabs defaultValue="pessoais" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="pessoais" className="text-xs">
                  Pessoais
                </TabsTrigger>
                <TabsTrigger value="filiacao" className="text-xs">
                  Endereço
                </TabsTrigger>
                <TabsTrigger value="academico" className="text-xs">
                  Acadêmico
                </TabsTrigger>
                <TabsTrigger value="docs" className="text-xs">
                  Docs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pessoais" className="space-y-4">
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
                  {renderInput('name', 'Nome Completo', 'text', 'Ex: João da Silva', 2)}
                  {renderInput('email', 'E-mail', 'email')}
                  {renderInput('phone', 'Telefone', 'text', '(11) 90000-0000')}
                  {renderInput('cpf', 'CPF', 'text', '000.000.000-00')}
                  {renderInput('rg', 'RG')}
                  {renderInput('rgIssuer', 'Órgão Emissor (RG)')}
                  {renderInput('birthDate', 'Data de Nascimento', 'date')}
                  {renderInput('nationality', 'Nacionalidade')}
                  {renderInput('birthCity', 'Cidade Natal')}
                  {renderInput('maritalStatus', 'Estado Civil')}
                </div>
              </TabsContent>

              <TabsContent value="filiacao" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput('motherName', 'Nome da Mãe', 'text', '', 2)}
                  {renderInput('fatherName', 'Nome do Pai', 'text', '', 2)}
                  <div className="col-span-1 sm:col-span-2 border-b border-border my-2" />
                  {renderInput('addressZipCode', 'CEP')}
                  {renderInput('addressStreet', 'Rua/Avenida', 'text', '', 2)}
                  {renderInput('addressNumber', 'Número')}
                  {renderInput('addressNeighborhood', 'Bairro')}
                  {renderInput('addressCity', 'Cidade')}
                  {renderInput('addressState', 'Estado')}
                </div>
              </TabsContent>

              <TabsContent value="academico" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Graduação / Curso</FormLabel>
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-1 sm:col-span-2 border-b border-border my-2" />
                  <h4 className="text-sm font-semibold text-foreground sm:col-span-2">
                    Plano Financeiro
                  </h4>
                  {renderInput('planInstallments', 'Qtd. Parcelas', 'number')}
                  {renderInput('planValue', 'Valor Mensalidade (R$)', 'number')}
                  {renderInput('planFirstDueDate', '1º Vencimento', 'date', '', 2)}
                </div>
              </TabsContent>

              <TabsContent value="docs" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderDocUpload('rgDoc', 'Cópia do RG')}
                  {renderDocUpload('cpfDoc', 'Cópia do CPF')}
                  {renderDocUpload('addressDoc', 'Comprovante de Endereço')}
                  {renderDocUpload('diplomaDoc', 'Diploma / Histórico Escolar')}
                </div>
              </TabsContent>
            </Tabs>

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
