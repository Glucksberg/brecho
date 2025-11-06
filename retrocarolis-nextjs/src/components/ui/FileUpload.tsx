'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export interface FileUploadProps {
  label?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  value?: File[]
  onChange?: (files: File[]) => void
  error?: string
  helperText?: string
  preview?: boolean
}

export function FileUpload({
  label,
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 5, // 5MB default
  value = [],
  onChange,
  error,
  helperText,
  preview = true
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = React.useState<string[]>([])

  React.useEffect(() => {
    if (preview && value.length > 0) {
      const newPreviews = value.map(file => URL.createObjectURL(file))
      setPreviews(newPreviews)

      return () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url))
      }
    }
  }, [value, preview])

  const handleFiles = (files: FileList | null) => {
    if (!files || !onChange) return

    const fileArray = Array.from(files)

    // Validate file count
    if (value.length + fileArray.length > maxFiles) {
      alert(`Você pode enviar no máximo ${maxFiles} arquivos`)
      return
    }

    // Validate file size
    const invalidFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024)
    if (invalidFiles.length > 0) {
      alert(`Alguns arquivos excedem o tamanho máximo de ${maxSize}MB`)
      return
    }

    onChange([...value, ...fileArray])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeFile = (index: number) => {
    if (!onChange) return
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          error && 'border-red-500'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-10 h-10 text-gray-400" />
          <div>
            <p className="font-medium text-gray-700">
              Clique para fazer upload ou arraste arquivos
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {accept === 'image/*' && 'PNG, JPG, GIF até '}
              {maxSize}MB • Máximo {maxFiles} arquivos
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {preview && previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File List (without preview) */}
      {!preview && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
