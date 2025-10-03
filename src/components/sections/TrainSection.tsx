import { useState } from 'react';
import { FlaskConical, TrendingUp, Activity } from 'lucide-react';
import Button from '../Button';
import Card from '../Card';
import { TrainingConfig, ModelMetrics, trainModel, getModelMetrics } from '../../lib/api';
import Plot from 'react-plotly.js';

export default function TrainSection() {
  const [config, setConfig] = useState<TrainingConfig>({
    learning_rate: 0.001,
    batch_size: 32,
    epochs: 10,
    num_layers: 3,
    architecture: 'cnn_1d',
  });

  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  const handleTrain = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    const interval = setInterval(() => {
      setTrainingProgress(prev => Math.min(prev + 100 / config.epochs, 100));
    }, 500);

    try {
      const result = await trainModel([], config);
      setMetrics(result.metrics);
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      clearInterval(interval);
      setIsTraining(false);
      setTrainingProgress(100);
    }
  };

  const loadCurrentMetrics = async () => {
    const currentMetrics = await getModelMetrics();
    setMetrics(currentMetrics);
  };

  useState(() => {
    loadCurrentMetrics();
  });

  return (
    <section id="train" className="min-h-screen px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold glow-text">Model Training & Tuning</h2>
          <p className="text-gray-400 text-lg">
            Configure hyperparameters and train custom detection models
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-blue-400" />
              Hyperparameter Configuration
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Model Architecture
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={config.architecture === 'cnn_1d' ? 'primary' : 'ghost'}
                    onClick={() => setConfig({ ...config, architecture: 'cnn_1d' })}
                  >
                    1D CNN
                  </Button>
                  <Button
                    size="sm"
                    variant={config.architecture === 'lstm' ? 'primary' : 'ghost'}
                    onClick={() => setConfig({ ...config, architecture: 'lstm' })}
                  >
                    LSTM
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Learning Rate: {config.learning_rate}
                </label>
                <input
                  type="range"
                  min="0.0001"
                  max="0.01"
                  step="0.0001"
                  value={config.learning_rate}
                  onChange={(e) => setConfig({ ...config, learning_rate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.0001</span>
                  <span>0.01</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Batch Size: {config.batch_size}
                </label>
                <input
                  type="range"
                  min="16"
                  max="128"
                  step="16"
                  value={config.batch_size}
                  onChange={(e) => setConfig({ ...config, batch_size: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>16</span>
                  <span>128</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Epochs: {config.epochs}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={config.epochs}
                  onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Number of Layers: {config.num_layers}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={config.num_layers}
                  onChange={(e) => setConfig({ ...config, num_layers: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleTrain}
                isLoading={isTraining}
                className="w-full cosmic-glow"
              >
                {isTraining ? 'Training Model...' : 'Start Training'}
              </Button>

              {isTraining && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Training Progress</span>
                    <span>{trainingProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-400" />
              Current Model Performance
            </h3>

            {metrics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard label="Accuracy" value={metrics.accuracy} />
                  <MetricCard label="Precision" value={metrics.precision} />
                  <MetricCard label="Recall" value={metrics.recall} />
                  <MetricCard label="F1 Score" value={metrics.f1_score} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Confusion Matrix</h4>
                  <Plot
                    data={[
                      {
                        z: metrics.confusion_matrix,
                        x: ['Predicted No Transit', 'Predicted Transit'],
                        y: ['Actual No Transit', 'Actual Transit'],
                        type: 'heatmap',
                        colorscale: [
                          [0, '#1e293b'],
                          [0.5, '#3b82f6'],
                          [1, '#10b981'],
                        ],
                        showscale: true,
                        hovertemplate: '%{z} samples<extra></extra>',
                      },
                    ]}
                    layout={{
                      paper_bgcolor: 'rgba(15, 23, 42, 0.6)',
                      plot_bgcolor: 'rgba(15, 23, 42, 0.8)',
                      font: { color: '#e5e7eb', size: 11 },
                      xaxis: { side: 'bottom' },
                      yaxis: { autorange: 'reversed' },
                      margin: { t: 20, r: 20, b: 60, l: 100 },
                      height: 250,
                    }}
                    config={{ displayModeBar: false }}
                    style={{ width: '100%' }}
                    useResizeHandler={true}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Train a model to see performance metrics</p>
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h3 className="text-xl font-bold mb-4">Model Information</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Active Model Version</p>
              <p className="text-gray-200 font-semibold">v1.0.0 (Baseline)</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Training Samples</p>
              <p className="text-gray-200 font-semibold">1,000 labeled light curves</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Data Source</p>
              <p className="text-gray-200 font-semibold">Kepler, K2, TESS Missions</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-blue-400">{(value * 100).toFixed(1)}%</p>
    </div>
  );
}
