import Link from "next/link"
import { AreaChart, BarChart3, LineChart, PieChart, Radar } from "lucide-react"

import { ChartPreview } from "@/components/chart-preview"
import { CopyButton } from "@/components/copy-button"
import { InteractiveGrid } from "@/components/interactive-grid"
import { Reveal } from "@/components/reveal"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { parseCSV } from "@/lib/csv-parser"
import { sampleCSV } from "@/lib/sample-data"

const GITHUB_URL = "https://github.com/ShadcnDeck/chartcn"

const chartLinks = [
  { type: "bar", label: "Bar", icon: BarChart3 },
  { type: "line", label: "Line", icon: LineChart },
  { type: "area", label: "Area", icon: AreaChart },
  { type: "pie", label: "Pie", icon: PieChart },
  { type: "radar", label: "Radar", icon: Radar },
] as const

const installSteps = [
  {
    title: "Add the shadcn/ui chart primitive",
    body: "This gives your project the chart wrapper, tooltip, and legend components every chart here is built on.",
    command: "npx shadcn@latest add chart",
  },
  {
    title: "Make sure Recharts is installed",
    body: "The actual bars, lines, and shapes are rendered by Recharts under the hood.",
    command: "pnpm install recharts",
  },
]

export default function Home() {
  const data = parseCSV(sampleCSV.area)

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="relative flex w-full flex-col items-center overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_85%_at_50%_20%,#000_30%,transparent_95%)]" />
        <InteractiveGrid className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_85%_at_50%_20%,#000_30%,transparent_95%)]" />
        <div className="pointer-events-none absolute top-[-12rem] left-1/2 -z-10 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />

        <div className="flex flex-col items-center gap-16 px-6 pt-24 pb-20 sm:pt-32">
          <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
            <span className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm duration-500">
              <span className="size-1.5 rounded-full bg-primary" />
              Built for shadcn/ui
            </span>

            <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both text-4xl font-semibold tracking-tight text-balance duration-700 delay-[80ms] sm:text-6xl">
              Charts for shadcn/ui,
              <br />
              <span className="font-serif text-5xl italic font-normal text-primary sm:text-7xl">
                done right
              </span>
            </h1>

            <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both max-w-md text-lg text-balance text-muted-foreground duration-700 delay-[160ms]">
              Paste your CSV, see the chart render live, then copy a
              production-ready component. No config, no account.
            </p>

            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both flex flex-wrap items-center justify-center gap-3 duration-700 delay-[240ms]">
              <Link href="/charts" className={cn(buttonVariants({ size: "lg" }))}>
                View all charts
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Star on GitHub
              </a>
            </div>

            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both flex flex-wrap items-center justify-center gap-2 pt-2 duration-700 delay-[320ms]">
              {chartLinks.map(({ type, label, icon: Icon }) => (
                <Link
                  key={type}
                  href={`/charts/${type}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Icon className="size-3.5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:fill-mode-both relative w-full max-w-3xl duration-700 delay-[400ms]">
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/10 to-transparent blur-2xl" />
            <Card className="w-full overflow-hidden py-0 shadow-xl shadow-black/[0.03] ring-1 ring-border">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
                <span className="size-2.5 rounded-full bg-chart-5/60" />
                <span className="size-2.5 rounded-full bg-chart-4/60" />
                <span className="size-2.5 rounded-full bg-chart-3/60" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  revenue.csv
                </span>
              </div>
              <CardContent className="pt-6">
                <ChartPreview type="area" data={data} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <section className="w-full max-w-4xl border-t border-border px-6 py-20">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            New to this?
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Get set up in{" "}
            <span className="font-serif text-3xl italic font-normal text-primary sm:text-4xl">
              three steps
            </span>
          </h2>
          <p className="max-w-md text-muted-foreground">
            You don&apos;t need to know Recharts or shadcn/ui inside out. Run
            these two commands once in your project, then copy-paste from any
            chart page.
          </p>
        </Reveal>

        <ol className="mt-12 flex flex-col gap-4">
          {installSteps.map((step, index) => (
            <li key={step.command}>
              <Reveal delay={index * 100}>
                <Card className="flex-row items-center gap-4 py-4 sm:py-5">
                  <CardContent className="flex flex-1 flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="flex items-start gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-medium">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.body}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 py-1.5 pr-1.5 pl-3 sm:ml-4">
                      <code className="font-mono text-sm whitespace-nowrap text-foreground">
                        {step.command}
                      </code>
                      <CopyButton
                        text={step.command}
                        label="Copy"
                        variant="ghost"
                        size="sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal delay={installSteps.length * 100}>
              <Card className="flex-row items-center gap-4 py-4 sm:py-5">
                <CardContent className="flex flex-1 items-start gap-3 px-4 sm:px-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    3
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-medium">Copy a chart into your project</h3>
                    <p className="text-sm text-muted-foreground">
                      Open any chart below, paste your own data, then hit{" "}
                      <span className="font-medium text-foreground">Copy component</span>{" "}
                      and drop the code into a file in your app.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </li>
        </ol>

        <Reveal delay={(installSteps.length + 1) * 100} className="mt-10 flex justify-center">
          <Link href="/charts" className={cn(buttonVariants({ size: "lg" }))}>
            Browse the charts
          </Link>
        </Reveal>
      </section>
    </main>
  )
}
