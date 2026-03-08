import { useState, useRef } from 'react';
import { callClaude, safeParseJSON, SYS_HIEROGLYPH_TO_ENGLISH, SYS_ENGLISH_TO_HIEROGLYPH, SYS_TRANSLITERATE, MODEL_PERSONAS, MODEL_LABELS, MODEL_COLORS, MODEL_ICONS } from '../api';
import { LoadingSpinner, ErrorBox, ResultBox, useCopy } from './ResultBox';

const MODES = [
  { id: 'hieroglyph-to-english', label: '𓊪 Glyphs → English' },
  { id: 'english-to-hieroglyph', label: '🔡 English → Glyphs' },
  { id: 'transliterate',         label: '𓏤 Transliterate' },
];

const ALL_MODELS = ['vit','cnn','mobilevit','rnn','mobilenet'];

export default function TranslateTab({ apiKey, activeModel, history, addToHistory }) {
  const [mode, setMode] = useState('hieroglyph-to-english');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [raceOpen, setRaceOpen] = useState(false);
  const [raceRows, setRaceRows] = useState({});
  const [raceWinner, setRaceWinner] = useState(null);
  const [raceRunning, setRaceRunning] = useState(false);
  const { copy } = useCopy();
  const inputRef = useRef();

  const getSysAndMsg = (m) => {
    const configs = {
      'hieroglyph-to-english': { sys: SYS_HIEROGLYPH_TO_ENGLISH, msg: `Translate the following hieroglyphs to English:\n\n${input}` },
      'english-to-hieroglyph': { sys: SYS_ENGLISH_TO_HIEROGLYPH, msg: `Convert the following English text to ancient Egyptian hieroglyphs:\n\n${input}` },
      'transliterate':         { sys: SYS_TRANSLITERATE, msg: `Produce a complete Egyptological transliteration of the following hieroglyphs:\n\n${input}` },
    };
    return configs[m];
  };

  const doTranslate = async () => {
    if (!input.trim()) return;
    if (!apiKey) { setError('Please set your API key first (tap 🔑 in the header).'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const { sys, msg } = getSysAndMsg(mode);
      const sysWithModel = sys + `\n\n[Recognition Engine: ${MODEL_PERSONAS[activeModel]}]`;
      const raw = await callClaude([{ role: 'user', content: msg }], sysWithModel, apiKey);
      const r = safeParseJSON(raw);
      setResult(r);
      addToHistory(input, r.translation || '');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const doRunAll = async () => {
    if (!input.trim()) return;
    if (!apiKey) { setError('Please set your API key first.'); return; }
    setRaceRunning(true); setRaceOpen(true); setRaceWinner(null);
    setError(''); setResult(null);
    const init = {};
    ALL_MODELS.forEach(m => { init[m] = { status: 'running', conf: 0, text: '', error: '' }; });
    setRaceRows({ ...init });

    let bestModel = null, bestConf = -1;
    const results = {};
    const { sys, msg } = getSysAndMsg(mode);

    const promises = ALL_MODELS.map(async m => {
      const sysM = sys + `\n\n[Recognition Engine: ${MODEL_PERSONAS[m]}]`;
      try {
        const raw = await callClaude([{ role: 'user', content: msg }], sysM, apiKey);
        const r = safeParseJSON(raw);
        const conf = Math.min(100, Math.max(0, parseInt(r.confidence) || 0));
        results[m] = { result: r, conf };
        setRaceRows(prev => ({
          ...prev,
          [m]: { status: 'done', conf, text: (r.translation || '').substring(0, 90), error: '' }
        }));
        if (conf > bestConf) { bestConf = conf; bestModel = m; }
      } catch (err) {
        setRaceRows(prev => ({
          ...prev,
          [m]: { status: 'error', conf: 0, text: '', error: err.message.substring(0, 80) }
        }));
      }
    });

    await Promise.allSettled(promises);

    if (bestModel && results[bestModel]) {
      setRaceWinner({ model: bestModel, conf: bestConf });
      setResult(results[bestModel].result);
      addToHistory(input, results[bestModel].result.translation || '');
    }
    setRaceRunning(false);
  };

  return (
    <div>
      <div className="panel-section">
        <div className="mode-selector">
          {MODES.map(m => (
            <button key={m.id} className={`mode-btn ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="field-label">✍️ Input Text</div>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter hieroglyphs (𓀀 𓁀 𓂀 …) or English text…&#10;Example: 𓅓𓂝𓏤 𓇋𓄿𓂝𓂻𓏤"
          onKeyDown={e => e.key === 'Enter' && e.ctrlKey && doTranslate()}
        />
        <div className="btn-row">
          <button className="action-btn" onClick={doTranslate} disabled={loading || raceRunning}>
            ⚡ Translate
          </button>
          <button className="action-btn action-btn-secondary" onClick={doRunAll} disabled={loading || raceRunning}>
            🏆 All Models
          </button>
        </div>
      </div>

      {/* Model Race Panel */}
      {raceOpen && (
        <div className="race-panel">
          <div className="race-header">
            <span className="race-title">🏆 Model Race</span>
            {raceWinner && (
              <span className="race-winner">
                Winner: {MODEL_LABELS[raceWinner.model]} ({raceWinner.conf}%)
              </span>
            )}
          </div>
          <div className="race-rows">
            {ALL_MODELS.map(m => {
              const row = raceRows[m] || {};
              const color = MODEL_COLORS[m];
              return (
                <div key={m} className="race-row" style={raceWinner?.model === m ? { border: `1.5px solid ${color}`, background: `rgba(${hexToRgb(color)},0.07)` } : {}}>
                  <div className="race-row-header">
                    <span style={{ fontSize: 16 }}>{MODEL_ICONS[m]}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{MODEL_LABELS[m]}</span>
                    <span className="race-status">
                      {row.status === 'running' ? '⏳ Running…' : row.status === 'done' ? '✅ Done' : row.status === 'error' ? '❌ Error' : ''}
                    </span>
                  </div>
                  {row.status === 'done' && (
                    <>
                      <div className="race-row-text">{row.text}{row.text?.length >= 90 ? '…' : ''}</div>
                      <div className="race-bar-wrap">
                        <div className="race-bar-track">
                          <div className="race-bar-fill" style={{ width: `${row.conf}%`, background: color, boxShadow: `0 0 5px ${color}88` }} />
                        </div>
                        <span className="race-conf" style={{ color }}>{row.conf}%</span>
                      </div>
                    </>
                  )}
                  {row.status === 'error' && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{row.error}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="panel-section" style={{ paddingTop: 0 }}>
        {loading && <LoadingSpinner />}
        <ErrorBox message={error} />
        {result && !loading && (
          <ResultBox
            label="Translation"
            result={result}
            onCopy={text => copy(text)}
          />
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="history-section">
          <div className="section-title">𓏲 Recent Translations</div>
          {history.map((h, i) => (
            <div key={i} className="history-item" onClick={() => setInput(h.input)}>
              <div className="history-glyph">{h.input.substring(0, 4)}</div>
              <div>
                <div className="history-trans">{h.translation.substring(0, 65)}{h.translation.length > 65 ? '…' : ''}</div>
                <div className="history-time">{h.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
