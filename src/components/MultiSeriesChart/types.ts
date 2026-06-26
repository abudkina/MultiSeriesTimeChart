export type SeriesType = 'area' | 'spline' | 'line' | 'bar';

export type AxisFormat = 'percent' | 'currency' | 'number' | 'decimal';

export interface TimeSeriesPoint {
  /** ISO date string (YYYY-MM-DD) or timestamp in ms */
  date: string | number;
  value: number;
}

export interface ChartSeries {
  id: string;
  name: string;
  type: SeriesType;
  data: TimeSeriesPoint[];
  color?: string;
  /** Which Y-axis this series maps to */
  axisFormat?: AxisFormat;
}

export interface MultiSeriesChartProps {
  series: ChartSeries[];
  /** Label shown at the top of the left axis column, e.g. "Tdy" */
  todayLabel?: string;
  height?: number;
  className?: string;
}

export const DEFAULT_COLORS: Record<SeriesType, string> = {
  area: '#FFF59D',
  bar: '#2962FF',
  spline: '#2E7D32',
  line: '#AA00FF',
};

export const SERIES_TYPE_ORDER: SeriesType[] = ['area', 'bar', 'spline', 'line'];
