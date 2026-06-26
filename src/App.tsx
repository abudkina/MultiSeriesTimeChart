import { MultiSeriesChart } from './components/MultiSeriesChart';
import { sampleSeries } from './data/sampleSeries';

export function App() {
  return (
    <div className="app">
      <h1 className="app__title">Multi-Series Time Chart</h1>
      <p className="app__hint">Наведите курсор на график — появится tooltip с датой и значениями всех серий.</p>
      <MultiSeriesChart series={sampleSeries} todayLabel="Tdy" height={340} />
    </div>
  );
}
