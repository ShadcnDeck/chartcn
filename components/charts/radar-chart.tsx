"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CATEGORY_KEY, buildChartConfig, getSeries, toChartRows } from "@/lib/chart-data"
import type { ChartOptions, ParsedChartData } from "@/types/chart"

interface RadarChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function RadarChart({ data }: RadarChartProps) {
  const series = getSeries(data)
  const chartConfig = buildChartConfig(data)
  const rows = toChartRows(data)

  return (
    <ChartContainer config={chartConfig} className="aspect-square h-[350px] w-full">
      <RechartsRadarChart data={rows}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey={CATEGORY_KEY} />
        <PolarGrid />
        {series.map(({ key }) => (
          <Radar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            fillOpacity={0.4}
            stroke={`var(--color-${key})`}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </RechartsRadarChart>
    </ChartContainer>
  )
}
