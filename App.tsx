
import React, { useState } from 'react';
import HoroscopeForm from './components/HoroscopeForm';
import HoroscopeResult from './components/HoroscopeResult';
import { FormInputs, HoroscopeData, Language } from './types';
import { computeHoroscope } from './services/astroEngine';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HoroscopeData | null>(null);
  const [language, setLanguage] = useState<Language>(Language.TAMIL);

  const handleCalculate = async (inputs: FormInputs) => {
    setLoading(true);
    setLanguage(inputs.language);
    try {
      const data = await computeHoroscope(inputs);
      setResult(data);
    } catch (error) {
      console.error("Calculation failed", error);
      alert("Error calculating horoscope. Please ensure your inputs are correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 selection:bg-red-100 selection:text-red-900">
      {!result ? (
        <HoroscopeForm onSubmit={handleCalculate} isLoading={loading} />
      ) : (
        <HoroscopeResult data={result} language={language} onBack={handleBack} />
      )}
      
      {!result && (
        <div className="mt-16 text-center space-y-4 no-print">
          <div className="text-3xl opacity-60 text-amber-600">🔱</div>
          <p className="text-amber-800/60 text-sm font-medium italic">"வெற்றிவேல் வீரவேல் - வேலும் மயிலும் துணை"</p>
          <p className="text-amber-900/40 text-xs">© 2024 CosmicWisdom Astrology. Professional Thirukanitha Engine.</p>
        </div>
      )}
    </div>
  );
};

export default App;