import { useState } from 'react';

export default function ApiKeyModal({ currentKey, onSave, onClose }) {
  const [key, setKey] = useState(currentKey || '');

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">𓂀 API Key</div>
        <p className="modal-sub">
          Enter your Anthropic API key to activate Glyph AI. Your key is stored locally on your device only.
        </p>
        <input
          className="modal-input"
          type="password"
          placeholder="sk-ant-..."
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && key.startsWith('sk-') && onSave(key)}
        />
        <div className="modal-actions">
          <button className="modal-save" onClick={() => onSave(key)} disabled={!key}>
            ⚡ Activate
          </button>
          {currentKey && (
            <button className="modal-skip" onClick={onClose}>Cancel</button>
          )}
        </div>
        <p className="modal-note">
          🔒 Your key never leaves your device. Get yours at console.anthropic.com
        </p>
      </div>
    </div>
  );
}
