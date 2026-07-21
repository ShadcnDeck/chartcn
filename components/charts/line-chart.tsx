"use client"

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CATEGORY_KEY, buildChartConfig, getSeries, toChartRows } from "@/lib/chart-data"
import type { ChartOptions, ParsedChartData } from "@/types/chart"

interface LineChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function LineChart({ data, options }: LineChartProps) {
  const series = getSeries(data)
  const chartConfig = buildChartConfig(data)
  const rows = toChartRows(data)

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <RechartsLineChart accessibilityLayer data={rows}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={CATEGORY_KEY}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map(({ key }) => (
          <Line
            key={key}
            dataKey={key}
            type={options?.smooth ? "monotone" : "linear"}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={options?.showDots ?? true}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}
