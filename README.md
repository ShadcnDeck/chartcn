# shadcn-charts

Data-driven chart components for [shadcn/ui](https://ui.shadcn.com). Paste your CSV. See your chart. Copy the component.

No black-box npm package — every chart is code you own, built on [Recharts](https://recharts.org) and shadcn/ui primitives.

## Features

- 5 chart types: Bar, Line, Area, Pie/Donut, Radar
- Live data input: paste CSV, upload a `.csv` file, or edit an inline table
- Per-chart variant toggles (stacked/grouped, smooth lines, donut, label style, ...)
- One-click "Copy component" — get self-contained TSX with your data baked in
- No new dependencies required in the target project beyond shadcn/ui + Recharts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/` — landing page with a live demo
- `/charts` — gallery of all 5 chart types
- `/charts/[type]` — paste/upload/edit data, tweak variants, copy the component

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

Pie/Donut charts expect exactly 2 columns: `Category,Value`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
