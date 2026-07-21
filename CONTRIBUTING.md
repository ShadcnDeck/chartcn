# Contributing

Thanks for considering a contribution to shadcn-charts.

## Development setup

```bash
npm install
npm run dev
```

## Before opening a PR

```bash
npm run lint
npm run build
```

Both must pass without errors.

## Project structure

- `components/charts/` — the 5 chart components (bar, line, area, pie, radar)
- `components/data-input/` — CSV paste, CSV upload, editable table
- `lib/csv-parser.ts` — CSV parsing rules (see the PRD for the spec)
- `lib/code-templates.ts` — generates the self-contained TSX shown in "Copy component"
- `app/charts/[type]/page.tsx` — the interactive chart detail page

## Adding a new chart type

1. Add the type to `ChartType` in `types/chart.ts`
2. Add sample CSV + label/description to `lib/sample-data.ts`
3. Build the chart component in `components/charts/`
4. Wire it into `components/chart-preview.tsx`
5. Add a code template branch in `lib/code-templates.ts`
