export type ChartType = "bar" | "line" | "area" | "pie" | "radar"

export interface ChartDataRow {
  [key: string]: string | number
}

export interface ParsedChartData {
  headers: string[]
  rows: ChartDataRow[]
  error?: string
}

export interface ChartOptions {
  stacked?: boolean // bar, area
  smooth?: boolean // line
  showDots?: boolean // line
  donut?: boolean // pie
  labelType?: "value" | "percent" | "label" // pie
}

export interface ChartConfig {
  type: ChartType
  data: ParsedChartData
  options?: ChartOptions
}
