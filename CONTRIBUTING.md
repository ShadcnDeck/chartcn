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
npm test
```

All three must pass without errors.

## Running tests

Tests run on [Vitest](https://vitest.dev) (`npm test`). Test files are colocated as `lib/*.test.ts` and currently cover the pure data/codegen logic (`csv-parser.ts`, `chart-data.ts`, `code-templates.ts`, `share.ts`) — no DOM/component tests yet. If you add a component test, you'll need to add `jsdom` and `@testing-library/react`/`@vitejs/plugin-react` as devDependencies and switch `vitest.config.mts`'s `environment` to `"jsdom"` (see `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md` for the official setup).

## Project structure

- `components/charts/` — the 8 chart components (bar, line, area, combo, pie, radar, scatter, radial)
- `components/data-input/` — CSV paste, CSV upload, editable table
- `components/color-picker-row.tsx` — per-series/category custom color swatches
- `components/share-controls.tsx` — share-link and saved-charts UI
- `lib/csv-parser.ts` — CSV parsing rules, plus `toCSV` (inverse serialization) and `validateColumnsForType` (per-type column-count checks, e.g. pie's `Category,Value`)
- `lib/chart-data.ts` — shared data-shaping helpers (series/rows, color resolution, date-axis detection, scatter grouping) used by both the live preview and the code generator
- `lib/code-templates.ts` — generates the self-contained TSX shown in "Copy component", including the inline-vs-props export mode
- `lib/share.ts` / `lib/saved-charts.ts` — URL-encoded share links and `localStorage`-backed saved charts
- `app/charts/[type]/page.tsx` — the interactive chart detail page

## Adding a new chart type

1. Add the type to `ChartType` in `types/chart.ts`, plus any type-specific fields on `ChartOptions`
2. Add sample CSV + label/description to `lib/sample-data.ts`, and append it to the `chartTypes` array
3. Add an icon entry to `chartIcons` in `components/chart-card.tsx`
4. Build the chart component in `components/charts/`, following the pattern in an existing type (reuse `getSeries`/`toChartRows`/`buildChartConfig`/`resolveColor` from `lib/chart-data.ts` where the data shape allows it)
5. Wire it into the switch in `components/chart-preview.tsx`
6. Add a generator function + switch case in `lib/code-templates.ts` (reuse the shared `renderShell` helper for the inline/props export-mode boilerplate)
7. If the type has a fixed CSV shape (like pie's `Category,Value` or scatter's `Category,X,Y`), add it to `COLUMN_REQUIREMENTS` in `lib/csv-parser.ts`
8. Add any variant controls to `ChartVariantToggles` in `components/chart-detail-client.tsx`, and update the `showSidePanel`/`growth` gating there if the type is a multi-series wide-table shape
9. Add test cases in `lib/code-templates.test.ts` covering the new generator
