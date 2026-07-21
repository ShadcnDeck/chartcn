import Link from "next/link"

import { ChartPreview } from "@/components/chart-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { parseCSV } from "@/lib/csv-parser"
import { sampleCSV } from "@/lib/sample-data"

// TODO: replace with the project's actual GitHub repo URL once created.
const GITHUB_URL = "#"

export default function Home() {
  const data = parseCSV(sampleCSV.bar)

  return (
    <main className="flex flex-1 flex-col items-center gap-16 px-6 py-20">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Data-driven chart components for shadcn/ui
        </h1>
        <p className="text-lg text-muted-foreground">
          Paste your CSV. See your chart. Copy the component.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link href="/charts" />} size="lg">
            View all charts
          </Button>
          <Button
            render={<a href={GITHUB_URL} target="_blank" rel="noreferrer" />}
            variant="outline"
            size="lg"
          >
            Star on GitHub
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-3xl">
        <CardContent className="pt-6">
          <ChartPreview type="bar" data={data} />
        </CardContent>
      </Card>
    </main>
  )
}
