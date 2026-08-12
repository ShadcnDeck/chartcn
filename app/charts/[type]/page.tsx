import { Suspense } from "react"
import { notFound } from "next/navigation"

import { ChartDetailClient } from "@/components/chart-detail-client"
import { chartTypeDescriptions, chartTypeLabels, chartTypes } from "@/lib/sample-data"
import type { ChartType } from "@/types/chart"

interface ChartDetailPageProps {
  params: Promise<{ type: string }>
}

export function generateStaticParams() {
  return chartTypes.map((type) => ({ type }))
}

function isChartType(value: string): value is ChartType {
  return (chartTypes as string[]).includes(value)
}

export default async function ChartDetailPage({ params }: ChartDetailPageProps) {
  const { type } = await params

  if (!isChartType(type)) {
    notFound()
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {chartTypeLabels[type]}
        </h1>
        <p className="max-w-lg text-muted-foreground">{chartTypeDescriptions[type]}</p>
      </div>
      <Suspense fallback={null}>
        <ChartDetailClient type={type} />
      </Suspense>
    </main>
  )
}
