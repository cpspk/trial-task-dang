import dynamic from 'next/dynamic';
import { TVChartProps } from './chart';

const Chart = dynamic<TVChartProps>(
  () => import('./chart').then(mod => mod.TVChart),
  {
    ssr: false,
  }
);

const TVChart = (props: TVChartProps) => <Chart {...props} />;

export default TVChart;
