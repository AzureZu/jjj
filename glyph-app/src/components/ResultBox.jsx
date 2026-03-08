import { useState } from 'react';

export function LoadingSpinner({ label = 'Consulting the Ancient Texts' }) {
  return (
    <div className="loading-wrap">
      <div className="scarab">𓆣</div>
      <div className="loading-label">{label}…</div>
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return <div className="error-box">{message}</div>;
}

export function AccuracyMeter({ confidence }) {
  const pct = Math.min(100, Math.max(0, parseInt(confidence) || 0));
  const desc = pct >= 90 ? 'Excellent — high-confidence translation based on well-attested signs'
    : pct >= 75 ? 'Good — most signs clearly identified with minor ambiguities noted'
    : pct >= 60 ? 'Moderate — some signs are damaged, rare, or context-dependent'
    : 'Low — inscription is fragmentary or contains unusual sign variants';
  const fill = pct >= 85
    ? 'linear-gradient(90deg,#00A882,#00D4A8,#7FFFD4)'
    : pct >= 65
    ? 'linear-gradient(90deg,#E07B00,#FFB800,#FFD555)'
    : 'linear-gradient(90deg,#C0392B,#FF5A36,#FF8A70)';
  return (
    <div className="accuracy-wrap">
      <div className="accuracy-header">
        <span className="accuracy-label">📊 Confidence</span>
        <span className="accuracy-value">{pct}%</span>
      </div>
      <div className="accuracy-track">
        <div className="accuracy-fill" style={{ width: `${pct}%`, background: fill }} />
      </div>
      <div className="accuracy-desc">{desc}</div>
    </div>
  );
}

export function SourcesPanel({ id, sources }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sources-panel">
      <div className="sources-header" onClick={() => setOpen(o => !o)}>
        <span className="sources-title">📚 Reference Sources</span>
        <span className={`sources-arrow ${open ? 'open' : ''}`}>▼</span>
      </div>
      {open && (
        <div className="sources-body">
          {sources.map((s, i) => (
            <div key={i} className="source-item">
              <span>{s.icon}</span>
              <div>
                <div className="source-name">{s.name}</div>
                <div className="source-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultBox({ label, result, onCopy }) {
  if (!result) return null;
  const { translation, transliteration, signBreakdown, alternativeReadings, context, notes, confidence } = result;
  const translitParts = [];
  if (transliteration) translitParts.push('Transliteration: ' + transliteration);
  if (signBreakdown) translitParts.push('\nSign breakdown: ' + signBreakdown);
  if (alternativeReadings && alternativeReadings.length > 3) translitParts.push('\nAlternatives: ' + alternativeReadings);
  const ctxText = [context, notes && notes.length > 3 ? 'Notes: ' + notes : ''].filter(Boolean).join('\n\n');

  return (
    <div className="result-box">
      <div className="result-header">
        <span className="result-label">{label || 'Result'}</span>
        <button className="copy-btn" onClick={() => onCopy(translation)}>Copy</button>
      </div>
      <div className="result-body">
        <div className="result-translation">{translation}</div>
        {translitParts.length > 0 && (
          <div className="result-translit">{translitParts.join('')}</div>
        )}
        {ctxText && <div className="result-context">{ctxText}</div>}
        <AccuracyMeter confidence={confidence} />
        <SourcesPanel sources={TRANSLATE_SOURCES} />
      </div>
    </div>
  );
}

export function useCopy() {
  const [copied, setCopied] = useState('');
  const copy = (text, id = 'default') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    });
  };
  return { copy, copied };
}

const TRANSLATE_SOURCES = [
  { icon: '📖', name: "Gardiner's Egyptian Grammar (1957)", desc: "Sir Alan Gardiner's foundational reference for Middle Egyptian — the standard sign list used worldwide." },
  { icon: '𓂀', name: "Faulkner's Dictionary of Middle Egyptian", desc: "Raymond O. Faulkner's comprehensive lexicon of Middle Egyptian vocabulary." },
  { icon: '🏛️', name: "Thesaurus Linguae Aegyptiae (TLA)", desc: "Berlin-Brandenburg Academy digital corpus of ancient Egyptian texts — over 1.5 million word tokens." },
  { icon: '📜', name: "Pyramid Texts & Book of the Dead", desc: "Primary source inscriptions from Old Kingdom pyramid chambers and New Kingdom funerary papyri." },
  { icon: '🔬', name: "Manuel de Codage (MdC) Standard", desc: "International encoding standard for transliterating hieroglyphic text into ASCII." },
];
