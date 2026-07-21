"use client"

import { useMemo, useState } from "react"

import { ChartPreview } from "@/components/chart-preview"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { CsvPaste } from "@/components/data-input/csv-paste"
import { CsvUpload } from "@/components/data-input/csv-upload"
import { EditableTable } from "@/components/data-input/editable-table"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { generateComponentCode } from "@/lib/code-templates"
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

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <ChartVariantToggles type={type} options={options} onChange={setOptions} />
            <ChartPreview type={type} data={data} options={options} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Component code</h2>
          <CopyButton getText={() => code} />
        </div>
        <CodeBlock code={code} />
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
