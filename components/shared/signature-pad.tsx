"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/upload"
import { Loader2, Eraser } from "lucide-react"

interface SignaturePadProps {
  onSave: (url: string) => void
  disabled?: boolean
}

export function SignaturePad({ onSave, disabled }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [uploading, setUploading] = useState(false)

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext("2d")
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set up canvas for high-DPI
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()
    const ctx = getCtx()
    if (!ctx) return
    const pos = getPosition(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return
    e.preventDefault()
    const ctx = getCtx()
    if (!ctx) return
    const pos = getPosition(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setHasDrawn(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const save = async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) return

    setUploading(true)
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      )
      if (!blob) throw new Error("Failed to create image")

      const file = new File([blob], `signature-${Date.now()}.png`, { type: "image/png" })
      const path = `signatures/${Date.now()}-${Math.random().toString(36).slice(2)}.png`
      const url = await uploadImage(file, path)
      onSave(url)
    } catch (error) {
      console.error("Failed to save signature:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="border rounded-lg bg-white dark:bg-neutral-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ height: 150 }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Draw your signature above
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clear}
          disabled={!hasDrawn || uploading}
          className="gap-1"
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={save}
          disabled={!hasDrawn || uploading || disabled}
          className="gap-1 flex-1"
        >
          {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {uploading ? "Saving..." : "Sign"}
        </Button>
      </div>
    </div>
  )
}
