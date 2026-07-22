"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

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

interface BarChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function BarChart({ data, options }: BarChartProps) {
  const series = getSeries(data)
  const chartConfig = buildChartConfig(data)
  const rows = toChartRows(data)

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <RechartsBarChart accessibilityLayer data={rows} barCategoryGap="30%" barGap={4}>
        <defs>
          {series.map(({ key }) => (
            <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={1} />
              <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0.55} />
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
          cursor={{ fill: "var(--muted)" }}
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
          <Bar
            key={key}
            dataKey={key}
            fill={`url(#fill-${key})`}
            radius={options?.stacked ? [3, 3, 3, 3] : [8, 8, 8, 8]}
            maxBarSize={options?.stacked ? 48 : 36}
            stackId={options?.stacked ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}
