import Papa from "papaparse"
import type { ChartDataRow, ChartType, ParsedChartData } from "@/types/chart"

const MAX_ROWS = 500
const MAX_SERIES = 10

export function parseCSV(csv: string): ParsedChartData {
  const trimmed = csv.trim()

  if (!trimmed) {
    return { headers: [], rows: [], error: "No data provided." }
  }

  const result = Papa.parse<string[]>(trimmed, {
    skipEmptyLines: true,
  })

  if (result.errors.length > 0) {
    return {
      headers: [],
      rows: [],
      error: result.errors[0].message ?? "Could not parse CSV.",
    }
  }

  const records = result.data.map((row) => row.map((cell) => cell.trim()))

  if (records.length < 2) {
    return {
      headers: [],
      rows: [],
      error: "CSV needs a header row and at least one data row.",
    }
  }

  const warnings: string[] = []

  let [headers, ...dataRows] = records
  headers = headers.map((h) => h.trim())

  if (headers.length - 1 > MAX_SERIES) {
    warnings.push(
      `Only the first ${MAX_SERIES} data series columns are shown (found ${headers.length - 1}).`
    )
    headers = [headers[0], ...headers.slice(1, MAX_SERIES + 1)]
  }

  let truncated = false
  if (dataRows.length > MAX_ROWS) {
    truncated = true
    dataRows = dataRows.slice(0, MAX_ROWS)
  }

  let hadNonNumeric = false

  const rows: ChartDataRow[] = dataRows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const record: ChartDataRow = {}
      headers.forEach((header, colIndex) => {
        const rawValue = row[colIndex] ?? ""
        if (colIndex === 0) {
          record[header] = rawValue
          return
        }
        const numericValue = Number(rawValue)
        if (rawValue === "" || Number.isNaN(numericValue)) {
          if (rawValue !== "") hadNonNumeric = true
          record[header] = 0
        } else {
          record[header] = numericValue
        }
      })
      return record
    })

  if (hadNonNumeric) {
    warnings.push("Some non-numeric values were replaced with 0.")
  }
  if (truncated) {
    warnings.push(`Only the first ${MAX_ROWS} rows are shown.`)
  }

  return {
    headers,
    rows,
    error: warnings.length > 0 ? warnings.join(" ") : undefined,
  }
}

/** Inverse of parseCSV — serializes parsed data back to CSV text, e.g. for
 * sharing/saving so any input tab (paste/upload/table) round-trips the same way. */
export function toCSV(data: ParsedChartData): string {
  const rows = data.rows.map((row) => data.headers.map((header) => row[header] ?? ""))
  return Papa.unparse([data.headers, ...rows])
}

const COLUMN_REQUIREMENTS: Partial<Record<ChartType, { count: number; hint: string }>> = {
  pie: { count: 2, hint: "Category,Value" },
  radial: { count: 2, hint: "Category,Value" },
  scatter: { count: 3, hint: "Category,X,Y" },
}

/** Warns when a chart type's fixed CSV shape (e.g. pie/radial's Category,Value or
 * scatter's Category,X,Y) isn't met. Returns undefined when there's nothing to warn about. */
export function validateColumnsForType(type: ChartType, data: ParsedChartData): string | undefined {
  const requirement = COLUMN_REQUIREMENTS[type]
  if (!requirement || data.headers.length === 0) return undefined
  if (data.headers.length === requirement.count) return undefined

  return `${type[0].toUpperCase()}${type.slice(1)} charts expect exactly ${requirement.count} columns (${requirement.hint}).`
}
