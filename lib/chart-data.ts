import type { ChartConfig } from "@/components/ui/chart"
import type { ChartDataRow, ParsedChartData } from "@/types/chart"

const PALETTE = [
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
