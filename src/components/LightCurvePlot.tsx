import Plot from 'react-plotly.js';
import { LightCurveData } from '../lib/supabase';

interface LightCurvePlotProps {
  data: LightCurveData;
  detectedTransits?: Array<{ start: number; end: number }>;
  title?: string;
}

export default function LightCurvePlot({ data, detectedTransits = [], title = 'Light Curve' }: LightCurvePlotProps) {
  const traces: any[] = [
    {
      x: data.time,
      y: data.flux,
      type: 'scatter',
      mode: 'lines',
      name: 'Flux',
      line: { color: '#60a5fa', width: 1.5 },
    },
  ];

  if (detectedTransits.length > 0) {
    detectedTransits.forEach((transit, idx) => {
      const transitPoints = data.time
        .map((t, i) => (t >= transit.start && t <= transit.end ? { x: t, y: data.flux[i] } : null))
        .filter(Boolean) as Array<{ x: number; y: number }>;

      if (transitPoints.length > 0) {
        traces.push({
          x: transitPoints.map(p => p.x),
          y: transitPoints.map(p => p.y),
          type: 'scatter',
          mode: 'markers',
          name: `Transit ${idx + 1}`,
          marker: { color: '#ef4444', size: 6 },
        });
      }
    });
  }

  return (
    <div className="w-full">
      <Plot
        data={traces}
        layout={{
          title: {
            text: title,
            font: { color: '#e5e7eb', size: 18 },
          },
          xaxis: {
            title: 'Time',
            color: '#9ca3af',
            gridcolor: '#374151',
          },
          yaxis: {
            title: 'Normalized Flux',
            color: '#9ca3af',
            gridcolor: '#374151',
          },
          paper_bgcolor: 'rgba(15, 23, 42, 0.6)',
          plot_bgcolor: 'rgba(15, 23, 42, 0.8)',
          font: { color: '#e5e7eb' },
          showlegend: true,
          legend: {
            x: 1,
            y: 1,
            bgcolor: 'rgba(15, 23, 42, 0.8)',
            bordercolor: '#374151',
            borderwidth: 1,
          },
          margin: { t: 50, r: 50, b: 50, l: 60 },
          hovermode: 'closest',
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          displaylogo: false,
        }}
        style={{ width: '100%', height: '500px' }}
        useResizeHandler={true}
      />
    </div>
  );
}
