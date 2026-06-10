import { useState, useCallback } from 'react';

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min((n + h / 30) % 12 - 3, 9 - (n + h / 30) % 12, 1))));
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
};

type Harmony = 'complementary' | 'analogous' | 'triadic' | 'split';

const getHarmony = (h: number, s: number, l: number, harmony: Harmony): Array<{ h: number; s: number; l: number; label: string }> => {
  switch (harmony) {
    case 'complementary':
      return [
        { h, s, l, label: 'Base' },
        { h: (h + 180) % 360, s, l, label: 'Complementario' },
      ];
    case 'analogous':
      return [
        { h: (h - 30 + 360) % 360, s, l, label: 'Analógico -' },
        { h, s, l, label: 'Base' },
        { h: (h + 30) % 360, s, l, label: 'Analógico +' },
      ];
    case 'triadic':
      return [
        { h, s, l, label: 'Base' },
        { h: (h + 120) % 360, s, l, label: 'Triádico 1' },
        { h: (h + 240) % 360, s, l, label: 'Triádico 2' },
      ];
    case 'split':
      return [
        { h, s, l, label: 'Base' },
        { h: (h + 150) % 360, s, l, label: 'Split 1' },
        { h: (h + 210) % 360, s, l, label: 'Split 2' },
      ];
  }
};

const HARMONY_OPTIONS: { key: Harmony; label: string; desc: string }[] = [
  { key: 'complementary', label: 'Complementario', desc: 'Color opuesto — máximo contraste' },
  { key: 'analogous', label: 'Analógico', desc: 'Colores vecinos — armonía suave' },
  { key: 'triadic', label: 'Triádico', desc: 'Tres equidistantes — balance vibrante' },
  { key: 'split', label: 'Split-comp.', desc: 'Base + dos adyacentes al complemento' },
];

export default function ColorLabApp() {
  const [hue, setHue] = useState(220);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(55);
  const [harmony, setHarmony] = useState<Harmony>('analogous');
  const [copied, setCopied] = useState<string | null>(null);

  const palette = getHarmony(hue, saturation, lightness, harmony);

  const cssVars = palette.map((c, i) =>
    `  --color-${i + 1}: ${hslToHex(c.h, c.s, c.l)};`
  ).join('\n');

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020814', color: '#eef2ff', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/" style={{ color: '#60a5fa', fontSize: '0.85rem' }}>← Volver al portfolio</a>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#a78bfa' }}>
          CSS Color Lab
        </span>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.04em' }}>
          Teoría del Color{' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            para Devs
          </span>
        </h1>
        <p style={{ color: '#8896b3', marginBottom: '3rem', fontSize: '1rem', lineHeight: 1.7 }}>
          Generá paletas armónicas, exportá CSS custom properties y entendé cómo funciona el espacio de color HSL.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                background: 'rgba(11,22,40,0.7)',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Color base HSL
              </h3>
              {[
                { label: 'Hue', value: hue, set: setHue, max: 360, unit: '°', color: hslToHex(hue, 80, 55) },
                { label: 'Saturation', value: saturation, set: setSaturation, max: 100, unit: '%', color: '#60a5fa' },
                { label: 'Lightness', value: lightness, set: setLightness, max: 100, unit: '%', color: '#a78bfa' },
              ].map(({ label, value, set, max, unit, color }) => (
                <div key={label} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#8896b3' }}>{label}</label>
                    <span style={{ fontSize: '0.8rem', color, fontFamily: 'monospace', fontWeight: 700 }}>
                      {value}{unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={max}
                    value={value}
                    onChange={e => set(Number(e.target.value))}
                    style={{ width: '100%', accentColor: color }}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(11,22,40,0.7)',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Armonía
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {HARMONY_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setHarmony(opt.key)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: `1px solid ${harmony === opt.key ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      background: harmony === opt.key ? 'rgba(167,139,250,0.1)' : 'transparent',
                      color: harmony === opt.key ? '#a78bfa' : '#8896b3',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Manrope, sans-serif',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.15rem' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Palette */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                background: 'rgba(11,22,40,0.7)',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Paleta generada
              </h3>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {palette.map((c, i) => {
                  const hex = hslToHex(c.h, c.s, c.l);
                  return (
                    <div
                      key={i}
                      onClick={() => copy(hex)}
                      style={{ flex: 1, cursor: 'pointer' }}
                    >
                      <div
                        style={{
                          background: hslToRgb(c.h, c.s, c.l),
                          borderRadius: '12px',
                          height: '100px',
                          marginBottom: '0.5rem',
                          transition: 'transform 0.2s',
                          boxShadow: `0 8px 24px ${hex}40`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                      />
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>{c.label}</div>
                      <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#60a5fa', textAlign: 'center' }}>
                        {copied === hex ? '✓ Copiado' : hex}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CSS export */}
            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  CSS Custom Properties
                </h3>
                <button
                  onClick={() => copy(`:root {\n${cssVars}\n}`)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(96,165,250,0.3)',
                    background: 'rgba(96,165,250,0.1)',
                    color: '#60a5fa',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'Manrope, sans-serif',
                  }}
                >
                  {copied?.includes('--color-1') ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
              <pre style={{ fontFamily: '"Fira Code", monospace', fontSize: '0.8rem', color: '#7dd3fc', margin: 0, whiteSpace: 'pre-wrap' }}>
                {`:root {\n${cssVars}\n}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
