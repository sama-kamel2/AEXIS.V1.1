import { useState } from 'react';
import { Rocket, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';
import Button from '../Button';
import Card from '../Card';
import LightCurvePlot from '../LightCurvePlot';
import { LightCurveData } from '../../lib/supabase';
import { predictExoplanet, PredictionResult } from '../../lib/api';

interface DetectSectionProps {
  lightCurveData: LightCurveData | null;
  datasetName: string;
}

export default function DetectSection({ lightCurveData, datasetName }: DetectSectionProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleDetect = async () => {
    if (!lightCurveData) return;

    setIsDetecting(true);
    setPrediction(null);

    try {
      const result = await predictExoplanet(lightCurveData);
      setPrediction(result);
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };

  return (
    <section id="detect" className="min-h-screen px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold glow-text">AI Exoplanet Detection</h2>
          <p className="text-gray-400 text-lg">
            Launch the AI to analyze your light curve data for exoplanet transits
          </p>
        </div>

        {!lightCurveData ? (
          <Card>
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-xl text-gray-300 mb-2">No data loaded</p>
              <p className="text-gray-500">
                Please upload data or load a sample dataset from the Home section
              </p>
            </div>
          </Card>
        ) : (
          <>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Current Dataset</h3>
                    <p className="text-gray-400">{datasetName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Data Points</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {lightCurveData.time.length.toLocaleString()}
                    </p>
                  </div>
                </div>

                <LightCurvePlot
                  data={lightCurveData}
                  detectedTransits={
                    prediction?.detected_transits.map(t => ({
                      start: t.start,
                      end: t.end,
                    })) || []
                  }
                  title="Light Curve Visualization"
                />

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleDetect}
                    isLoading={isDetecting}
                    className="cosmic-glow"
                  >
                    <Rocket className="w-5 h-5 mr-2 inline" />
                    {isDetecting ? 'Analyzing...' : 'Launch AI Hunt'}
                  </Button>
                </div>
              </div>
            </Card>

            {isDetecting && (
              <Card>
                <div className="text-center py-8">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-4 border-8 border-green-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <p className="text-xl text-gray-300 mb-2">AI Engine Processing...</p>
                  <p className="text-gray-500">Analyzing stellar light curve patterns</p>
                </div>
              </Card>
            )}

            {prediction && !isDetecting && (
              <>
                <Card className="border-2 border-blue-500/30">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Detection Results</h3>
                      <div className="flex items-center gap-2">
                        {prediction.has_transit ? (
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        ) : (
                          <AlertCircle className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Transit Detection</p>
                        <p className={`text-3xl font-bold ${prediction.has_transit ? 'text-green-400' : 'text-gray-400'}`}>
                          {prediction.has_transit ? 'DETECTED' : 'NOT DETECTED'}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Confidence Score</p>
                        <div className="relative pt-1">
                          <div className="text-3xl font-bold text-blue-400 mb-2">
                            {(prediction.probability_score * 100).toFixed(1)}%
                          </div>
                          <div className="flex mb-2 items-center justify-between">
                            <div className="w-full">
                              <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-700">
                                <div
                                  style={{ width: `${prediction.probability_score * 100}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-green-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Processing Time</p>
                        <p className="text-3xl font-bold text-purple-400">
                          {(prediction.inference_time_ms / 1000).toFixed(2)}s
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {prediction.detected_transits.length > 0 && (
                  <Card>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingDown className="w-6 h-6 text-red-400" />
                      Detected Transit Events
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Period (days)</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Depth (%)</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prediction.detected_transits.map((transit, idx) => (
                            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                              <td className="py-3 px-4 text-gray-300">{idx + 1}</td>
                              <td className="py-3 px-4 text-gray-300">
                                {transit.period > 0 ? transit.period.toFixed(2) : 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-gray-300">
                                {(transit.depth * 100).toFixed(3)}%
                              </td>
                              <td className="py-3 px-4 text-gray-300">
                                {transit.duration.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-semibold ${getConfidenceColor(transit.confidence)}`}>
                                  {getConfidenceLabel(transit.confidence)} ({(transit.confidence * 100).toFixed(1)}%)
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                <div className="flex gap-4 justify-center">
                  <Button variant="secondary">
                    Export Results (CSV)
                  </Button>
                  <Button variant="secondary">
                    Export Plot (PNG)
                  </Button>
                  <Button variant="ghost">
                    Share Results
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
