import { useState, useCallback } from 'react';
import './App.css';
import TranslateTab from './components/TranslateTab';
import TranscribeTab from './components/TranscribeTab';
import ImageTab from './components/ImageTab';
import ReferenceTab from './components/ReferenceTab';
import ModelsTab from './components/ModelsTab';
import ApiKeyModal from './components/ApiKeyModal';

const TABS = [
  { id: 'translate',  icon: '𓊪', label: 'Translate' },
  { id: 'transcribe', icon: '𓏤', label: 'Transcribe' },
  { id: 'image',      icon: '𓃗', label: 'Image' },
  { id: 'reference',  icon: '𓂋', label: 'Reference' },
  { id: 'models',     icon: '🧠', label: 'Models' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('translate');
  const [activeModel, setActiveModel] = useState('cnn');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('glyph_api_key') || '');
  const [showApiModal, setShowApiModal] = useState(!localStorage.getItem('glyph_api_key'));
  const [history, setHistory] = useState([]);

  const addToHistory = useCallback((input, translation) => {
    setHistory(prev => {
      const next = [{ input, translation, time: new Date().toLocaleTimeString() }, ...prev];
      return next.slice(0, 6);
    });
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('glyph_api_key', key);
    setShowApiModal(false);
  };

  return (
    <div className="app">
      {/* Background effects */}
      <div className="bg-glow" />
      <div className="bg-grid" />

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-wrap">
            <div className="logo-icon">𓂀</div>
            <div>
              <h1 className="site-title">Glyph AI</h1>
              <p className="site-tagline">Ancient Egyptian Intelligence</p>
            </div>
          </div>
          <div className="header-actions">
            <span className="badge badge-teal"><span className="live-dot" />AI Active</span>
            <button className="key-btn" onClick={() => setShowApiModal(true)} title="API Key">
              🔑
            </button>
          </div>
        </div>
        <div className="header-divider">
          <span className="divider-glyphs">𓋹 𓂋 𓅓 𓆑</span>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <div className={`tab-content ${activeTab === 'translate'  ? 'active' : ''}`}>
          <TranslateTab  apiKey={apiKey} activeModel={activeModel} history={history} addToHistory={addToHistory} />
        </div>
        <div className={`tab-content ${activeTab === 'transcribe' ? 'active' : ''}`}>
          <TranscribeTab apiKey={apiKey} />
        </div>
        <div className={`tab-content ${activeTab === 'image'      ? 'active' : ''}`}>
          <ImageTab      apiKey={apiKey} activeModel={activeModel} onChangeModel={() => setActiveTab('models')} />
        </div>
        <div className={`tab-content ${activeTab === 'reference'  ? 'active' : ''}`}>
          <ReferenceTab />
        </div>
        <div className={`tab-content ${activeTab === 'models'     ? 'active' : ''}`}>
          <ModelsTab activeModel={activeModel} onSelect={setActiveModel} />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-item ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* API Key Modal */}
      {showApiModal && (
        <ApiKeyModal currentKey={apiKey} onSave={saveApiKey} onClose={() => setShowApiModal(false)} />
      )}
    </div>
  );
}
