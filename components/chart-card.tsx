import Link from "next/link"

import { ChartPreview } from "@/components/chart-preview"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { chartTypeDescriptions, chartTypeLabels, sampleCSV } from "@/lib/sample-data"
import { parseCSV } from "@/lib/csv-parser"
import type { ChartType } from "@/types/chart"

interface ChartCardProps {
  type: ChartType
}

export function ChartCard({ type }: ChartCardProps) {
  const data = parseCSV(sampleCSV[type])

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{chartTypeLabels[type]}</CardTitle>
        <CardDescription>{chartTypeDescriptions[type]}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartPreview type={type} data={data} />
      </CardContent>
      <CardFooter>
        <Button render={<Link href={`/charts/${type}`} />} className="w-full">
          View and copy
        </Button>
      </CardFooter>
    </Card>
  )
}
