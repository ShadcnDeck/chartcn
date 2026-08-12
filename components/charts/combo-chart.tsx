"use client"

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

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
  formatDateTick,
  getSeries,
  isDateAxis,
  toChartRows,
} from "@/lib/chart-data"
import type { ChartOptions, ParsedChartData } from "@/types/chart"

interface ComboChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function ComboChart({ data, options }: ComboChartProps) {
  const series = getSeries(data)
  const chartConfig = buildChartConfig(data, options?.customColors)
  const rows = toChartRows(data)
  const dateAxis = isDateAxis(data)
  const renderTypes = options?.seriesRenderType ?? {}

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <ComposedChart accessibilityLayer data={rows}>
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis
          dataKey={CATEGORY_KEY}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={dateAxis ? formatDateTick : undefined}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={40}
          tickFormatter={(value: number) => formatCompactNumber(value)}
        />
        <ChartTooltip
          labelFormatter={dateAxis ? (label) => formatDateTick(String(label)) : undefined}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map(({ key }, index) => {
          const renderAs = renderTypes[key] ?? (index === 0 ? "bar" : "line")
          return renderAs === "line" ? (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          ) : (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          )
        })}
      </ComposedChart>
    </ChartContainer>
  )
}
