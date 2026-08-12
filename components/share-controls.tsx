"use client"

import { useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { Check, Link as LinkIcon, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { buildShareURL, encodeShareConfig } from "@/lib/share"
import {
  deleteSavedChart,
  getSavedChartsServerSnapshot,
  getSavedChartsSnapshot,
  saveChart,
  subscribeSavedCharts,
  type SavedChart,
} from "@/lib/saved-charts"
import { chartTypeLabels } from "@/lib/sample-data"
import type { ChartOptions, ChartType } from "@/types/chart"

interface ShareControlsProps {
  type: ChartType
  csv: string
  options: ChartOptions
}

export function ShareControls({ type, csv, options }: ShareControlsProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [naming, setNaming] = useState(false)
  const [name, setName] = useState("")
  const saved = useSyncExternalStore(
    subscribeSavedCharts,
    getSavedChartsSnapshot,
    getSavedChartsServerSnapshot
  )

  async function handleCopyLink() {
    const encoded = await encodeShareConfig({ type, csv, options })
    await navigator.clipboard.writeText(buildShareURL(encoded))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSave() {
    if (!name.trim()) return
    saveChart({ name: name.trim(), type, csv, options })
    setName("")
    setNaming(false)
  }

  async function handleLoad(chart: SavedChart) {
    const encoded = await encodeShareConfig({
      type: chart.type,
      csv: chart.csv,
      options: chart.options,
    })
    router.push(`/charts/${chart.type}?c=${encoded}`)
  }

  function handleDelete(id: string) {
    deleteSavedChart(id)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
          {copied ? "Link copied!" : "Copy share link"}
        </Button>
        {naming ? (
          <div className="flex items-center gap-1.5">
            <Input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSave()}
              placeholder="Chart name"
              className="h-8 w-40"
            />
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setNaming(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setNaming(true)}>
            <Save className="size-4" /> Save chart
          </Button>
        )}
      </div>

      {saved.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-border p-2.5">
          <span className="text-xs font-medium text-muted-foreground">Saved charts</span>
          {saved.map((chart) => (
            <div key={chart.id} className="flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleLoad(chart)}
                className="min-w-0 flex-1 truncate text-left hover:text-primary"
              >
                {chart.name}{" "}
                <span className="text-muted-foreground">({chartTypeLabels[chart.type]})</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(chart.id)}
                aria-label={`Delete ${chart.name}`}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
