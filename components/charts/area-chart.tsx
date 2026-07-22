"use client"

import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

interface AreaChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function AreaChart({ data, options }: AreaChartProps) {
  const series = getSeries(data)
  const chartConfig = buildChartConfig(data)
  const rows = toChartRows(data)

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <RechartsAreaChart accessibilityLayer data={rows}>
        <defs>
          {series.map(({ key }) => (
            <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={0.85} />
              <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0.04} />
            </linearGradient>
          ))}
        </defs>
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
              <ChartTooltipContent indicator="dot" />
            )
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map(({ key }) => (
          <Area
            key={key}
            dataKey={key}
            type="natural"
            fill={`url(#fill-${key})`}
            fillOpacity={1}
            stroke={`var(--color-${key})`}
            strokeWidth={2.5}
            stackId={options?.stacked ? "stack" : undefined}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  )
}
