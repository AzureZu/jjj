import { useState } from 'react';
import { HIEROGLYPH_DATA } from '../api';

export default function ReferenceTab() {
  const [query, setQuery] = useState('');

  const filtered = query
    ? HIEROGLYPH_DATA.filter(h =>
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.meaning.toLowerCase().includes(query.toLowerCase()) ||
        h.phonetic.toLowerCase().includes(query.toLowerCase()) ||
        h.gardiner.toLowerCase().includes(query.toLowerCase())
      )
    : HIEROGLYPH_DATA;

  return (
    <div>
      <div className="panel-section" style={{ paddingBottom: 8 }}>
        <div className="field-label">🔍 Search Hieroglyphs</div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by meaning, phonetic value, or Gardiner number…"
        />
      </div>
      <div className="ref-grid">
        {filtered.map((h, i) => (
          <div
            key={i}
            className="hcard"
            title={`Click to copy ${h.symbol}`}
            onClick={() => navigator.clipboard.writeText(h.symbol)}
          >
            <div className="hcard-sym">{h.symbol}</div>
            <div className="hcard-id">{h.gardiner}</div>
            <div className="hcard-mean">{h.meaning}</div>
            <div className="hcard-phon">/{h.phonetic}/</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 14 }}>
            No hieroglyphs found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
