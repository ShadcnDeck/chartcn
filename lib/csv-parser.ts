import Papa from "papaparse"
import type { ChartDataRow, ParsedChartData } from "@/types/chart"

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
