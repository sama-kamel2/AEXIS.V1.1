import { useState, useEffect } from 'react';
import { History, Search, Filter, Download } from 'lucide-react';
import Button from '../Button';
import Card from '../Card';
import { supabase, Prediction, Dataset } from '../../lib/supabase';

export default function ResultsSection() {
  const [results, setResults] = useState<Array<Prediction & { dataset?: Dataset }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'transit' | 'no_transit'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [filterStatus]);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('predictions')
        .select(`
          *,
          dataset:datasets(*)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filterStatus !== 'all') {
        query = query.eq('has_transit', filterStatus === 'transit');
      }

      const { data, error } = await query;

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = results.filter(result =>
    result.dataset?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="results" className="min-h-screen px-4 pt-24 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold glow-text">Detection History</h2>
          <p className="text-gray-400 text-lg">
            Browse and manage your past exoplanet detection results
          </p>
        </div>

        <Card>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by dataset name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-gray-200"
              />
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterStatus === 'all' ? 'primary' : 'ghost'}
                onClick={() => setFilterStatus('all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'transit' ? 'primary' : 'ghost'}
                onClick={() => setFilterStatus('transit')}
              >
                Transit
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'no_transit' ? 'primary' : 'ghost'}
                onClick={() => setFilterStatus('no_transit')}
              >
                No Transit
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Loading results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400 mb-2">No results found</p>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Run a detection to see results here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          )}
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export All Results
          </Button>
          <Button variant="ghost">
            Clear History
          </Button>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ result }: { result: Prediction & { dataset?: Dataset } }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card hover className="border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-semibold">{result.dataset?.name || 'Unknown Dataset'}</h4>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                result.has_transit
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {result.has_transit ? 'Transit Detected' : 'No Transit'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>Confidence: {(result.probability_score * 100).toFixed(1)}%</span>
            <span>Model: {result.model_version}</span>
            <span>Transits: {Array.isArray(result.detected_transits) ? result.detected_transits.length : 0}</span>
            <span>{formatDate(result.created_at)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            View Details
          </Button>
          <Button size="sm" variant="ghost">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
