import { useState, useRef } from 'react';
import { callClaude, safeParseJSON, SYS_IMAGE, MODEL_LABELS, MODEL_PERSONAS } from '../api';
import { LoadingSpinner, ErrorBox, AccuracyMeter, SourcesPanel } from './ResultBox';

const SOURCES = [
  { icon: '🔭', name: 'Visual Sign Recognition (Gardiner Typology)', desc: 'Pattern matching against the 750+ Gardiner sign categories.' },
  { icon: '𓉐', name: 'Temple & Monument Corpus', desc: 'Epigraphic survey records from Karnak, Luxor, Abu Simbel, and Valley of the Kings.' },
  { icon: '📜', name: 'Papyrus Digitization Projects', desc: 'British Museum, Louvre, and Metropolitan Museum digital archives of papyri.' },
  { icon: '🏺', name: 'IFAO Epigraphic Database (Cairo)', desc: "Institut Français d'Archéologie Orientale's comprehensive records of Egyptian inscriptions." },
];

export default function ImageTab({ apiKey, activeModel, onChangeModel }) {
  const [imageBase64, setImageBase64] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      setImageBase64(e.target.result.split(',')[1]);
      setImageType(file.type);
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageBase64(null); setImageType(null); setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const doAnalyze = async () => {
    if (!imageBase64) { setError('Please upload an image first.'); return; }
    if (!apiKey) { setError('Please set your API key first.'); return; }
    setLoading(true); setError(''); setResult(null);
    const sys = SYS_IMAGE + ` The active recognition model is ${MODEL_LABELS[activeModel]}. ${MODEL_PERSONAS[activeModel]}`;
    const content = [
      { type: 'image', source: { type: 'base64', media_type: imageType, data: imageBase64 } },
      { type: 'text', text: `Perform a full visual analysis and translation of every hieroglyph visible in this image.${context ? ' Additional context: ' + context : ''}` }
    ];
    try {
      const raw = await callClaude([{ role: 'user', content }], sys, apiKey);
      const r = safeParseJSON(raw);
      setResult(r);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <div className="panel-section">
        <div className="field-label">🖼️ Upload Hieroglyph Image</div>
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          <span className="upload-icon">𓉐</span>
          <div className="upload-text">Tap or drop image</div>
          <div className="upload-hint">JPG · PNG · WEBP — Temple walls, papyrus, artifacts</div>
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button className="remove-img" onClick={removeImage}>×</button>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <div className="field-label">📍 Context (Optional)</div>
          <textarea
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="E.g.: 'Valley of the Kings', 'New Kingdom', 'Temple of Karnak'…"
            style={{ minHeight: 70 }}
          />
        </div>

        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(0,212,168,0.06)', border: '1px solid rgba(0,212,168,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Model:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>🧠 {MODEL_LABELS[activeModel]}</span>
          <button onClick={onChangeModel} style={{ background: 'rgba(0,212,168,0.15)', border: '1px solid rgba(0,212,168,0.3)', color: 'var(--teal)', padding: '3px 10px', borderRadius: '100px', fontSize: 11, fontWeight: 600 }}>
            Change
          </button>
        </div>

        <button className="action-btn" onClick={doAnalyze} disabled={loading || !imageBase64} style={{ marginTop: 12 }}>
          𓂀 Analyze Hieroglyphs
        </button>
      </div>

      <div className="panel-section" style={{ paddingTop: 0 }}>
        {loading && <LoadingSpinner label="Examining the Sacred Image" />}
        <ErrorBox message={error} />
        {result && !loading && (
          <div className="result-box">
            <div className="result-header">
              <span className="result-label">Image Analysis</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🧠 {MODEL_LABELS[activeModel]}</span>
            </div>
            <div className="result-body">
              <div className="result-translation">{result.translation}</div>
              {(result.identifiedGlyphs || result.transliteration || result.signBreakdown) && (
                <div className="result-translit" style={{ whiteSpace: 'pre-line' }}>
                  {result.identifiedGlyphs ? 'Identified glyphs: ' + result.identifiedGlyphs + '\n\n' : ''}
                  {result.transliteration ? 'Transliteration: ' + result.transliteration : ''}
                  {result.signBreakdown ? '\n\nSign breakdown: ' + result.signBreakdown : ''}
                </div>
              )}
              {(result.context || result.notes) && (
                <div className="result-context">
                  {result.context}{result.notes && result.notes.length > 3 ? '\n\nNotes: ' + result.notes : ''}
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
