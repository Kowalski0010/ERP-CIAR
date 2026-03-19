import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Student } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<Student>
  onSuccess: (student: Student) => void
}

export function AddStudentDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: AddStudentDialogProps) {
  const [formData, setFormData] = useState<Partial<Student>>({})

  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        course: initialData?.course || '',
        address: initialData?.address || '',
        rg: initialData?.rg || '',
        cpf: initialData?.cpf || '',
        observations: initialData?.observations || [],
      })
    }
  }, [open, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      rg: formData.rg || '',
      cpf: formData.cpf || '',
      course: formData.course || '',
      status: 'Ativo',
      enrollmentDate: new Date().toISOString(),
      avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${Math.floor(Math.random() * 100)}`,
      observations: formData.observations || [],
    }

    onSuccess(newStudent)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Matricular Novo Aluno</DialogTitle>
          <DialogDescription>
            Preencha todos os dados pessoais e acadêmicos do aluno.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Curso *</Label>
                <Input
                  id="course"
                  name="course"
                  value={formData.course || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" name="rg" value={formData.rg || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" name="cpf" value={formData.cpf || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="obs">Observações / Outros Detalhes</Label>
                <Textarea
                  id="obs"
                  name="obs"
                  placeholder="Informações adicionais sobre o aluno..."
                  onChange={(e) => {
                    const val = e.target.value
                    if (val) {
                      setFormData((prev) => ({
                        ...prev,
                        observations: [
                          {
                            id: 'temp',
                            text: val,
                            author: 'Admin',
                            date: new Date().toISOString(),
                          },
                        ],
                      }))
                    } else {
                      setFormData((prev) => ({ ...prev, observations: [] }))
                    }
                  }}
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20 shrink-0">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="student-form">
            Salvar Matrícula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
