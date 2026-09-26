"use client"

import { useState, useCallback, useRef } from "react"
import { uploadVideo } from "@/lib/upload"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, Video } from "lucide-react"
import VideoProcessor from "@/components/properties/video-processor"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface VideoUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  required?: boolean
  pathPrefix?: string
  minDuration?: number
  maxDuration?: number
  maxSizeMB?: number
}

function validateVideoDuration(file: File, min: number, max: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      if (video.duration < min) {
        reject(new Error(`Video must be at least ${min} seconds long`))
      } else if (video.duration > max) {
        reject(new Error(`Video must be at most ${max} seconds long`))
      } else {
        resolve()
      }
    }
    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error("Could not read video file"))
    }
    video.src = URL.createObjectURL(file)
  })
}

export function VideoUpload({
  value,
  onChange,
  label = "Walkthrough Video",
  required = false,
  pathPrefix = "uploads",
  minDuration = 20,
  maxDuration = 60,
  maxSizeMB = 100,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [fileToProcess, setFileToProcess] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadProcessedVideo = async (file: File) => {
      setUploading(true)
      setProgress(0)
      setFileToProcess(null)

      try {
        const path = `cytyflix/${pathPrefix}/${Date.now()}_${file.name}`
        const url = await uploadVideo(file, path, (p) => setProgress(p))
        onChange(url)
      } catch {
        toast.error("Failed to upload video")
      } finally {
        setUploading(false)
        setProgress(0)
      }
  }

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a video file (MP4, MOV, or WebM)")
        return
      }

      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > maxSizeMB) {
        toast.error(`Video must be under ${maxSizeMB}MB (yours is ${sizeMB.toFixed(1)}MB)`)
        return
      }

      setFileToProcess(file)
    },
    [maxSizeMB]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const removeVideo = () => {
    onChange("")
  }

  if (fileToProcess) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {label} - Crop & Trim
          </label>
        </div>
        <div className="border rounded-lg overflow-hidden bg-white">
            <VideoProcessor 
              file={fileToProcess} 
              onProcessComplete={(processedFile) => {
                  uploadProcessedVideo(processedFile);
              }} 
              onCancel={() => setFileToProcess(null)} 
            />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {value && (
          <span className="text-xs text-green-600 font-medium">Uploaded</span>
        )}
      </div>

      {!value && (
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
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0])
              e.target.value = ""
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Uploading... {Math.round(progress)}%
              </p>
              <div className="w-full max-w-xs bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop a video here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, WebM &middot; {minDuration}-{maxDuration} seconds &middot; Max {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="relative group rounded-lg overflow-hidden bg-muted">
          <video
            src={value}
            controls
            className="w-full aspect-video"
            preload="metadata"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              removeVideo()
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {!value && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Video className="h-3.5 w-3.5" />
          No video uploaded yet
        </div>
      )}
    </div>
  )
}
