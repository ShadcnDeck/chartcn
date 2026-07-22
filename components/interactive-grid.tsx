"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const SPACING = 40
const RADIUS = 130

// Idle "live bar chart" animation: each column's bar height drifts up and
// down forever using two summed sine waves so it never looks metronomic.
const MIN_BAR_RATIO = 0.06
const MAX_BAR_RATIO = 0.5

interface ColumnParams {
  speed1: number
  phase1: number
  speed2: number
  phase2: number
}

interface InteractiveGridProps {
  className?: string
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function InteractiveGrid({ className }: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let mouse: { x: number; y: number } | null = null
    let rafId: number | null = null
    let columns: ColumnParams[] = []

    function buildColumns() {
      const count = Math.ceil(width / SPACING) + 2
      columns = Array.from({ length: count }, (_, i) => {
        const seed = i * 12.9898
        return {
          speed1: 0.00018 + seededRandom(seed) * 0.00022,
          phase1: seededRandom(seed + 1) * Math.PI * 2,
          speed2: 0.00008 + seededRandom(seed + 2) * 0.00012,
          phase2: seededRandom(seed + 3) * Math.PI * 2,
        }
      })
    }

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildColumns()
      draw(performance.now())
    }

    function readPrimary() {
      const styles = getComputedStyle(document.documentElement)
      return styles.getPropertyValue("--primary").trim() || "#2a78d6"
    }

    function drawTile(primary: string, tileX: number, tileY: number, fillAlpha: number, strokeAlpha: number) {
      if (fillAlpha > 0) {
        ctx!.fillStyle = primary
        ctx!.globalAlpha = fillAlpha
        ctx!.fillRect(tileX, tileY, SPACING, SPACING)
      }
      if (strokeAlpha > 0) {
        ctx!.strokeStyle = primary
        ctx!.globalAlpha = strokeAlpha
        ctx!.lineWidth = 1
        ctx!.strokeRect(tileX + 0.5, tileY + 0.5, SPACING - 1, SPACING - 1)
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height)
      const primary = readPrimary()

      const rows = Math.ceil(height / SPACING) + 1
      const cellsAround = Math.ceil(RADIUS / SPACING) + 1
      const originCellX = mouse ? Math.floor(mouse.x / SPACING) : -999
      const originCellY = mouse ? Math.floor(mouse.y / SPACING) : -999

      for (let cx = 0; cx < columns.length; cx++) {
        const tileX = cx * SPACING
        if (tileX > width) continue

        let barTopRow = -1
        if (!reduceMotion) {
          const { speed1, phase1, speed2, phase2 } = columns[cx]
          const wave =
            Math.sin(time * speed1 + phase1) * 0.5 + Math.sin(time * speed2 + phase2) * 0.5
          const ratio = MIN_BAR_RATIO + ((wave + 1) / 2) * (MAX_BAR_RATIO - MIN_BAR_RATIO)
          const filledRows = Math.round(ratio * rows)
          barTopRow = rows - filledRows
        }

        for (let cy = 0; cy < rows; cy++) {
          const tileY = cy * SPACING

          let fillAlpha = 0
          let strokeAlpha = 0

          if (barTopRow >= 0 && cy >= barTopRow) {
            const isPeak = cy === barTopRow
            fillAlpha = isPeak ? 0.1 : 0.045
            strokeAlpha = isPeak ? 0.4 : 0.18
          }

          const withinHoverBand =
            mouse && Math.abs(cx - originCellX) <= cellsAround && Math.abs(cy - originCellY) <= cellsAround
          if (withinHoverBand) {
            const centerX = tileX + SPACING / 2
            const centerY = tileY + SPACING / 2
            const dx = centerX - mouse!.x
            const dy = centerY - mouse!.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < RADIUS) {
              const t = 1 - dist / RADIUS
              fillAlpha = Math.max(fillAlpha, t * t * 0.16)
              strokeAlpha = Math.max(strokeAlpha, t * t * 0.6)
            }
          }

          if (fillAlpha > 0 || strokeAlpha > 0) {
            drawTile(primary, tileX, tileY, fillAlpha, strokeAlpha)
          }
        }
      }
      ctx!.globalAlpha = 1
    }

    function loop(time: number) {
      draw(time)
      rafId = requestAnimationFrame(loop)
    }

    function scheduleStaticRedraw() {
      if (rafId != null) return
      rafId = requestAnimationFrame((t) => {
        rafId = null
        draw(t)
      })
    }

    function handleMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (reduceMotion) scheduleStaticRedraw()
    }

    function handleLeave() {
      mouse = null
      if (reduceMotion) scheduleStaticRedraw()
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas.parentElement!)

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseout", handleLeave)

    if (!reduceMotion) {
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseout", handleLeave)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className={cn("block", className)} />
}
