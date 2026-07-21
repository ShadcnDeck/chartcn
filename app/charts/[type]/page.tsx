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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{chartTypeLabels[type]}</h1>
        <p className="text-muted-foreground">{chartTypeDescriptions[type]}</p>
      </div>
      <ChartDetailClient type={type} />
    </main>
  )
}
