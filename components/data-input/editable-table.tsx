"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { parseCSV } from "@/lib/csv-parser"
import type { ParsedChartData } from "@/types/chart"

interface EditableTableProps {
  data: ParsedChartData
  onChange: (data: ParsedChartData) => void
}

function toCSV(headers: string[], cells: string[][]): string {
  return [headers, ...cells].map((row) => row.join(",")).join("\n")
}

export function EditableTable({ data, onChange }: EditableTableProps) {
  const [prevData, setPrevData] = useState(data)
  const [cells, setCells] = useState<string[][]>(() =>
    data.rows.map((row) => data.headers.map((h) => String(row[h] ?? "")))
  )

  // Reset local cells whenever the parent hands us a new parsed CSV (e.g. from
  // the paste/upload tabs), without a render-then-effect flash.
  if (data !== prevData) {
    setPrevData(data)
    setCells(data.rows.map((row) => data.headers.map((h) => String(row[h] ?? ""))))
  }

  function updateCell(rowIndex: number, colIndex: number, value: string) {
    const next = cells.map((row) => [...row])
    next[rowIndex][colIndex] = value
    setCells(next)
    onChange(parseCSV(toCSV(data.headers, next)))
  }

  function focusCell(rowIndex: number, colIndex: number) {
    const el = document.querySelector<HTMLInputElement>(
      `[data-row="${rowIndex}"][data-col="${colIndex}"]`
    )
    el?.focus()
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) {
    if (e.key === "Enter") {
      e.preventDefault()
      if (rowIndex + 1 < cells.length) focusCell(rowIndex + 1, colIndex)
    }
  }

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {data.headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cells.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, colIndex) => (
                <TableCell key={colIndex} className="p-1">
                  <Input
                    data-row={rowIndex}
                    data-col={colIndex}
                    value={cell}
                    onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                    className="h-8 border-none shadow-none focus-visible:ring-1"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
