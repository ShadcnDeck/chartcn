"use client"

import { useRef, useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { parseCSV } from "@/lib/csv-parser"
import type { ParsedChartData } from "@/types/chart"

interface CsvPasteProps {
  initialValue: string
  onParsed: (data: ParsedChartData) => void
}

export function CsvPaste({ initialValue, onParsed }: CsvPasteProps) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | undefined>()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function handleChange(next: string) {
    setValue(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const parsed = parseCSV(next)
      setError(parsed.error)
      if (!parsed.error || parsed.rows.length > 0) {
        onParsed(parsed)
      }
    }, 300)
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Paste CSV data here..."
        className="min-h-[240px] font-mono text-sm"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
