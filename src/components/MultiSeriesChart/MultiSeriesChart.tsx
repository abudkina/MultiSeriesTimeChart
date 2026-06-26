import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption, SeriesOption } from 'echarts';
import type { CallbackDataParams } from 'echarts/types/dist/shared';

type AxisTooltipParams = CallbackDataParams & {
  axisValue?: number | string;
};
import {
  type ChartSeries,
  type MultiSeriesChartProps,
  type TimeSeriesPoint,
  DEFAULT_COLORS,
  SERIES_TYPE_ORDER,
  type AxisFormat,
} from './types';
import './MultiSeriesChart.css';

function parseDate(date: string | number): number {
  return typeof date === 'number' ? date : new Date(date).getTime();
}

function formatTooltipDate(timestamp: number): string {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function getAxisIndex(format: AxisFormat): number {
  switch (format) {
    case 'percent':
      return 0;
    case 'currency':
      return 1;
    case 'number':
      return 2;
    case 'decimal':
      return 3;
  }
}

function activeMarkerEmphasis(color: string, size = 8) {
  return {
    focus: 'none' as const,
    scale: false,
    symbolSize: size,
    itemStyle: {
      color: '#fff',
      borderColor: color,
      borderWidth: 2,
      shadowBlur: 3,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffsetX: 0,
      shadowOffsetY: 1,
    },
  };
}

function buildSeriesConfig(s: ChartSeries): SeriesOption {
  const color = s.color ?? DEFAULT_COLORS[s.type];
  const axisFormat = s.axisFormat ?? (s.type === 'bar' ? 'decimal' : 'number');
  const yAxisIndex = getAxisIndex(axisFormat);
  const data = s.data.map((p) => [parseDate(p.date), p.value] as [number, number]);

  const base = {
    id: s.id,
    name: s.name,
    yAxisIndex,
    data,
    z: s.type === 'area' ? 1 : s.type === 'bar' ? 2 : s.type === 'spline' ? 4 : 5,
  };

  const noBlur = { lineStyle: { opacity: 1 }, areaStyle: { opacity: 0.88 } };

  switch (s.type) {
    case 'area':
      return {
        ...base,
        type: 'line' as const,
        smooth: false,
        symbol: 'circle',
        symbolSize: 4,
        showSymbol: false,
        lineStyle: { width: 0 },
        areaStyle: { color, opacity: 0.88 },
        itemStyle: { color: '#fff', borderColor: color, borderWidth: 1.5 },
        blur: noBlur,
        emphasis: activeMarkerEmphasis(color, 7),
      };
    case 'bar':
      return {
        ...base,
        type: 'bar' as const,
        barWidth: '50%',
        barMaxWidth: 9,
        barMinHeight: 4,
        itemStyle: {
          color,
          borderRadius: [5, 5, 0, 0],
        },
      };
    case 'spline':
      return {
        ...base,
        type: 'line',
        smooth: 0.38,
        symbol: 'diamond',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { color, width: 3.5, cap: 'round', join: 'round' },
        itemStyle: {
          color: '#fff',
          borderColor: color,
          borderWidth: 2,
        },
        blur: noBlur,
        emphasis: activeMarkerEmphasis(color, 8),
      };
    case 'line':
      return {
        ...base,
        type: 'line',
        smooth: false,
        symbol: 'rect',
        symbolSize: 4,
        showSymbol: true,
        lineStyle: { color, width: 1.8, cap: 'square', join: 'miter' },
        itemStyle: { color, borderWidth: 0 },
        blur: noBlur,
        emphasis: activeMarkerEmphasis(color, 8),
      };
  }
}

function sortSeries(series: ChartSeries[]): ChartSeries[] {
  const orderMap = Object.fromEntries(SERIES_TYPE_ORDER.map((t, i) => [t, i]));
  return [...series].sort(
    (a, b) => (orderMap[a.type] ?? 99) - (orderMap[b.type] ?? 99),
  );
}

function makeHiddenAxis(min: number, max: number) {
  return {
    type: 'value' as const,
    min,
    max,
    show: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
  };
}

function axisRange(series: ChartSeries[], format: AxisFormat): [number, number] {
  const values = series
    .filter((s) => (s.axisFormat ?? (s.type === 'bar' ? 'decimal' : 'number')) === format)
    .flatMap((s) => s.data.map((p) => p.value));
  if (!values.length) return [0, 100];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.12 || max * 0.1 || 1;

  switch (format) {
    case 'decimal':
      return [0, Math.max(max * 14, 1)];
    case 'currency':
      return [0, max + pad * 2];
    case 'percent':
      return [Math.max(0, min - pad), max + pad];
    default:
      return [Math.max(0, min - pad), max + pad];
  }
}

export function MultiSeriesChart({
  series,
  todayLabel = 'Tdy',
  height = 320,
  className,
}: MultiSeriesChartProps) {
  const option = useMemo((): EChartsOption => {
    const sorted = sortSeries(series);

    const [percentMin, percentMax] = axisRange(sorted, 'percent');
    const [currencyMin, currencyMax] = axisRange(sorted, 'currency');
    const [numberMin, numberMax] = axisRange(sorted, 'number');
    const [decimalMin, decimalMax] = axisRange(sorted, 'decimal');

    const yAxes = [
      makeHiddenAxis(percentMin, percentMax),
      makeHiddenAxis(currencyMin, currencyMax),
      makeHiddenAxis(numberMin, numberMax),
      makeHiddenAxis(decimalMin, decimalMax),
    ];

    const colorByName = Object.fromEntries(
      sorted.map((s) => [s.name, s.color ?? DEFAULT_COLORS[s.type]]),
    );
    const tooltipOrder = Object.fromEntries(
      SERIES_TYPE_ORDER.map((t, i) => [t, i]),
    );
    const seriesOrder = Object.fromEntries(
      sorted.map((s, i) => [s.name, tooltipOrder[s.type] ?? i]),
    );

    return {
      backgroundColor: 'transparent',
      animation: false,
      axisPointer: {
        type: 'line',
        snap: true,
        lineStyle: { color: 'rgba(0,0,0,0.2)', width: 1, type: 'dashed' },
        label: { show: false },
      },
      grid: {
        left: 2,
        right: 6,
        top: 4,
        bottom: 6,
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          snap: true,
          lineStyle: { color: 'rgba(0,0,0,0.2)', width: 1, type: 'dashed' },
          label: { show: false },
        },
        backgroundColor: '#fff',
        borderColor: 'transparent',
        borderRadius: 6,
        padding: [8, 12],
        extraCssText:
          'box-shadow: 0 2px 12px rgba(0,0,0,0.14); border: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
        formatter: (params: AxisTooltipParams | AxisTooltipParams[]) => {
          const items = Array.isArray(params) ? params : [params];
          if (!items.length) return '';
          const ts = Number(items[0].axisValue);
          const rows = items
            .filter((p) => p.value != null && p.value !== '')
            .sort(
              (a, b) =>
                (seriesOrder[a.seriesName ?? ''] ?? 99) -
                (seriesOrder[b.seriesName ?? ''] ?? 99),
            )
            .map((p) => {
              const dot = colorByName[p.seriesName ?? ''] ?? '#999';
              const raw = Array.isArray(p.value) ? p.value[1] : p.value;
              const val =
                typeof raw === 'number'
                  ? raw.toLocaleString('en-US', { maximumFractionDigits: 2 })
                  : raw;
              return `<div class="chart-tooltip-row">
                <span class="chart-tooltip-dot" style="background:${dot}"></span>
                <span class="chart-tooltip-text">${p.seriesName}: <strong>${val}</strong></span>
              </div>`;
            })
            .join('');
          return `<div class="chart-tooltip">
            <div class="chart-tooltip-date">${formatTooltipDate(ts)}</div>
            ${rows}
          </div>`;
        },
      },
      xAxis: {
        type: 'time',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: yAxes,
      series: sorted.map((s) => buildSeriesConfig(s)),
    };
  }, [series]);

  return (
    <div className={`multi-series-chart ${className ?? ''}`} style={{ height }}>
      <div className="multi-series-chart__toolbar">
        <button type="button" className="multi-series-chart__edit-btn" aria-label="Edit chart">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              fill="currentColor"
            />
          </svg>
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <path d="M1 3l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </button>
      </div>

      <div className="multi-series-chart__body">
        <div className="multi-series-chart__axis-labels">
          <span className="multi-series-chart__axis-item multi-series-chart__today">{todayLabel}</span>
          <span className="multi-series-chart__axis-item">0%</span>
          <span className="multi-series-chart__axis-item">$0</span>
          <span className="multi-series-chart__axis-item">$0</span>
          <span className="multi-series-chart__axis-item">0</span>
          <span className="multi-series-chart__axis-item">0</span>
          <span className="multi-series-chart__axis-item multi-series-chart__dash">—</span>
        </div>
        <div className="multi-series-chart__plot">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    </div>
  );
}

export type { ChartSeries, MultiSeriesChartProps, TimeSeriesPoint };
