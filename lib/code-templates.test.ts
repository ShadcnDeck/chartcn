import { describe, expect, it } from "vitest"

import { generateComponentCode } from "@/lib/code-templates"
import { parseCSV } from "@/lib/csv-parser"
import type { ChartType } from "@/types/chart"

const barData = parseCSV("Month,Revenue,Expenses\nJan,100,50\nFeb,200,80")
const pieData = parseCSV("Category,Value\nA,10\nB,20")
const scatterData = parseCSV("Segment,Spend,Conversions\nSearch,100,10\nSocial,200,20")

describe("generateComponentCode: chart type coverage", () => {
  const cases: [ChartType, ReturnType<typeof parseCSV>][] = [
    ["bar", barData],
    ["line", barData],
    ["area", barData],
    ["combo", barData],
    ["pie", pieData],
    ["radar", barData],
    ["scatter", scatterData],
    ["radial", pieData],
  ]

  it.each(cases)("generates a self-contained Chart component for %s", (type, data) => {
    const code = generateComponentCode(type, data)
    expect(code).toContain('"use client"')
    expect(code).toContain("export function Chart(")
    expect(code).toContain("from \"recharts\"")
    expect(code).toContain("from \"@/components/ui/chart\"")
  })
})

describe("generateComponentCode: export mode", () => {
  it("bakes data inline by default", () => {
    const code = generateComponentCode("bar", barData)
    expect(code).toContain("const data = [")
    expect(code).toContain("export function Chart() {")
    expect(code).not.toContain("ChartProps")
  })

  it("emits a ChartProps interface and no baked data in props mode", () => {
    const code = generateComponentCode("bar", barData, { exportMode: "props" })
    expect(code).toContain("export interface ChartProps")
    expect(code).toContain("export function Chart({ data }: ChartProps) {")
    expect(code).not.toContain("const data = [")
  })
})

describe("generateComponentCode: bar/area stack modes", () => {
  it("has no stackId when stackMode is unset", () => {
    const code = generateComponentCode("bar", barData)
    expect(code).not.toContain("stackId")
  })

  it("adds stackId when stacked", () => {
    const code = generateComponentCode("bar", barData, { stackMode: "stack" })
    expect(code).toContain('stackId="stack"')
  })

  it("adds stackOffset=expand for 100% stacked", () => {
    const code = generateComponentCode("area", barData, { stackMode: "percent" })
    expect(code).toContain('stackOffset="expand"')
  })
})

describe("generateComponentCode: combo per-series render type", () => {
  it("defaults the first series to Bar and the rest to Line", () => {
    const code = generateComponentCode("combo", barData)
    expect(code).toContain("<Bar dataKey=\"series_Revenue\"")
    expect(code).toContain("<Line dataKey=\"series_Expenses\"")
  })

  it("honors an explicit seriesRenderType override", () => {
    const code = generateComponentCode("combo", barData, {
      seriesRenderType: { series_Revenue: "line", series_Expenses: "bar" },
    })
    expect(code).toContain("<Line dataKey=\"series_Revenue\"")
    expect(code).toContain("<Bar dataKey=\"series_Expenses\"")
  })
})

describe("generateComponentCode: date-axis formatting", () => {
  it("adds a date tick formatter when the category column looks like dates", () => {
    const dateData = parseCSV("Date,Revenue\n2024-01-01,100\n2024-02-01,200")
    const code = generateComponentCode("bar", dateData)
    expect(code).toContain("new Date(value).toLocaleDateString")
  })

  it("omits the date formatter for non-date categories", () => {
    const code = generateComponentCode("bar", barData)
    expect(code).not.toContain("toLocaleDateString")
  })
})

describe("generateComponentCode: custom colors", () => {
  it("reflects a custom color in the chartConfig instead of the palette", () => {
    const code = generateComponentCode("bar", barData, {
      customColors: { series_Revenue: "#ff0000" },
    })
    expect(code).toContain('color: "#ff0000"')
  })
})

describe("generateComponentCode: chartConfig typing (dynamic-index safety)", () => {
  // pie/radial/scatter index chartConfig by a runtime string
  // (chartConfig[row.category] / chartConfig[group.key]), which only
  // type-checks if chartConfig is widened to `: ChartConfig`. `satisfies
  // ChartConfig` keeps the narrow literal-keys type and fails under strict
  // TypeScript (TS7053) — regression coverage for that bug.
  const dynamicallyIndexedTypes: [ChartType, ReturnType<typeof parseCSV>][] = [
    ["pie", pieData],
    ["radial", pieData],
    ["scatter", scatterData],
  ]

  it.each(dynamicallyIndexedTypes)(
    "%s declares chartConfig with a widened : ChartConfig annotation, not satisfies",
    (type, data) => {
      for (const exportMode of ["inline", "props"] as const) {
        const code = generateComponentCode(type, data, { exportMode })
        expect(code).toContain("const chartConfig: ChartConfig = {")
        expect(code).not.toContain("} satisfies ChartConfig")
      }
    }
  )

  const staticallyKeyedTypes: [ChartType, ReturnType<typeof parseCSV>][] = [
    ["bar", barData],
    ["line", barData],
    ["area", barData],
    ["combo", barData],
    ["radar", barData],
  ]

  it.each(staticallyKeyedTypes)(
    "%s keeps satisfies ChartConfig (no dynamic chartConfig indexing)",
    (type, data) => {
      for (const exportMode of ["inline", "props"] as const) {
        const code = generateComponentCode(type, data, { exportMode })
        expect(code).toContain("} satisfies ChartConfig")
        expect(code).not.toContain("chartConfig[")
      }
    }
  )
})
