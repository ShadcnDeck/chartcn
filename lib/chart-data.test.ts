import { describe, expect, it } from "vitest"

import {
  computeGrowth,
  getSeries,
  isDateAxis,
  resolveColor,
  toChartRows,
  toScatterGroups,
} from "@/lib/chart-data"
import { parseCSV } from "@/lib/csv-parser"

describe("getSeries", () => {
  it("sanitizes header names with spaces and symbols into safe keys", () => {
    const data = parseCSV("Month,Product A,Revenue (USD)\nJan,1,2")
    expect(getSeries(data)).toEqual([
      { key: "series_Product_A", label: "Product A" },
      { key: "series_Revenue_USD", label: "Revenue (USD)" },
    ])
  })
})

describe("toChartRows", () => {
  it("remaps rows to category + safe series keys", () => {
    const data = parseCSV("Month,Revenue\nJan,100")
    expect(toChartRows(data)).toEqual([{ category: "Jan", series_Revenue: 100 }])
  })
})

describe("resolveColor", () => {
  it("falls back to the palette when no custom color is set", () => {
    expect(resolveColor("series_a", 0)).toBe("var(--chart-1)")
    expect(resolveColor("series_a", 1)).toBe("var(--chart-2)")
  })

  it("uses the custom color when one is set for the key", () => {
    expect(resolveColor("series_a", 0, { series_a: "#ff0000" })).toBe("#ff0000")
  })
})

describe("computeGrowth", () => {
  it("returns null when there are fewer than 2 rows", () => {
    const data = parseCSV("Month,Revenue\nJan,100")
    expect(computeGrowth(data)).toBeNull()
  })

  it("returns null when the baseline is zero", () => {
    const data = parseCSV("Month,Revenue\nJan,0\nFeb,100")
    expect(computeGrowth(data)).toBeNull()
  })

  it("computes percent change from first to last row", () => {
    const data = parseCSV("Month,Revenue\nJan,100\nFeb,150")
    expect(computeGrowth(data)).toBe(50)
  })
})

describe("isDateAxis", () => {
  it("detects ISO dates in the category column", () => {
    const data = parseCSV("Date,Value\n2024-01-01,10\n2024-02-01,20")
    expect(isDateAxis(data)).toBe(true)
  })

  it("detects slash dates in the category column", () => {
    const data = parseCSV("Date,Value\n1/5/2024,10\n2/5/2024,20")
    expect(isDateAxis(data)).toBe(true)
  })

  it("returns false for non-date categories", () => {
    const data = parseCSV("Month,Value\nJan,10\nFeb,20")
    expect(isDateAxis(data)).toBe(false)
  })
})

describe("toScatterGroups", () => {
  it("groups rows by category into per-group point lists", () => {
    const data = parseCSV("Segment,X,Y\nA,1,2\nA,3,4\nB,5,6")
    const groups = toScatterGroups(data)

    expect(groups).toEqual([
      { key: "A", label: "A", color: "var(--chart-1)", points: [{ x: 1, y: 2 }, { x: 3, y: 4 }] },
      { key: "B", label: "B", color: "var(--chart-2)", points: [{ x: 5, y: 6 }] },
    ])
  })
})
