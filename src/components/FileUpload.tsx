import React, { useState, useRef } from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploadedFile {
  id: string
  name: string
  url: string
  type: string
  date: string
}

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void
  accept?: string
  multiple?: boolean
  label?: string
}

export function FileUpload({
  onUpload,
  accept,
  multiple = false,
  label = 'Clique ou arraste arquivos',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    // Simulate an upload delay for realistic UX
    await new Promise((res) => setTimeout(res, 800))

    const uploaded: UploadedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      url: URL.createObjectURL(f), // Mock URL representing the "uploaded" file
      type: f.type,
      date: new Date().toISOString(),
    }))

    onUpload(uploaded)
    setIsUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer',
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
        isUploading && 'opacity-50 pointer-events-none',
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {isUploading ? (
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
      ) : (
        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
      )}
      <p className="text-sm font-medium">{isUploading ? 'Enviando...' : label}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {accept ? `Formatos permitidos: ${accept}` : 'Qualquer formato suportado'}
      </p>
    </div>
  )
}
