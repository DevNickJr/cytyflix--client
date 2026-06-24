"use client"

import { useState, useCallback, useRef } from "react"
import { uploadImage } from "@/lib/upload"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  label?: string
  required?: boolean
  pathPrefix?: string
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 5,
  label = "Images",
  required = false,
  pathPrefix = "uploads",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const remaining = maxFiles - value.length
      if (remaining <= 0) {
        toast.error(`Maximum ${maxFiles} images allowed`)
        return
      }

      const toUpload = fileArray.slice(0, remaining)
      setUploading(true)

      try {
        const uploadPromises = toUpload.map(async (file, index) => {
          const id = `${Date.now()}_${index}`
          const path = `cytyflix/${pathPrefix}/${Date.now()}_${index}_${file.name}`
          const url = await uploadImage(file, path, (p) => {
            setProgress((prev) => ({ ...prev, [id]: p }))
          })
          setProgress((prev) => {
            const next = { ...prev }
            delete next[id]
            return next
          })
          return url
        })

        const urls = await Promise.all(uploadPromises)
        onChange([...value, ...urls])
      } catch {
        toast.error("Failed to upload one or more images")
      } finally {
        setUploading(false)
        setProgress({})
      }
    },
    [value, onChange, maxFiles, pathPrefix]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url))
  }

  const activeUploads = Object.keys(progress).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxFiles}
        </span>
      </div>

      {value.length < maxFiles && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files)
              e.target.value = ""
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Uploading {activeUploads} image{activeUploads > 1 ? "s" : ""}...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB each
              </p>
            </div>
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group aspect-video bg-muted rounded-lg overflow-hidden"
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(url)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="h-3.5 w-3.5" />
          No images uploaded yet
        </div>
      )}
    </div>
  )
}
