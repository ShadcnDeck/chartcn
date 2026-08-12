# shadcn-charts

Data-driven chart components for [shadcn/ui](https://ui.shadcn.com). Paste your CSV. See your chart. Copy the component.

No black-box npm package — every chart is code you own, built on [Recharts](https://recharts.org) and shadcn/ui primitives.

## Features

- 8 chart types: Bar, Line, Area, Combo (bar + line), Pie/Donut, Radar, Scatter, Radial/Gauge
- Live data input: paste CSV, upload a `.csv` file, or edit an inline table
- Per-chart variant toggles (stacked/grouped/100%, smooth lines, donut, label style, combo per-series bar/line, ...)
- Date-axis detection — a date-like category column (`2024-01-01`, `1/5/2024`, ...) gets formatted date ticks automatically
- Custom series/category colors, live-previewed and reflected in the copied code
- Export the generated component with data baked in, or as a `data` prop for live/fetched data
- Shareable links (`?c=...`) and browser-local saved charts, so a config survives a refresh or can be sent to a teammate
- One-click "Copy component" — get self-contained TSX
- No new dependencies required in the target project beyond shadcn/ui + Recharts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/` — landing page with a live demo
- `/charts` — gallery of all 8 chart types
- `/charts/[type]` — paste/upload/edit data, tweak variants, customize colors, copy the component

## Tech stack

- Next.js (App Router) + TypeScript
- shadcn/ui + Tailwind CSS
- Recharts
- Papa Parse (CSV parsing)
- Shiki (code highlighting)

## CSV format

Column 1 is always the category/label axis; every column after it is a numeric data series.

```
Month,Revenue,Expenses
Jan,42000,31000
Feb,58000,34000
```

Pie/Donut and Radial/Gauge charts expect exactly 2 columns: `Category,Value`.

Scatter charts expect exactly 3 columns: `Category,X,Y` — the category groups points into a legend/color series, X and Y are the two numeric axes.

If column 1 looks like a date (`2024-01-01` or `1/5/2024`), Bar/Line/Area/Combo charts automatically format the axis and tooltip as dates.

## Export modes

Toggle "Inline data" vs. "Data as prop" above the code block:

- **Inline data** (default) — the component has your data baked in as a module-level const, ready to paste and run as-is.
- **Data as prop** — the component takes `data` as a prop (`export function Chart({ data }: ChartProps)`), for wiring up to live or fetched data instead of a static snapshot.

## Sharing and saving

- **Copy share link** encodes the current chart type, data, and options into a `?c=` URL query param — anyone who opens the link sees the same chart.
- **Save chart** stores a named copy in the browser's `localStorage` so it survives a refresh; reload it later from the "Saved charts" list.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
