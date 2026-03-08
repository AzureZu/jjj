import { MODEL_LABELS, MODEL_COLORS, MODEL_ICONS } from '../api';

const MODELS = [
  {
    id: 'vit',
    fullname: 'Vision Transformer Large',
    variant: 'ViT-L/14 · CLIP-pretrained · Max Precision',
    accuracy: 97.1, latency: '112ms', params: '307M', hw: 'GPU+',
    precision: 96.9, recall: 96.5, f1: 96.7,
    trainAcc: 97.1, valAcc: 95.8,
    desc: 'ViT-L/14 pretrained on 400M image-text pairs via CLIP and fine-tuned on HieroGlyph-202K. Patch-based self-attention enables unmatched contextual sign understanding.',
    badge: '⚡ Highest Accuracy',
    badgeColor: '#00A882',
    headerBg: 'rgba(0,212,168,0.15)',
    iconBg: 'linear-gradient(135deg,#00A882,#00D4A8)',
    strengths: ['🏆 Highest accuracy of all models (97.1%)', '✅ Best for damaged, weathered & partial inscriptions', '✅ CLIP pretraining enables zero-shot rare sign recognition', '⚠️ Requires high-end GPU — not mobile-suitable'],
    arch: { blocks: ['Input|224×224','Patch|14×14','Attn|×24','MLP|1024-d','Head|1,071'], note: '24 transformer layers · 16 attention heads · Flash Attention 2 · FP16 inference' },
    fillColor: 'linear-gradient(90deg,#00A882,#00D4A8,#7FFFD4)',
    trainDataset: 'CLIP-400M + HieroGlyph-202K',
  },
  {
    id: 'cnn',
    fullname: 'Convolutional Neural Network',
    variant: 'ResNet-50 v2 · SE Attention · HieroGlyph-285K',
    accuracy: 96.8, latency: '38ms', params: '25M', hw: 'GPU',
    precision: 96.5, recall: 96.1, f1: 96.3,
    trainAcc: 96.8, valAcc: 95.4,
    desc: 'Upgraded ResNet-50 v2 with SE channel attention, retrained on HieroGlyph-285K. Mixed-precision FP16 + TensorRT optimization pushes accuracy from 93.2% to 96.8% with 21% faster inference.',
    badge: '🆙 Upgraded v2',
    badgeColor: '#E07B00',
    badgeTextColor: '#1A0A00',
    headerBg: 'rgba(255,184,0,0.15)',
    iconBg: 'linear-gradient(135deg,#E07B00,#FFB800)',
    strengths: ['🆙 96.8% accuracy (+3.6% over v1)', '🆙 SE attention — channel-level feature recalibration', '✅ 38ms inference — 21% faster via TensorRT', '✅ Trained on 285K images — 2× larger dataset'],
    arch: { blocks: ['Input|224×224','Conv|7×7, 64','SE-Res|×16','GAP|2048-d','FC+BN|1,071'], note: 'SE channel attention · FP16 mixed-precision · TensorRT optimized · HieroGlyph-285K' },
    fillColor: 'linear-gradient(90deg,#E07B00,#FFB800,#FFD555)',
    trainDataset: 'HieroGlyph-285K',
  },
  {
    id: 'mobilenet',
    fullname: 'Mobile Network V2',
    variant: 'MobileNetV2 v2 · SE-Lite · Curriculum Learning',
    accuracy: 94.3, latency: '14ms', params: '4.1M', hw: 'CPU',
    precision: 94.1, recall: 93.8, f1: 93.9,
    trainAcc: 94.3, valAcc: 93.1,
    desc: 'MobileNetV2 with SE-Lite attention injected into every inverted residual block. Curriculum learning boosts rare sign recall by 18%. Width multiplier α=1.4 for higher capacity while staying CPU-deployable.',
    badge: '🆙 Upgraded v2',
    badgeColor: '#C0392B',
    badgeTextColor: '#fff',
    headerBg: 'rgba(255,90,54,0.15)',
    iconBg: 'linear-gradient(135deg,#C0392B,#FF5A36)',
    strengths: ['🆙 94.3% accuracy (+5.8% over v1)', '🆙 SE-Lite attention in all 17 inverted residual blocks', '✅ Curriculum learning — rare sign recall +18%', '✅ Fastest CPU inference — 14ms, zero GPU needed'],
    arch: { blocks: ['Input|224×224','Conv|32 filters','SE-Inv|×17','Conv|1792-d','FC+BN|1,071'], note: 'SE-Lite attention · α=1.4 width · Curriculum learning · ONNX/TFLite · HieroGlyph-285K' },
    fillColor: 'linear-gradient(90deg,#C0392B,#FF5A36,#FF8A70)',
    trainDataset: 'HieroGlyph-285K',
  },
  {
    id: 'mobilevit',
    fullname: 'Mobile Vision Transformer',
    variant: 'MobileViT-S · Edge Optimized',
    accuracy: 91.4, latency: '18ms', params: '5.7M', hw: 'Mobile',
    precision: 90.8, recall: 90.3, f1: 90.5,
    trainAcc: 91.4, valAcc: 90.1,
    desc: 'Hybrid CNN-Transformer combining MobileNetV2 depthwise convolutions with lightweight self-attention. Near-CNN accuracy at a fraction of compute — designed for on-device Android/iOS archaeology apps.',
    badge: null,
    headerBg: 'rgba(167,139,250,0.15)',
    iconBg: 'linear-gradient(135deg,#7C3AED,#A78BFA)',
    strengths: ['✅ Runs on-device: Android, iOS, Raspberry Pi', '✅ Fastest inference — ideal for real-time field use', '✅ Supports INT8 quantization (2× faster on mobile)', '⚠️ Slightly lower accuracy vs. full CNN on complex scenes'],
    arch: { blocks: ['Input|256×256','DW-Conv|MV2','MViT|Block×3','ViT|Attn','Head|1,071'], note: 'Depthwise separable convs · 3 MobileViT blocks · INT8 quantization ready · CoreML / TFLite' },
    fillColor: 'linear-gradient(90deg,#7C3AED,#A78BFA)',
    trainDataset: 'HieroGlyph-142K',
  },
  {
    id: 'rnn',
    fullname: 'Recurrent Neural Network',
    variant: 'BiLSTM · Sequence Decoder',
    accuracy: 89.6, latency: '31ms', params: '8.4M', hw: 'CPU/GPU',
    precision: 80.9, recall: 80.2, f1: 80.5,
    trainAcc: 89.6, valAcc: 87.3,
    desc: 'Bidirectional LSTM treating hieroglyphic inscriptions as sequential symbol streams. Captures left-to-right and right-to-left context simultaneously — ideal for cartouche sequences where sign order is linguistically meaningful.',
    badge: null,
    headerBg: 'rgba(74,158,255,0.15)',
    iconBg: 'linear-gradient(135deg,#2563EB,#4A9EFF)',
    strengths: ['✅ Excels at sequential cartouche & sentence decoding', '✅ Lightweight — runs on CPU without degradation', '✅ Best for continuous inscription streams', '⚠️ Lower accuracy on isolated single-glyph classification'],
    arch: { blocks: ['Embed|512-d','→LSTM|256-d','LSTM←|256-d','Attn|×4','CTC|Decode'], note: '4-layer BiLSTM · Bahdanau attention · CTC loss · Dropout 0.3 · Variable-length sequences' },
    fillColor: 'linear-gradient(90deg,#2563EB,#4A9EFF)',
    trainDataset: 'TLA-Seq-80K',
  },
];

