"use client"

import { useMemo, useState } from "react"

import { ChartPreview } from "@/components/chart-preview"
import { ChartStats } from "@/components/charts/chart-stats"
import { GrowthGauge } from "@/components/charts/growth-gauge"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { CsvPaste } from "@/components/data-input/csv-paste"
import { CsvUpload } from "@/components/data-input/csv-upload"
import { EditableTable } from "@/components/data-input/editable-table"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { generateComponentCode } from "@/lib/code-templates"
import { computeGrowth } from "@/lib/chart-data"
import { parseCSV } from "@/lib/csv-parser"
import { sampleCSV } from "@/lib/sample-data"
import type { ChartOptions, ChartType, ParsedChartData } from "@/types/chart"

interface ChartDetailClientProps {
  type: ChartType
}

export function ChartDetailClient({ type }: ChartDetailClientProps) {
  const [data, setData] = useState<ParsedChartData>(() => parseCSV(sampleCSV[type]))
  const [options, setOptions] = useState<ChartOptions>({})

  const code = useMemo(
    () => generateComponentCode(type, data, options),
    [type, data, options]
  )

  const showSidePanel = type !== "pie"
  const growth = type === "bar" || type === "line" || type === "area" ? computeGrowth(data) : null

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="paste">
          <TabsList className="w-full">
            <TabsTrigger value="paste">Paste CSV</TabsTrigger>
            <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            <TabsTrigger value="table">Edit table</TabsTrigger>
          </TabsList>
          <TabsContent value="paste">
            <CsvPaste initialValue={sampleCSV[type]} onParsed={setData} />
          </TabsContent>
          <TabsContent value="upload">
            <CsvUpload onParsed={setData} />
          </TabsContent>
          <TabsContent value="table">
            <EditableTable data={data} onChange={setData} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <ChartVariantToggles type={type} options={options} onChange={setOptions} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <ChartPreview type={type} data={data} options={options} />
              </div>
              {showSidePanel && (
                <div className="flex w-full shrink-0 flex-col gap-3 sm:w-44">
                  {growth != null && (
                    <div className="flex items-center justify-center rounded-lg bg-muted/40 py-3">
                      <GrowthGauge value={growth} />
                    </div>
                  )}
                  <ChartStats data={data} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
            <h2 className="font-mono text-xs text-muted-foreground">chart.tsx</h2>
            <CopyButton getText={() => code} />
          </div>
          <CodeBlock code={code} />
        </Card>
      </div>
    </div>
  )
}

function ChartVariantToggles({
  type,
  options,
  onChange,
}: {
  type: ChartType
  options: ChartOptions
  onChange: (options: ChartOptions) => void
}) {
  if (type === "bar" || type === "area") {
    return (
      <div className="flex items-center gap-2">
        <Toggle
          pressed={options.stacked ?? false}
          onPressedChange={(pressed) => onChange({ ...options, stacked: pressed })}
        >
          Stacked
        </Toggle>
      </div>
    )
  }

  if (type === "line") {
    return (
      <div className="flex items-center gap-2">
        <Toggle
          pressed={options.smooth ?? false}
          onPressedChange={(pressed) => onChange({ ...options, smooth: pressed })}
        >
          Smooth
        </Toggle>
        <Toggle
          pressed={options.showDots ?? true}
          onPressedChange={(pressed) => onChange({ ...options, showDots: pressed })}
        >
          Dots
        </Toggle>
      </div>
    )
  }

  if (type === "pie") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Toggle
          pressed={options.donut ?? false}
          onPressedChange={(pressed) => onChange({ ...options, donut: pressed })}
        >
          Donut
        </Toggle>
        {(["value", "percent", "label"] as const).map((labelType) => (
          <Toggle
            key={labelType}
            pressed={(options.labelType ?? "value") === labelType}
            onPressedChange={() => onChange({ ...options, labelType })}
          >
            {labelType}
          </Toggle>
        ))}
      </div>
    )
  }

  return null
}
