import { ChartCard } from "@/components/chart-card"
import { chartTypes } from "@/lib/sample-data"

export default function ChartsGallery() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Chart gallery</h1>
        <p className="text-muted-foreground">
          Every chart below is powered by live sample data. Pick one to paste your own CSV, upload a file, or edit the table.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {chartTypes.map((type) => (
          <ChartCard key={type} type={type} />
        ))}
      </div>
    </main>
  )
}
