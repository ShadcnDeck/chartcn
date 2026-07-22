import type { ChartConfig } from "@/components/ui/chart"
import type { ChartDataRow, ParsedChartData } from "@/types/chart"

export const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

/** CSS custom property names can't contain spaces, so series keys used as
 * `--color-<key>` and recharts dataKeys must be safe identifiers. */
function toSafeKey(header: string, index: number): string {
  const slug = header
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  return slug ? `series_${slug}` : `series_${index}`
}

export interface ChartSeries {
  key: string
  label: string
}

/** Rows produced by toChartRows always key the category/label axis as "category". */
export const CATEGORY_KEY = "category"

/** All columns after the first are numeric data series, remapped to safe keys. */
export function getSeries(data: ParsedChartData): ChartSeries[] {
  return data.headers
    .slice(1)
    .map((header, index) => ({ key: toSafeKey(header, index), label: header }))
}

/** Rows remapped to safe category/series keys for use with Recharts + ChartContainer. */
export function toChartRows(data: ParsedChartData): ChartDataRow[] {
  const series = getSeries(data)
  const categoryHeader = data.headers[0]

  return data.rows.map((row) => {
    const mapped: ChartDataRow = { category: row[categoryHeader] }
    series.forEach(({ key, label }) => {
      mapped[key] = row[label]
    })
    return mapped
  })
}

export function buildChartConfig(data: ParsedChartData): ChartConfig {
  const config: ChartConfig = {}
  getSeries(data).forEach(({ key, label }, index) => {
    config[key] = {
      label,
      color: PALETTE[index % PALETTE.length],
    }
  })
  return config
}

export interface SeriesTotal {
  key: string
  label: string
  color: string
  total: number
}

/** Sum of every numeric series, in the order the CSV columns appear. Used for
 * the generic stat-card summary shown next to a chart. */
export function computeSeriesTotals(data: ParsedChartData): SeriesTotal[] {
  const series = getSeries(data)
  const rows = toChartRows(data)

  return series.map(({ key, label }, index) => {
    const total = rows.reduce((sum, row) => {
      const value = Number(row[key])
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)
    return { key, label, color: PALETTE[index % PALETTE.length], total }
  })
}

/** Percent change of the first numeric series from its first row to its last
 * row. Returns null when it can't be computed (too few rows, zero baseline). */
export function computeGrowth(data: ParsedChartData): number | null {
  const series = getSeries(data)
  if (series.length === 0) return null

  const rows = toChartRows(data)
  if (rows.length < 2) return null

  const key = series[0].key
  const first = Number(rows[0][key])
  const last = Number(rows[rows.length - 1][key])
  if (!Number.isFinite(first) || !Number.isFinite(last) || first === 0) return null

  return ((last - first) / Math.abs(first)) * 100
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}
