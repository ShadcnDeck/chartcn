"use client"

import { Button } from "@/components/ui/button"

export interface ColorPickerItem {
  key: string
  label: string
  color: string
}

interface ColorPickerRowProps {
  items: ColorPickerItem[]
  hasCustomColors: boolean
  onChange: (key: string, color: string) => void
  onReset: () => void
}

/** CSS color functions (var(), oklch(), etc.) aren't valid <input type="color">
 * values, so swatches resolve to a real hex via the browser's own color
 * parsing (a throwaway element's computed style) before rendering. */
function toHex(cssColor: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(cssColor)) return cssColor
  if (typeof window === "undefined") return "#888888"

  const probe = document.createElement("div")
  probe.style.color = cssColor
  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).color
  document.body.removeChild(probe)

  const match = computed.match(/\d+/g)
  if (!match) return "#888888"
  const [r, g, b] = match.map(Number)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`
}

export function ColorPickerRow({ items, hasCustomColors, onChange, onReset }: ColorPickerRowProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item) => (
        <label key={item.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input
            type="color"
            value={toHex(item.color)}
            onChange={(event) => onChange(item.key, event.target.value)}
            className="size-5 shrink-0 cursor-pointer rounded-full border border-border bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0"
            aria-label={`Color for ${item.label}`}
          />
          <span className="max-w-20 truncate">{item.label}</span>
        </label>
      ))}
      {hasCustomColors && (
        <Button variant="ghost" size="xs" onClick={onReset}>
          Reset colors
        </Button>
      )}
    </div>
  )
}