export default function ModelsTab({ activeModel, onSelect }) {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '16px 16px 8px' }}>
        <div style={{ fontFamily: "'Cinzel Decorative', cursive", fontSize: 16, fontWeight: 700, color: 'var(--gold)', marginBottom: 6 }}>Neural Architecture Suite</div>
        <div style={{ fontSize: 13, color: 'var(--text-second)', lineHeight: 1.6 }}>Select the AI model for recognition & image analysis.</div>
        <div className="active-model-display">
          <div className="active-model-badge">
            <span className="live-dot" /> Active: {MODEL_LABELS[activeModel]}
          </div>
        </div>
      </div>

      <div className="models-grid">
        {MODELS.map(m => (
          <ModelCard key={m.id} m={m} selected={activeModel === m.id} onSelect={() => onSelect(m.id)} />
        ))}
      </div>

      {/* Comparison Table */}
      <div className="comparison-wrap">
        <div className="comparison-title">📊 Model Comparison</div>
        <div className="comparison-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                {MODELS.map(m => <th key={m.id} style={{ color: MODEL_COLORS[m.id] }}>{MODEL_LABELS[m.id]}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['Accuracy',    MODELS.map(m => ({ val: m.accuracy + '%',  best: m.accuracy >= 97 }))],
                ['Precision',   MODELS.map(m => ({ val: m.precision + '%', best: m.precision >= 96 }))],
                ['Recall',      MODELS.map(m => ({ val: m.recall + '%',    best: m.recall >= 96 }))],
                ['F1 Score',    MODELS.map(m => ({ val: m.f1 + '%',        best: m.f1 >= 96 }))],
                ['Latency',     MODELS.map(m => ({ val: m.latency,         best: m.latency === '14ms' }))],
                ['Dataset',     MODELS.map(m => ({ val: m.trainDataset,    best: false }))],
              ].map(([label, vals]) => (
                <tr key={label}>
                  <td>{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className={v.best ? 'val-best' : ''}>{v.val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ModelCard({ m, selected, onSelect }) {
  const color = MODEL_COLORS[m.id];
  return (
    <div className={`model-card ${selected ? 'selected' : ''}`} onClick={onSelect} style={{ position: 'relative' }}>
      {m.badge && (
        <div style={{ position: 'absolute', top: 10, left: 14, background: `linear-gradient(135deg,${m.badgeColor},${color})`, color: m.badgeTextColor || '#001A14', fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', padding: '2px 8px', borderRadius: 100, textTransform: 'uppercase', zIndex: 2 }}>
          {m.badge}
        </div>
      )}
      <div className="model-card-header" style={{ background: m.headerBg, paddingTop: m.badge ? 32 : 14 }}>
        <div className="model-icon" style={{ background: m.iconBg }}>
          {MODEL_ICONS[m.id]}
        </div>
        <div style={{ flex: 1 }}>
          <div className="model-name">{MODEL_LABELS[m.id]}</div>
          <div className="model-fullname">{m.fullname}</div>
          <div className="model-variant">{m.variant}</div>
        </div>
        {selected && <div className="model-check">✓</div>}
      </div>

      <div className="model-metrics">
        <div className="metric-chip"><span className="metric-val" style={{ color: '#7FFFD4' }}>{m.accuracy}%</span><span className="metric-lbl">Accuracy</span></div>
        <div className="metric-chip"><span className="metric-val" style={{ color: 'var(--gold)' }}>{m.latency}</span><span className="metric-lbl">Latency</span></div>
        <div className="metric-chip"><span className="metric-val" style={{ color: 'var(--blue)' }}>{m.params}</span><span className="metric-lbl">Params</span></div>
        <div className="metric-chip"><span className="metric-val" style={{ color: '#A78BFA' }}>{m.hw}</span><span className="metric-lbl">Hardware</span></div>
      </div>

      {/* P/R/F1 */}
      <div className="prf-panel" style={{ background: `rgba(${hexToRgbInline(color)},0.04)`, borderTop: `1px solid rgba(${hexToRgbInline(color)},0.1)`, borderBottom: `1px solid rgba(${hexToRgbInline(color)},0.1)` }}>
        {[['Precision', m.precision, color], ['Recall', m.recall, color], ['F1 Score', m.f1, '#00D4A8']].map(([lbl, val, c]) => (
          <div key={lbl} className="prf-item">
            <div className="prf-val" style={{ color: c }}>{val}%</div>
            <div className="prf-lbl">{lbl}</div>
            <div className="prf-bar-track"><div className="prf-bar-fill" style={{ width: `${val}%`, background: c }} /></div>
          </div>
        ))}
      </div>

      <div className="model-desc">{m.desc}</div>

      {/* Arch */}
      <div className="arch-diagram">
        <div className="arch-title">Architecture Pipeline</div>
        <div className="arch-flow">
          {m.arch.blocks.map((b, i) => {
            const [label, sub] = b.split('|');
            return [
              i > 0 && <span key={`a${i}`} className="arch-arrow">→</span>,
              <div key={`b${i}`} className="arch-block">{label}{sub && <span>{sub}</span>}</div>
            ];
          })}
        </div>
        <div className="arch-note">{m.arch.note}</div>
      </div>

      <div className="model-strengths">
        {m.strengths.map((s, i) => (
          <div key={i} className="strength-row"><span>{s}</span></div>
        ))}
      </div>

      <div className="training-bars">
        {[['Training Accuracy', m.trainAcc], ['Validation Accuracy', m.valAcc]].map(([lbl, val]) => (
          <div key={lbl}>
            <div className="train-label"><span>{lbl}</span><span style={{ color }}>{val}%</span></div>
            <div className="train-track"><div className="train-fill" style={{ width: `${val}%`, background: m.fillColor }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function hexToRgbInline(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
