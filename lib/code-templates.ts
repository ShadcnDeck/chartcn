import { getSeries, toChartRows } from "@/lib/chart-data"
import type { ChartOptions, ChartType, ParsedChartData } from "@/types/chart"

function serializeData(data: ParsedChartData): string {
  const rows = toChartRows(data)
  return JSON.stringify(rows, null, 2)
}

const TICK_FORMATTER =
  '(value) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)'

function serializeConfig(data: ParsedChartData): string {
  const series = getSeries(data)
  const entries = series
    .map(
      ({ key, label }, index) =>
        `  ${key}: { label: "${label.replace(/"/g, '\\"')}", color: "var(--chart-${
          (index % 5) + 1
        })" },`
    )
    .join("\n")
  return `{\n${entries}\n}`
}

function bar(data: ParsedChartData, options?: ChartOptions): string {
  const series = getSeries(data)
  const defs = series
    .map(
      ({ key }) => `          <linearGradient id="fill-${key}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-${key})" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--color-${key})" stopOpacity={0.55} />
          </linearGradient>`
    )
    .join("\n")
  const radius = options?.stacked ? "[3, 3, 3, 3]" : "[8, 8, 8, 8]"
  const maxBarSize = options?.stacked ? 48 : 36
  const bars = series
    .map(
      ({ key }) =>
        `        <Bar dataKey="${key}" fill="url(#fill-${key})" radius={${radius}} maxBarSize={${maxBarSize}}${
          options?.stacked ? ' stackId="stack"' : ""
        } />`
    )
    .join("\n")

  return `"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = ${serializeData(data)}

const chartConfig = ${serializeConfig(data)} satisfies ChartConfig

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <BarChart accessibilityLayer data={data} barCategoryGap="30%" barGap={4}>
        <defs>
${defs}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} tickFormatter={${TICK_FORMATTER}} />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
${bars}
      </BarChart>
    </ChartContainer>
  )
}
`
}

function line(data: ParsedChartData, options?: ChartOptions): string {
  const series = getSeries(data)
  const lines = series
    .map(
      ({ key }) =>
        `        <Line dataKey="${key}" type="${
          options?.smooth ? "monotone" : "linear"
        }" stroke="var(--color-${key})" strokeWidth={2.5} dot={${
          options?.showDots ?? true
        }} activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }} />`
    )
    .join("\n")

  return `"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = ${serializeData(data)}

const chartConfig = ${serializeConfig(data)} satisfies ChartConfig

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} tickFormatter={${TICK_FORMATTER}} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
${lines}
      </LineChart>
    </ChartContainer>
  )
}
`
}

function area(data: ParsedChartData, options?: ChartOptions): string {
  const series = getSeries(data)
  const defs = series
    .map(
      ({ key }) => `          <linearGradient id="fill-${key}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-${key})" stopOpacity={0.85} />
            <stop offset="100%" stopColor="var(--color-${key})" stopOpacity={0.04} />
          </linearGradient>`
    )
    .join("\n")
  const areas = series
    .map(
      ({ key }) =>
        `        <Area dataKey="${key}" type="natural" fill="url(#fill-${key})" fillOpacity={1} stroke="var(--color-${key})" strokeWidth={2.5}${
          options?.stacked ? ' stackId="stack"' : ""
        } />`
    )
    .join("\n")

  return `"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = ${serializeData(data)}

const chartConfig = ${serializeConfig(data)} satisfies ChartConfig

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
      <AreaChart accessibilityLayer data={data}>
        <defs>
${defs}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} tickFormatter={${TICK_FORMATTER}} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
${areas}
      </AreaChart>
    </ChartContainer>
  )
}
`
}

function pie(data: ParsedChartData, options?: ChartOptions): string {
  const rows = toChartRows(data)
  const valueKey = getSeries(data)[0]?.key ?? "value"
  const total = rows.reduce((sum, row) => {
    const value = Number(row[valueKey])
    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)
  const configEntries = rows
    .map(
      (row, index) =>
        `  "${String(row.category).replace(/"/g, '\\"')}": { label: "${String(
          row.category
        ).replace(/"/g, '\\"')}", color: "var(--chart-${(index % 5) + 1})" },`
    )
    .join("\n")

  const centerLabel = options?.donut
    ? `
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
              const { cx, cy } = viewBox
              return (
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={cx} y={cy} className="fill-foreground text-2xl font-semibold">
                    {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(${total})}
                  </tspan>
                  <tspan x={cx} y={(cy ?? 0) + 22} className="fill-muted-foreground text-xs">
                    Total
                  </tspan>
                </text>
              )
            }}
          />`
    : ""

  return `"use client"

import { Cell, ${options?.donut ? "Label, " : ""}Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = ${serializeData(data)}

const chartConfig = {\n${configEntries}\n} satisfies ChartConfig

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-square h-[350px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
        <ChartLegend content={<ChartLegendContent nameKey="category" />} verticalAlign="bottom" />
        <Pie
          data={data}
          dataKey="${valueKey}"
          nameKey="category"
          innerRadius={${options?.donut ? 64 : 0}}
          strokeWidth={4}
        >
          {data.map((row, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}${centerLabel}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
`
}

function radar(data: ParsedChartData): string {
  const series = getSeries(data)
  const radars = series
    .map(
      ({ key }) =>
        `        <Radar dataKey="${key}" fill="var(--color-${key})" fillOpacity={0.35} stroke="var(--color-${key})" strokeWidth={2} />`
    )
    .join("\n")

  return `"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = ${serializeData(data)}

const chartConfig = ${serializeConfig(data)} satisfies ChartConfig

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-square h-[350px] w-full">
      <RadarChart data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="category" />
        <PolarGrid />
${radars}
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  )
}
`
}

export function generateComponentCode(
  type: ChartType,
  data: ParsedChartData,
  options?: ChartOptions
): string {
  switch (type) {
    case "bar":
      return bar(data, options)
    case "line":
      return line(data, options)
    case "area":
      return area(data, options)
    case "pie":
      return pie(data, options)
    case "radar":
      return radar(data)
  }
}
