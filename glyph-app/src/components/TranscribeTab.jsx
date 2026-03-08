import { useState } from 'react';
import { callClaude, safeParseJSON } from '../api';
import { LoadingSpinner, ErrorBox, AccuracyMeter, SourcesPanel } from './ResultBox';

const FORMATS = [
  { id: 'mdc',      label: 'Manuel de Codage' },
  { id: 'unicode',  label: 'Unicode Names' },
  { id: 'gardiner', label: 'Gardiner List' },
  { id: 'phonetic', label: 'Phonetic' },
];

const FORMAT_DESC = {
  mdc:      'Manuel de Codage (MdC) ASCII encoding — the international standard. Example: nfr = "nefer".',
  unicode:  'Unicode character names — give the official Unicode name for each character plus its code point.',
  gardiner: 'Gardiner Sign List notation — give the catalogue number (letter + number) for every sign in sequence.',
  phonetic: 'Phonetic Egyptological transliteration using standard diacritics — represent every consonant sound.'
};

const SOURCES = [
  { icon: '📖', name: 'Gardiner Sign List (Extended)', desc: 'The official catalog of 750+ hieroglyphic signs, organized by category (A–Aa).' },
  { icon: '💾', name: 'Unicode Egyptian Hieroglyphs Block (U+13000–U+1342F)', desc: 'The official Unicode standard encoding 1,071 hieroglyphic characters.' },
  { icon: '🔤', name: 'Manuel de Codage (MdC) Encoding', desc: 'Standardized ASCII-based encoding for hieroglyphs used in academic Egyptology software.' },
  { icon: '🏫', name: 'JSesh & Hieroglyphica Databases', desc: 'Open-source Egyptological software databases containing sign-by-sign mappings.' },
];

export default function TranscribeTab({ apiKey }) {
  const [fmt, setFmt] = useState('mdc');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const doTranscribe = async () => {
    if (!input.trim()) return;
    if (!apiKey) { setError('Please set your API key first.'); return; }
    setLoading(true); setError(''); setResult(null);
    const sys = `You are Dr. Khaled Hassan, a senior Egyptologist. Produce a meticulous hieroglyphic transcription in the requested format. Follow sign-by-sign discipline. Never guess or omit signs. If a sign is ambiguous, give the most likely identification and flag it. Output ONLY valid JSON: {"transcription":"...","signList":"detailed sign-by-sign breakdown","confidence":93,"notes":"..."}`;
    const msg = `Transcribe the following hieroglyphs into ${FORMAT_DESC[fmt]} List every single sign individually with its value and role:\n\n${input}`;
    try {
      const raw = await callClaude([{ role: 'user', content: msg }], sys, apiKey);
      const r = safeParseJSON(raw);
      setResult(r);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <div className="panel-section">
        <div className="field-label">𓏤 Hieroglyphic Inscription</div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={"Paste hieroglyphs or describe inscription…\nExample: 𓂀𓆑𓋴𓏏𓊃𓆑𓊃𓄿𓄫𓀀"}
          style={{ fontSize: 20 }}
          onKeyDown={e => e.key === 'Enter' && e.ctrlKey && doTranscribe()}
        />
        <div className="field-label" style={{ marginTop: 14, marginBottom: 8 }}>Transcription Format</div>
        <div className="mode-selector">
          {FORMATS.map(f => (
            <button key={f.id} className={`mode-btn ${fmt === f.id ? 'active' : ''}`} onClick={() => setFmt(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <button className="action-btn" onClick={doTranscribe} disabled={loading}>
          𓏤 Transcribe Inscription
        </button>
      </div>

      <div className="panel-section" style={{ paddingTop: 0 }}>
        {loading && <LoadingSpinner label="Reading the Sacred Script" />}
        <ErrorBox message={error} />
        {result && !loading && (
          <div className="result-box">
            <div className="result-header">
              <span className="result-label">Transcription</span>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.transcription || '')}>Copy</button>
            </div>
            <div className="result-body">
              <div className="result-translation">{result.transcription}</div>
              {result.signList && (
                <div className="result-translit" style={{ whiteSpace: 'pre-line' }}>
                  {result.signList}
                  {result.notes && result.notes.length > 3 ? '\n\nNotes: ' + result.notes : ''}
                </div>
              )}
              <AccuracyMeter confidence={result.confidence} />
              <SourcesPanel sources={SOURCES} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
