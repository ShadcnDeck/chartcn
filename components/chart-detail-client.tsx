"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { ChartPreview } from "@/components/chart-preview"
import { ChartStats } from "@/components/charts/chart-stats"
import { GrowthGauge } from "@/components/charts/growth-gauge"
import { CodeBlock } from "@/components/code-block"
import { ColorPickerRow } from "@/components/color-picker-row"
import { CopyButton } from "@/components/copy-button"
import { CsvPaste } from "@/components/data-input/csv-paste"
import { CsvUpload } from "@/components/data-input/csv-upload"
import { EditableTable } from "@/components/data-input/editable-table"
import { ShareControls } from "@/components/share-controls"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { generateComponentCode } from "@/lib/code-templates"
import {
  CATEGORY_KEY,
  computeGrowth,
  getSeries,
  resolveColor,
  toChartRows,
  toScatterGroups,
} from "@/lib/chart-data"
import { parseCSV, toCSV, validateColumnsForType } from "@/lib/csv-parser"
import { decodeShareConfig } from "@/lib/share"
import { sampleCSV } from "@/lib/sample-data"
import type { ChartOptions, ChartType, ParsedChartData } from "@/types/chart"

interface ChartDetailClientProps {
  type: ChartType
}

const SERIES_TYPES = new Set<ChartType>(["bar", "line", "area", "combo"])

export function ChartDetailClient({ type }: ChartDetailClientProps) {
  const searchParams = useSearchParams()
  const shareParam = searchParams.get("c")

  const [data, setData] = useState<ParsedChartData>(() => parseCSV(sampleCSV[type]))
  const [options, setOptions] = useState<ChartOptions>({})

  useEffect(() => {
    if (!shareParam) return
    let cancelled = false

    decodeShareConfig(shareParam).then((config) => {
      if (cancelled || !config || config.type !== type) return
      setData(parseCSV(config.csv))
      setOptions(config.options ?? {})
    })

    return () => {
      cancelled = true
    }
  }, [shareParam, type])

  const code = useMemo(
    () => generateComponentCode(type, data, options),
    [type, data, options]
  )

  const csvText = useMemo(() => toCSV(data), [data])
  const columnWarning = useMemo(() => validateColumnsForType(type, data), [type, data])

  const colorPickerItems = useMemo(() => {
    if (type === "pie" || type === "radial") {
      return toChartRows(data).map((row, index) => {
        const category = String(row[CATEGORY_KEY])
        return {
          key: category,
          label: category,
          color: resolveColor(category, index, options.customColors),
        }
      })
    }
    if (type === "scatter") {
      return toScatterGroups(data, options.customColors).map(({ key, label, color }) => ({
        key,
        label,
        color,
      }))
    }
    return getSeries(data).map((series, index) => ({
      key: series.key,
      label: series.label,
      color: resolveColor(series.key, index, options.customColors),
    }))
  }, [type, data, options.customColors])

  function handleColorChange(key: string, color: string) {
    setOptions({ ...options, customColors: { ...options.customColors, [key]: color } })
  }

  function handleResetColors() {
    setOptions({ ...options, customColors: undefined })
  }

  const showSidePanel = SERIES_TYPES.has(type)
  const growth = SERIES_TYPES.has(type) ? computeGrowth(data) : null

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
        {columnWarning && (
          <p className="text-sm text-amber-600 dark:text-amber-500">{columnWarning}</p>
        )}
        <ShareControls type={type} csv={csvText} options={options} />
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ChartVariantToggles type={type} data={data} options={options} onChange={setOptions} />
              <ExportModeToggle options={options} onChange={setOptions} />
            </div>
            <ColorPickerRow
              items={colorPickerItems}
              hasCustomColors={Boolean(
                options.customColors && Object.keys(options.customColors).length > 0
              )}
              onChange={handleColorChange}
              onReset={handleResetColors}
            />
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

function ExportModeToggle({
  options,
  onChange,
}: {
  options: ChartOptions
  onChange: (options: ChartOptions) => void
}) {
  const exportMode = options.exportMode ?? "inline"
  return (
    <ToggleGroup
      value={[exportMode]}
      onValueChange={(values) =>
        onChange({ ...options, exportMode: (values[0] as ChartOptions["exportMode"]) ?? "inline" })
      }
    >
      <ToggleGroupItem value="inline">Inline data</ToggleGroupItem>
      <ToggleGroupItem value="props">Data as prop</ToggleGroupItem>
    </ToggleGroup>
  )
}

function ChartVariantToggles({
  type,
  data,
  options,
  onChange,
}: {
  type: ChartType
  data: ParsedChartData
  options: ChartOptions
  onChange: (options: ChartOptions) => void
}) {
  if (type === "bar" || type === "area") {
    const stackMode = options.stackMode ?? "none"
    return (
      <ToggleGroup
        value={[stackMode]}
        onValueChange={(values) =>
          onChange({ ...options, stackMode: (values[0] as ChartOptions["stackMode"]) ?? "none" })
        }
      >
        <ToggleGroupItem value="none">None</ToggleGroupItem>
        <ToggleGroupItem value="stack">Stacked</ToggleGroupItem>
        <ToggleGroupItem value="percent">100%</ToggleGroupItem>
      </ToggleGroup>
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

  if (type === "combo") {
    const series = getSeries(data)
    const renderTypes = options.seriesRenderType ?? {}
    return (
      <div className="flex flex-wrap items-center gap-3">
        {series.map(({ key, label }, index) => {
          const renderAs = renderTypes[key] ?? (index === 0 ? "bar" : "line")
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span className="max-w-20 truncate text-xs text-muted-foreground">{label}</span>
              <ToggleGroup
                value={[renderAs]}
                onValueChange={(values) => {
                  const next = values[0] as "bar" | "line" | undefined
                  if (!next) return
                  onChange({
                    ...options,
                    seriesRenderType: { ...renderTypes, [key]: next },
                  })
                }}
              >
                <ToggleGroupItem value="bar" size="sm">
                  Bar
                </ToggleGroupItem>
                <ToggleGroupItem value="line" size="sm">
                  Line
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )
        })}
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
