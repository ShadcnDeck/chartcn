"use client"

import { Cell, Label, Pie, PieChart as RechartsPieChart, type PieLabelRenderProps } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCompactNumber, getSeries, toChartRows } from "@/lib/chart-data"
import type { ChartOptions, ParsedChartData } from "@/types/chart"

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

interface PieChartProps {
  data: ParsedChartData
  options?: ChartOptions
}

export function PieChart({ data, options }: PieChartProps) {
  const rows = toChartRows(data)
  const valueKey = getSeries(data)[0]?.key ?? "value"
  const total = rows.reduce((sum, row) => {
    const value = Number(row[valueKey])
    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)

  const chartConfig: ChartConfig = {}
  rows.forEach((row, index) => {
    const category = String(row.category)
    chartConfig[category] = {
      label: category,
      color: PALETTE[index % PALETTE.length],
    }
  })

  const labelType = options?.labelType ?? "value"

  const renderLabel = (props: PieLabelRenderProps) => {
    if (labelType === "percent") {
      return `${Math.round((props.percent ?? 0) * 100)}%`
    }
    if (labelType === "label") {
      return String(props.payload?.category ?? "")
    }
    return String(props.value ?? "")
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square h-[350px] w-full [&_.recharts-text]:fill-foreground"
    >
      <RechartsPieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
        <ChartLegend content={<ChartLegendContent nameKey="category" />} verticalAlign="bottom" />
        <Pie
          data={rows}
          dataKey={valueKey}
          nameKey="category"
          label={options?.donut ? undefined : renderLabel}
          innerRadius={options?.donut ? 64 : 0}
          strokeWidth={4}
        >
          {rows.map((row, index) => (
            <Cell key={`${row.category}-${index}`} fill={PALETTE[index % PALETTE.length]} />
          ))}
          {options?.donut && (
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                const { cx, cy } = viewBox
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={cx} y={cy} className="fill-foreground text-2xl font-semibold">
                      {formatCompactNumber(total)}
                    </tspan>
                    <tspan x={cx} y={(cy ?? 0) + 22} className="fill-muted-foreground text-xs">
                      Total
                    </tspan>
                  </text>
                )
              }}
            />
          )}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  )
}
