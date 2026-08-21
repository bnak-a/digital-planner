# The Easy Monthly Planner

A dark-themed monthly planner UI built with React, TypeScript, Vite and Tailwind CSS v4.

## Features

- Live flip-style clock with the current long-form date
- Monthly calendar grid with prev / today / next navigation
- Tasks per day with category colors, urgent and daily-repeat markers
- Tabs for All / Daily Tasks / Completed, plus category filter, sort and search
- Day detail dialog to add, complete and delete tasks
- Custom categories with a color palette
- Year / Month / Week / Day completion progress bars
- State persisted to `localStorage`

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |

## Layout

```
src/
  components/   UI components (calendar, sidebar, clock, forms, modals)
  lib/          date helpers, progress math, seed data, localStorage store
  types.ts      Task and Category models
```
