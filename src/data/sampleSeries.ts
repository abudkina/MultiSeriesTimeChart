import type { ChartSeries } from '../components/MultiSeriesChart';

/** Demo data shaped like the reference screenshots */
export const sampleSeries: ChartSeries[] = [
  {
    id: 'cost',
    name: 'Cost',
    type: 'area',
    axisFormat: 'currency',
    color: '#FFF59D',
    data: [
      { date: '2026-06-08', value: 2.04 },
      { date: '2026-06-09', value: 8.5 },
      { date: '2026-06-10', value: 18.2 },
      { date: '2026-06-11', value: 32.4 },
      { date: '2026-06-12', value: 44.36 },
      { date: '2026-06-13', value: 55.65 },
      { date: '2026-06-14', value: 63.75 },
    ],
  },
  {
    id: 'cpa',
    name: 'CPA',
    type: 'bar',
    axisFormat: 'decimal',
    color: '#2962FF',
    data: [
      { date: '2026-06-08', value: 0.68 },
      { date: '2026-06-09', value: 0.72 },
      { date: '2026-06-10', value: 0.75 },
      { date: '2026-06-11', value: 0.78 },
      { date: '2026-06-12', value: 1.23 },
      { date: '2026-06-13', value: 0.79 },
      { date: '2026-06-14', value: 0.71 },
    ],
  },
  {
    id: 'roi',
    name: 'ROI confirmed',
    type: 'spline',
    axisFormat: 'percent',
    color: '#2E7D32',
    data: [
      { date: '2026-06-08', value: 610.78 },
      { date: '2026-06-09', value: 420 },
      { date: '2026-06-10', value: 180 },
      { date: '2026-06-11', value: 95 },
      { date: '2026-06-12', value: 161.47 },
      { date: '2026-06-13', value: 56.33 },
      { date: '2026-06-14', value: 357.25 },
    ],
  },
  {
    id: 'conversions',
    name: 'Conversions',
    type: 'line',
    axisFormat: 'number',
    color: '#AA00FF',
    data: [
      { date: '2026-06-08', value: 3 },
      { date: '2026-06-09', value: 12 },
      { date: '2026-06-10', value: 28 },
      { date: '2026-06-11', value: 48 },
      { date: '2026-06-12', value: 36 },
      { date: '2026-06-13', value: 70 },
      { date: '2026-06-14', value: 90 },
    ],
  },
];
