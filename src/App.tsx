import { useState, useEffect } from 'react';
import SpaceBackground from './components/SpaceBackground';
import Navbar from './components/Navbar';
import HomeSection from './components/sections/HomeSection';
import UploadSection from './components/sections/UploadSection';
import DetectSection from './components/sections/DetectSection';
import TrainSection from './components/sections/TrainSection';
import ResultsSection from './components/sections/ResultsSection';
import AboutSection from './components/sections/AboutSection';
import { LightCurveData, supabase } from './lib/supabase';
import { generateSampleData } from './lib/api';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [lightCurveData, setLightCurveData] = useState<LightCurveData | null>(null);
  const [datasetName, setDatasetName] = useState('');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
    }
  }, []);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    window.location.hash = section;
  };

  const handleLoadSample = async () => {
    const sampleData = generateSampleData();
    setLightCurveData(sampleData);
    setDatasetName('Kepler Sample Data (Simulated)');

    try {
      const { data, error } = await supabase
        .from('datasets')
        .insert({
          name: 'Kepler Sample Data',
          source: 'kepler',
          row_count: sampleData.time.length,
          time_range_start: sampleData.time[0],
          time_range_end: sampleData.time[sampleData.time.length - 1],
          flux_mean: sampleData.flux.reduce((a, b) => a + b, 0) / sampleData.flux.length,
          metadata: { simulated: true },
        })
        .select()
        .single();

      if (!error && data) {
        console.log('Sample dataset saved to database:', data.id);
      }
    } catch (err) {
      console.error('Failed to save sample dataset:', err);
    }

    handleNavigate('detect');
  };

  const handleDataUploaded = async (data: LightCurveData, name: string) => {
    setLightCurveData(data);
    setDatasetName(name);

    try {
      const { data: dataset, error } = await supabase
        .from('datasets')
        .insert({
          name: name,
          source: 'user_upload',
          row_count: data.time.length,
          time_range_start: data.time[0],
          time_range_end: data.time[data.time.length - 1],
          flux_mean: data.flux.reduce((a, b) => a + b, 0) / data.flux.length,
          flux_std: Math.sqrt(
            data.flux.reduce(
              (sum, val) =>
                sum +
                Math.pow(val - data.flux.reduce((a, b) => a + b, 0) / data.flux.length, 2),
              0
            ) / data.flux.length
          ),
        })
        .select()
        .single();

      if (!error && dataset) {
        console.log('Dataset saved to database:', dataset.id);
      }
    } catch (err) {
      console.error('Failed to save dataset:', err);
    }

    handleNavigate('detect');
  };

  return (
    <div className="min-h-screen custom-cursor">
      <SpaceBackground />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main>
        <HomeSection onNavigate={handleNavigate} onLoadSample={handleLoadSample} />
        <UploadSection onDataUploaded={handleDataUploaded} />
        <DetectSection lightCurveData={lightCurveData} datasetName={datasetName} />
        <TrainSection />
        <ResultsSection />
        <AboutSection />
      </main>
    </div>
  );
}

export default App;
