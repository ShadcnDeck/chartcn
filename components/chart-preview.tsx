import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { ComboChart } from "@/components/charts/combo-chart"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { RadarChart } from "@/components/charts/radar-chart"
import { RadialChart } from "@/components/charts/radial-chart"
import { ScatterChart } from "@/components/charts/scatter-chart"
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
    case "combo":
      return <ComboChart data={data} options={options} />
    case "pie":
      return <PieChart data={data} options={options} />
    case "radar":
      return <RadarChart data={data} options={options} />
    case "scatter":
      return <ScatterChart data={data} options={options} />
    case "radial":
      return <RadialChart data={data} options={options} />
    default: {
      const exhaustive: never = type
      throw new Error(`Unhandled chart type: ${exhaustive}`)
    }
  }
}
