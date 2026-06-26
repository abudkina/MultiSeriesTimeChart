# Multi-Series Time Chart

React-компонент графика с 4 time-series сериями разных типов: **area**, **spline**, **line**, **bar**. Стили и поведение повторяют референс: розовый фон, левая колонка осей, tooltip с датой `DD.MM.YYYY`, hover с вертикальной линией и цветными halo на точках.

## Быстрый старт

```bash
git clone https://github.com/<username>/multi-series-time-chart.git
cd multi-series-time-chart
npm install
npm run dev
```

Откройте http://localhost:5173

### Опубликовать на GitHub

```bash
# в корне проекта (уже есть git init + commit)
git branch -M main
git remote add origin https://github.com/<username>/multi-series-time-chart.git
git push -u origin main
```

Создайте пустой репозиторий `multi-series-time-chart` на github.com → New repository.

## Инициализация с 4 последовательностями

```tsx
import { MultiSeriesChart, type ChartSeries } from './components/MultiSeriesChart';

const series: ChartSeries[] = [
  {
    id: 'cost',
    name: 'Cost',
    type: 'area',           // жёлтая заливка
    axisFormat: 'currency',
    color: '#FFF59D',
    data: [
      { date: '2026-06-01', value: 38 },
      { date: '2026-06-12', value: 44.36 },
    ],
  },
  {
    id: 'cpa',
    name: 'CPA',
    type: 'bar',            // синие столбцы внизу
    axisFormat: 'decimal',
    color: '#2962FF',
    data: [
      { date: '2026-06-01', value: 0.8 },
      { date: '2026-06-12', value: 1.23 },
    ],
  },
  {
    id: 'roi',
    name: 'ROI confirmed',
    type: 'spline',         // зелёная сглаженная линия
    axisFormat: 'percent',
    color: '#2E7D32',
    data: [
      { date: '2026-06-01', value: 120 },
      { date: '2026-06-12', value: 161.47 },
    ],
  },
  {
    id: 'conversions',
    name: 'Conversions',
    type: 'line',           // фиолетовая линия с квадратными маркерами
    axisFormat: 'number',
    color: '#AA00FF',
    data: [
      { date: '2026-06-01', value: 28 },
      { date: '2026-06-12', value: 36 },
    ],
  },
];

<MultiSeriesChart series={series} todayLabel="Tdy" height={340} />
```

## API

### `ChartSeries`

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `string` | Уникальный id серии |
| `name` | `string` | Имя в tooltip |
| `type` | `'area' \| 'spline' \| 'line' \| 'bar'` | Тип визуализации |
| `data` | `{ date: string \| number; value: number }[]` | Точки временного ряда |
| `color` | `string?` | Цвет (по умолчанию из палитры референса) |
| `axisFormat` | `'percent' \| 'currency' \| 'number' \| 'decimal'?` | Шкала Y для серии |

### `MultiSeriesChartProps`

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `series` | `ChartSeries[]` | — | Массив из 4 (или меньше) серий |
| `todayLabel` | `string` | `'Tdy'` | Метка в левой колонке |
| `height` | `number` | `320` | Высота виджета в px |
| `className` | `string` | — | Доп. CSS-класс |

## Типы серий

| type | Визуализация |
|------|-------------|
| `area` | Area fill без обводки |
| `bar` | Столбцы с закруглённым верхом |
| `spline` | Smooth line, diamond marker + green halo при hover |
| `line` | Линия с квадратными маркерами |

## Стек

- React 19 + TypeScript
- Vite
- Apache ECharts

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```
src/
  components/MultiSeriesChart/   # переиспользуемый компонент
  data/sampleSeries.ts           # демо-данные как на скриншоте
  App.tsx                        # пример использования
```
