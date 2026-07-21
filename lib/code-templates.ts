import { getSeries, toChartRows } from "@/lib/chart-data"
import type { ChartOptions, ChartType, ParsedChartData } from "@/types/chart"

function serializeData(data: ParsedChartData): string {
  const rows = toChartRows(data)
  return JSON.stringify(rows, null, 2)
}

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
  const bars = series
    .map(
      ({ key }) =>
        `        <Bar dataKey="${key}" fill="var(--color-${key})" radius={4}${
          options?.stacked ? ' stackId="stack"' : ""
        } />`
    )
    .join("\n")

  return `"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
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
        }" stroke="var(--color-${key})" strokeWidth={2} dot={${
          options?.showDots ?? true
        }} />`
    )
    .join("\n")

  return `"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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
        <CartesianGrid vertical={false} />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
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
            <stop offset="5%" stopColor="var(--color-${key})" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-${key})" stopOpacity={0.1} />
          </linearGradient>`
    )
    .join("\n")
  const areas = series
    .map(
      ({ key }) =>
        `        <Area dataKey="${key}" type="natural" fill="url(#fill-${key})" fillOpacity={0.4} stroke="var(--color-${key})"${
          options?.stacked ? ' stackId="stack"' : ""
        } />`
    )
    .join("\n")

  return `"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
        <CartesianGrid vertical={false} />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
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
  const configEntries = rows
    .map(
      (row, index) =>
        `  "${String(row.category).replace(/"/g, '\\"')}": { label: "${String(
          row.category
        ).replace(/"/g, '\\"')}", color: "var(--chart-${(index % 5) + 1})" },`
    )
    .join("\n")

  return `"use client"

import { Cell, Pie, PieChart } from "recharts"
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
          innerRadius={${options?.donut ? 60 : 0}}
          strokeWidth={4}
        >
          {data.map((row, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
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
        `        <Radar dataKey="${key}" fill="var(--color-${key})" fillOpacity={0.4} stroke="var(--color-${key})" />`
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
