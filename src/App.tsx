import { MultiSeriesChart } from './components/MultiSeriesChart';
import { sampleSeries } from './data/sampleSeries';

export function App() {
  return (
    <div className="app">
      <MultiSeriesChart series={sampleSeries} todayLabel="Tdy" height={300} />
    </div>
  );
}
