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
  formatDateTick,
  formatCompactNumber,
  getSeries,
  isDateAxis,
  toChartRows,
} from "@/lib/chart-data"
import type { ChartOptions, ParsedChartData } from "@/types/chart"

interface BarChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function BarChart({ data, options }: BarChartProps) {
  const series = getSeries(data)
  const chartConfig = buildChartConfig(data, options?.customColors)
  const rows = toChartRows(data)
  const stackMode = options?.stackMode ?? "none"
  const dateAxis = isDateAxis(data)

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <RechartsBarChart
        accessibilityLayer
        data={rows}
        barCategoryGap="30%"
        barGap={4}
        stackOffset={stackMode === "percent" ? "expand" : undefined}
      >
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
          tickFormatter={dateAxis ? formatDateTick : undefined}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={40}
          tickFormatter={
            stackMode === "percent"
              ? (value: number) =>
                  new Intl.NumberFormat("en-US", { style: "percent" }).format(value)
              : (value: number) => formatCompactNumber(value)
          }
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          labelFormatter={dateAxis ? (label) => formatDateTick(String(label)) : undefined}
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
            radius={stackMode !== "none" ? [3, 3, 3, 3] : [8, 8, 8, 8]}
            maxBarSize={stackMode !== "none" ? 48 : 36}
            stackId={stackMode !== "none" ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}
