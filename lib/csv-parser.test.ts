import { describe, expect, it } from "vitest"

import { parseCSV, toCSV, validateColumnsForType } from "@/lib/csv-parser"

describe("parseCSV", () => {
  it("parses a valid CSV into headers and numeric rows", () => {
    const result = parseCSV("Month,Revenue\nJan,100\nFeb,200")
    expect(result.error).toBeUndefined()
    expect(result.headers).toEqual(["Month", "Revenue"])
    expect(result.rows).toEqual([
      { Month: "Jan", Revenue: 100 },
      { Month: "Feb", Revenue: 200 },
    ])
  })

  it("errors on empty input", () => {
    expect(parseCSV("").error).toBe("No data provided.")
  })

  it("errors when there's no data row", () => {
    expect(parseCSV("Month,Revenue").error).toBe(
      "CSV needs a header row and at least one data row."
    )
  })

  it("coerces non-numeric values to 0 and warns", () => {
    const result = parseCSV("Month,Revenue\nJan,abc")
    expect(result.rows).toEqual([{ Month: "Jan", Revenue: 0 }])
    expect(result.error).toContain("non-numeric values were replaced with 0")
  })

  it("truncates series beyond the max and warns", () => {
    const headers = ["Category", ...Array.from({ length: 12 }, (_, i) => `Series${i}`)]
    const row = ["A", ...Array.from({ length: 12 }, (_, i) => String(i))]
    const csv = [headers.join(","), row.join(",")].join("\n")

    const result = parseCSV(csv)
    expect(result.headers).toHaveLength(11) // category + 10 series
    expect(result.error).toContain("Only the first 10 data series columns are shown")
  })

  it("truncates rows beyond the max and warns", () => {
    const rows = Array.from({ length: 501 }, (_, i) => `Row${i},${i}`)
    const csv = ["Category,Value", ...rows].join("\n")

    const result = parseCSV(csv)
    expect(result.rows).toHaveLength(500)
    expect(result.error).toContain("Only the first 500 rows are shown")
  })
})

describe("toCSV", () => {
  it("round-trips through parseCSV", () => {
    const original = parseCSV("Month,Revenue,Expenses\nJan,100,50\nFeb,200,80")
    const csvText = toCSV(original)
    const reparsed = parseCSV(csvText)

    expect(reparsed.headers).toEqual(original.headers)
    expect(reparsed.rows).toEqual(original.rows)
  })
})

describe("validateColumnsForType", () => {
  it("warns when pie doesn't have exactly 2 columns", () => {
    const data = parseCSV("Category,Value,Extra\nA,1,2")
    expect(validateColumnsForType("pie", data)).toContain("expect exactly 2 columns")
  })

  it("passes pie with exactly 2 columns", () => {
    const data = parseCSV("Category,Value\nA,1")
    expect(validateColumnsForType("pie", data)).toBeUndefined()
  })

  it("warns when scatter doesn't have exactly 3 columns", () => {
    const data = parseCSV("Category,Value\nA,1")
    expect(validateColumnsForType("scatter", data)).toContain("expect exactly 3 columns")
  })

  it("passes scatter with exactly 3 columns", () => {
    const data = parseCSV("Category,X,Y\nA,1,2")
    expect(validateColumnsForType("scatter", data)).toBeUndefined()
  })

  it("has no requirement for bar charts", () => {
    const data = parseCSV("Category,A,B,C\nRow,1,2,3")
    expect(validateColumnsForType("bar", data)).toBeUndefined()
  })
})
