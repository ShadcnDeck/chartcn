"use client"

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts"

import { ChartBreakdownTooltip } from "@/components/charts/chart-breakdown-tooltip"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  CATEGORY_KEY,
  buildChartConfig,
  formatCompactNumber,
  getSeries,
  toChartRows,
} from "@/lib/chart-data"
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
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis
          dataKey={CATEGORY_KEY}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={40}
          tickFormatter={(value: number) => formatCompactNumber(value)}
        />
        <ChartTooltip
          content={
            series.length > 1 ? (
              <ChartBreakdownTooltip
                config={chartConfig}
                seriesOrder={series.map((s) => s.key)}
              />
            ) : (
              <ChartTooltipContent />
            )
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map(({ key }) => (
          <Line
            key={key}
            dataKey={key}
            type={options?.smooth ? "monotone" : "linear"}
            stroke={`var(--color-${key})`}
            strokeWidth={2.5}
            dot={options?.showDots ?? true}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}
