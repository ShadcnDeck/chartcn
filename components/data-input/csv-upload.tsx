"use client"

import { useRef, useState } from "react"
import { UploadCloud } from "lucide-react"

import { cn } from "@/lib/utils"
import { parseCSV } from "@/lib/csv-parser"
import type { ParsedChartData } from "@/types/chart"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

interface CsvUploadProps {
  onParsed: (data: ParsedChartData) => void
}

export function CsvUpload({ onParsed }: CsvUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | undefined) {
    if (!file) return

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only .csv files are supported.")
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File is larger than 2MB.")
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? "")
      const parsed = parseCSV(text)
      setFileName(file.name)
      onParsed(parsed)
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files[0])
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground transition-colors",
          isDragging ? "border-primary bg-accent" : "border-border"
        )}
      >
        <UploadCloud className="size-6" />
        <p>Drag and drop a .csv file here, or click to browse</p>
        <p className="text-xs">Max 2MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {fileName && !error && (
        <p className="text-sm text-muted-foreground">Loaded: {fileName}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
