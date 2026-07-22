"use client"

import type { ChartConfig } from "@/components/ui/chart"
import { formatCompactNumber } from "@/lib/chart-data"

interface ChartBreakdownTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<Record<string, unknown>>
  label?: string | number
  config: ChartConfig
  seriesOrder: string[]
}

/** Tooltip for multi-series bar/line/area charts: shows the row's total plus
 * a small pie breaking down each series' share of that row. */
export function ChartBreakdownTooltip({
  active,
  payload,
  label,
  config,
  seriesOrder,
}: ChartBreakdownTooltipProps) {
  if (!active || !payload?.length) return null

  const source = (payload[0]?.payload as Record<string, unknown> | undefined) ?? {}

  const entries = seriesOrder
    .map((key) => {
      const raw = source[key]
      const value = typeof raw === "number" ? raw : Number(raw)
      return {
        key,
        label: config[key]?.label ?? key,
        color: config[key]?.color ?? "var(--chart-1)",
        value: Number.isFinite(value) ? Math.abs(value) : 0,
      }
    })
    .filter((entry) => entry.value > 0)

  const total = entries.reduce((sum, entry) => sum + entry.value, 0)

  if (entries.length === 0) return null

  const cumulativeTotals = entries.reduce<number[]>((acc, entry) => {
    const previous = acc.length > 0 ? acc[acc.length - 1] : 0
    return [...acc, previous + entry.value]
  }, [])
  const stops = entries.map((entry, index) => {
    const previous = index > 0 ? cumulativeTotals[index - 1] : 0
    const start = (previous / total) * 100
    const end = (cumulativeTotals[index] / total) * 100
    return `${entry.color} ${start}% ${end}%`
  })
  const donutBackground = `conic-gradient(${stops.join(", ")})`

  return (
    <div className="min-w-[13rem] rounded-xl border border-border bg-card p-3 text-xs shadow-lg">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono font-semibold text-foreground">
          {formatCompactNumber(total)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="relative size-14 shrink-0 rounded-full"
          style={{ background: donutBackground }}
        >
          <div className="absolute inset-[6px] rounded-full bg-card" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {entries.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="truncate">{entry.label}</span>
              </span>
              <span className="shrink-0 font-medium text-foreground">
                {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
