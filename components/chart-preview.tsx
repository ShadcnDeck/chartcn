import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { RadarChart } from "@/components/charts/radar-chart"
import type { ChartOptions, ChartType, ParsedChartData } from "@/types/chart"

interface ChartPreviewProps {
  type: ChartType
  data: ParsedChartData
  options?: ChartOptions
}

export function ChartPreview({ type, data, options }: ChartPreviewProps) {
  switch (type) {
    case "bar":
      return <BarChart data={data} options={options} />
    case "line":
      return <LineChart data={data} options={options} />
    case "area":
      return <AreaChart data={data} options={options} />
    case "pie":
      return <PieChart data={data} options={options} />
    case "radar":
      return <RadarChart data={data} options={options} />
  }
}
