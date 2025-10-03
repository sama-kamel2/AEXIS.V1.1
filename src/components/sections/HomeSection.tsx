import { Rocket, Sparkles, Brain, Users } from 'lucide-react';
import Button from '../Button';
import Card from '../Card';

interface HomeSectionProps {
  onNavigate: (section: string) => void;
  onLoadSample: () => void;
}

export default function HomeSection({ onNavigate, onLoadSample }: HomeSectionProps) {
  const quotes = [
    "Somewhere, something incredible is waiting to be known.",
    "The cosmos is within us. We are made of star-stuff.",
    "For small creatures such as we, the vastness is bearable only through love.",
    "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood were made in the interiors of collapsing stars.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto text-center space-y-12 zoom-stars">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold glow-text">
            Discover Distant Worlds with AI
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
            Hunt for exoplanets in stellar light curves using cutting-edge machine learning
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Sparkles className="w-5 h-5" />
            <p className="text-sm italic">"{randomQuote}"</p>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            onClick={onLoadSample}
            className="cosmic-glow"
          >
            <Rocket className="w-5 h-5 mr-2 inline" />
            Try Sample Data
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate('upload')}
          >
            <Sparkles className="w-5 h-5 mr-2 inline" />
            Upload Your Data
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-16">
          <Card hover>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">For Novices</h3>
              </div>
              <p className="text-gray-400">
                Explore exoplanet detection with guided tutorials, interactive visualizations,
                and easy-to-understand explanations of the transit method.
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">For Researchers</h3>
              </div>
              <p className="text-gray-400">
                Advanced tools for model training, hyperparameter tuning, batch processing,
                and detailed performance metrics for serious exoplanet research.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-16 space-y-6">
          <h2 className="text-3xl font-bold">What is a Light Curve?</h2>
          <Card className="max-w-3xl mx-auto text-left">
            <div className="space-y-4">
              <p className="text-gray-300">
                A light curve is a graph showing how a star's brightness changes over time.
                When an exoplanet passes in front of its host star (a transit), it blocks
                a tiny amount of light, causing a periodic dip in brightness.
              </p>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-center h-32">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    <line x1="20" y1="50" x2="380" y2="50" stroke="#60a5fa" strokeWidth="2" />
                    <line x1="120" y1="50" x2="120" y2="80" stroke="#ef4444" strokeWidth="2" />
                    <line x1="120" y1="80" x2="160" y2="80" stroke="#ef4444" strokeWidth="2" />
                    <line x1="160" y1="80" x2="160" y2="50" stroke="#ef4444" strokeWidth="2" />
                    <text x="200" y="30" fill="#9ca3af" fontSize="12">Transit Dip</text>
                    <path d="M 180 25 L 140 45" stroke="#9ca3af" strokeWidth="1" fill="none" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 text-center mt-2">
                  Simplified light curve showing a transit event
                </p>
              </div>
              <p className="text-gray-300">
                Our AI analyzes these patterns to detect potential exoplanets, measuring the
                depth, duration, and periodicity of transit events with high precision.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Kepler Discoveries" value="2,778" />
          <StatCard label="TESS Discoveries" value="7,000+" />
          <StatCard label="Total Exoplanets" value="5,500+" />
          <StatCard label="Detection Accuracy" value="94.2%" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="text-center">
      <div className="text-3xl font-bold text-blue-400 mb-2">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </Card>
  );
}
