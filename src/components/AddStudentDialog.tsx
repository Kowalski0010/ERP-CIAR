import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { StudentForm } from '@/components/academic/StudentForm'

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  onSuccess: (student?: any, plan?: any) => void
}

export function AddStudentDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: AddStudentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Nova Matrícula Rápida</DialogTitle>
          <DialogDescription>
            Insira os dados completos do aluno. O sistema matriculará e gerará o financeiro
            automaticamente.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <StudentForm
            initialData={initialData}
            onSuccess={() => {
              onSuccess()
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
