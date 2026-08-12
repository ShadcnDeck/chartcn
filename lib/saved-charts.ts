import type { ChartOptions, ChartType } from "@/types/chart"

export interface SavedChart {
  id: string
  name: string
  type: ChartType
  csv: string
  options: ChartOptions
  savedAt: string
}

const STORAGE_KEY = "shadcn-charts:saved"
const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedCharts: SavedChart[] = []

function parse(raw: string | null): SavedChart[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SavedChart[]) : []
  } catch {
    return []
  }
}

/** Reads localStorage, caching the parsed result so unchanged reads return
 * the same array reference (required by useSyncExternalStore to avoid
 * re-render loops). */
function readAll(): SavedChart[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedCharts = parse(raw).sort((a, b) => b.savedAt.localeCompare(a.savedAt))
  }
  return cachedCharts
}

function writeAll(charts: SavedChart[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(charts))
  cachedRaw = null
  listeners.forEach((listener) => listener())
}

export function subscribeSavedCharts(callback: () => void): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function getSavedChartsSnapshot(): SavedChart[] {
  return readAll()
}

const EMPTY_SAVED_CHARTS: SavedChart[] = []

export function getSavedChartsServerSnapshot(): SavedChart[] {
  return EMPTY_SAVED_CHARTS
}

export function saveChart(chart: Omit<SavedChart, "id" | "savedAt">): SavedChart {
  const saved: SavedChart = {
    ...chart,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  }
  writeAll([...readAll(), saved])
  return saved
}

export function deleteSavedChart(id: string): void {
  writeAll(readAll().filter((chart) => chart.id !== id))
}
