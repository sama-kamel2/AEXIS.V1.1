import { Award, ExternalLink, Github, Book, Sparkles } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';

export default function AboutSection() {
  const carlSaganQuotes = [
    "Somewhere, something incredible is waiting to be known.",
    "The cosmos is within us. We are made of star-stuff.",
    "For small creatures such as we, the vastness is bearable only through love.",
    "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood were made in the interiors of collapsing stars.",
    "We are a way for the cosmos to know itself.",
  ];

  const randomQuote = carlSaganQuotes[Math.floor(Math.random() * carlSaganQuotes.length)];

  return (
    <section id="about" className="min-h-screen px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold glow-text">About ExoHunter AI</h2>
          <p className="text-gray-400 text-lg">
            Discover distant worlds through the power of artificial intelligence
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3">NASA Space Apps Challenge 2025</h3>
                <p className="text-gray-300 leading-relaxed">
                  ExoHunter AI was developed for the NASA Space Apps Challenge 2025, addressing
                  the challenge "A World Away: Hunting for Exoplanets with AI". This platform
                  empowers both researchers and novices to discover exoplanets using cutting-edge
                  machine learning techniques applied to stellar light curve data.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h4 className="text-xl font-semibold mb-4">Mission Statement</h4>
              <p className="text-gray-300 leading-relaxed">
                Our mission is to democratize exoplanet discovery by making advanced AI detection
                tools accessible to everyone. Whether you're a professional astronomer analyzing
                thousands of light curves or a student taking your first steps into planetary
                science, ExoHunter AI provides the tools you need to hunt for distant worlds.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Book className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold">How It Works</h3>
              </div>
              <div className="space-y-3 text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-1">1. Transit Method</h4>
                  <p className="text-sm">
                    When an exoplanet passes in front of its host star, it blocks a tiny amount
                    of starlight, creating a periodic dip in the light curve.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">2. AI Detection</h4>
                  <p className="text-sm">
                    Our 1D CNN model analyzes time-series flux data to identify transit patterns,
                    measuring period, depth, and duration with high precision.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">3. Validation</h4>
                  <p className="text-sm">
                    Results include confidence scores and detailed metrics to help researchers
                    validate potential exoplanet candidates.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ExternalLink className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold">Data Sources</h3>
              </div>
              <p className="text-gray-300">
                ExoHunter AI leverages open datasets from NASA's premier exoplanet hunting missions:
              </p>
              <div className="space-y-2">
                <DataSourceBadge name="Kepler Mission" count="2,778 discoveries" />
                <DataSourceBadge name="K2 Mission" count="500+ discoveries" />
                <DataSourceBadge name="TESS Mission" count="7,000+ discoveries" />
              </div>
              <p className="text-sm text-gray-400 mt-4">
                All training data sourced from the{' '}
                <a
                  href="https://exoplanetarchive.ipac.caltech.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  NASA Exoplanet Archive
                </a>
              </p>
            </div>
          </Card>
        </div>

        <Card className="border-2 border-blue-500/30">
          <div className="text-center space-y-4">
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto" />
            <h3 className="text-2xl font-bold">Cosmic Wisdom</h3>
            <blockquote className="text-xl italic text-gray-300 max-w-2xl mx-auto">
              "{randomQuote}"
            </blockquote>
            <p className="text-gray-500">— Carl Sagan</p>
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <FAQItem
                question="What is a light curve?"
                answer="A light curve is a graph showing how a star's brightness changes over time. It's the primary tool astronomers use to detect exoplanets via the transit method."
              />
              <FAQItem
                question="How accurate is the AI model?"
                answer="Our baseline model achieves 94.2% accuracy on labeled test data from Kepler and TESS missions. Performance may vary with different stellar types and data quality."
              />
              <FAQItem
                question="Can I use my own data?"
                answer="Yes! Upload any CSV or JSON file containing time-series light curve data with time and flux columns. The AI will analyze it for potential transits."
              />
              <FAQItem
                question="Is this suitable for research?"
                answer="ExoHunter AI provides research-grade tools including hyperparameter tuning, detailed metrics, and raw data export. However, detected candidates should be validated through additional methods."
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-gray-400">
                ExoHunter AI is released under the MIT License. Contribute on GitHub!
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
              <Button variant="ghost">
                <ExternalLink className="w-5 h-5 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center text-gray-500 text-sm space-y-2">
          <p>Built with React, TypeScript, PyTorch, FastAPI, and Supabase</p>
          <p>© 2025 ExoHunter AI Team | NASA Space Apps Challenge</p>
        </div>
      </div>
    </section>
  );
}

function DataSourceBadge({ name, count }: { name: string; count: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-2 border border-gray-800">
      <span className="font-medium">{name}</span>
      <span className="text-blue-400">{count}</span>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-l-2 border-blue-500 pl-4">
      <h4 className="font-semibold text-white mb-2">{question}</h4>
      <p className="text-gray-400 text-sm">{answer}</p>
    </div>
  );
}
