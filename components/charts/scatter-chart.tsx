"use client"

import { CartesianGrid, Scatter, ScatterChart as RechartsScatterChart, XAxis, YAxis } from "recharts"

import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { toScatterGroups } from "@/lib/chart-data"
import type { ChartOptions, ParsedChartData } from "@/types/chart"

interface ScatterChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function ScatterChart({ data, options }: ScatterChartProps) {
  const groups = toScatterGroups(data, options?.customColors)
  const xLabel = data.headers[1] ?? "X"
  const yLabel = data.headers[2] ?? "Y"

  const chartConfig: ChartConfig = {}
  groups.forEach(({ key, label, color }) => {
    chartConfig[key] = { label, color }
  })

  return (
    <ChartContainer config={chartConfig} className="aspect-square h-[350px] w-full">
      <RechartsScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name={xLabel} tickLine={false} axisLine={false} />
        <YAxis type="number" dataKey="y" name={yLabel} tickLine={false} axisLine={false} />
        <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {groups.map((group) => (
          <Scatter key={group.key} name={group.label} data={group.points} fill={group.color} />
        ))}
      </RechartsScatterChart>
    </ChartContainer>
  )
}
