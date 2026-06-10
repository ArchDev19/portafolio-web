import { useState, useEffect, useRef, useCallback } from 'react';

type AlgoKey = 'bubble' | 'selection' | 'insertion';

const ALGO_INFO: Record<AlgoKey, { name: string; best: string; avg: string; worst: string; space: string; desc: string; color: string }> = {
  bubble: {
    name: 'Bubble Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    desc: 'Compara pares adyacentes y los intercambia. Simple pero ineficiente para datasets grandes.',
    color: 'var(--primary)',
  },
  selection: {
    name: 'Selection Sort',
    best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    desc: 'Encuentra el mínimo en cada iteración y lo ubica en su posición correcta.',
    color: 'var(--success)',
  },
  insertion: {
    name: 'Insertion Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    desc: 'Construye el array ordenado de a un elemento. Eficiente para arrays casi ordenados.',
    color: 'var(--secondary)',
  },
};

const BAR_COUNT = 40;

const generateArray = () =>
  Array.from({ length: BAR_COUNT }, () => Math.floor(Math.random() * 90) + 10);

async function* bubbleSort(arr: number[]) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
      yield { arr: [...a], active: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => a.length - 1 - k) };
    }
  }
  yield { arr: [...a], active: [], sorted: a.map((_, i) => i) };
}

async function* selectionSort(arr: number[]) {
  const a = [...arr];
  const sorted: number[] = [];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
      yield { arr: [...a], active: [i, j, minIdx], sorted: [...sorted] };
    }
    [a[i], a[minIdx]] = [a[minIdx], a[i]];
    sorted.push(i);
    yield { arr: [...a], active: [i], sorted: [...sorted] };
  }
  yield { arr: [...a], active: [], sorted: a.map((_, i) => i) };
}

async function* insertionSort(arr: number[]) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      j--;
      yield { arr: [...a], active: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => k) };
    }
  }
  yield { arr: [...a], active: [], sorted: a.map((_, i) => i) };
}

export default function AlgoVizApp() {
  const [algo, setAlgo] = useState<AlgoKey>('bubble');
  const [bars, setBars] = useState<number[]>(generateArray);
  const [active, setActive] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(40);
  const [steps, setSteps] = useState(0);
  const stopRef = useRef(false);

  const info = ALGO_INFO[algo];

  const reset = useCallback(() => {
    stopRef.current = true;
    setRunning(false);
    setActive([]);
    setSorted([]);
    setSteps(0);
    setBars(generateArray());
  }, []);

  useEffect(() => { reset(); }, [algo, reset]);

  const run = async () => {
    if (running) { stopRef.current = true; setRunning(false); return; }
    stopRef.current = false;
    setRunning(true);
    setSteps(0);

    const generators: Record<AlgoKey, (a: number[]) => AsyncGenerator<{ arr: number[]; active: number[]; sorted: number[] }>> = {
      bubble: (a) => bubbleSort(a) as AsyncGenerator<{ arr: number[]; active: number[]; sorted: number[] }>,
      selection: (a) => selectionSort(a) as AsyncGenerator<{ arr: number[]; active: number[]; sorted: number[] }>,
      insertion: (a) => insertionSort(a) as AsyncGenerator<{ arr: number[]; active: number[]; sorted: number[] }>,
    };

    const gen = generators[algo](bars);

    for await (const frame of gen) {
      if (stopRef.current) break;
      setBars(frame.arr);
      setActive(frame.active);
      setSorted(frame.sorted);
      setSteps(s => s + 1);
      await new Promise(r => setTimeout(r, Math.max(5, 105 - speed)));
    }

    if (!stopRef.current) {
      setActive([]);
      setRunning(false);
    }
  };

  const maxVal = Math.max(...bars);

  return (
    <div style={{ minHeight: '100vh', background: '#020814', color: '#eef2ff', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/" style={{ color: '#60a5fa', fontSize: '0.85rem' }}>← Volver al portfolio</a>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#34d399' }}>
          Algorithm Visualizer
        </span>
      </div>

      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.04em' }}>
          Sorting Algorithms{' '}
          <span style={{ background: 'linear-gradient(135deg, #34d399, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            en vivo
          </span>
        </h1>
        <p style={{ color: '#8896b3', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.7 }}>
          Visualizá cómo funciona cada algoritmo en tiempo real. Entendé Big O notation con tus propios ojos.
        </p>

        {/* Algo selector */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {(Object.keys(ALGO_INFO) as AlgoKey[]).map(key => (
            <button
              key={key}
              onClick={() => { if (!running) setAlgo(key); }}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                border: `1px solid ${algo === key ? ALGO_INFO[key].color + '60' : 'rgba(255,255,255,0.08)'}`,
                background: algo === key ? ALGO_INFO[key].color + '15' : 'rgba(255,255,255,0.02)',
                color: algo === key ? ALGO_INFO[key].color : '#8896b3',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: running ? 'not-allowed' : 'pointer',
                fontFamily: 'Manrope, sans-serif',
                transition: 'all 0.2s',
                opacity: running && algo !== key ? 0.4 : 1,
              }}
            >
              {ALGO_INFO[key].name}
            </button>
          ))}
        </div>

        {/* Info + Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', marginBottom: '2rem', alignItems: 'start' }}>
          <div style={{ background: `${info.color}0d`, border: `1px solid ${info.color}25`, borderRadius: '12px', padding: '1rem 1.5rem' }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, marginBottom: '0.75rem' }}>{info.desc}</p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[['Mejor caso', info.best], ['Promedio', info.avg], ['Peor caso', info.worst], ['Espacio', info.space]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '0.65rem', color: '#4b5a72', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k}</div>
                  <div style={{ fontFamily: 'monospace', color: info.color, fontWeight: 700, fontSize: '0.9rem' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '160px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#8896b3', letterSpacing: '0.05em' }}>
                VELOCIDAD: {speed}%
              </label>
              <input type="range" min={5} max={100} value={speed} onChange={e => setSpeed(Number(e.target.value))}
                style={{ width: '100%', accentColor: info.color, marginTop: '0.3rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={run} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: `1px solid ${info.color}60`, background: `${info.color}15`, color: info.color, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Manrope, sans-serif' }}>
                {running ? '⏸ Pausar' : '▶ Iniciar'}
              </button>
              <button onClick={reset} disabled={running} style={{ padding: '0.6rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#8896b3', cursor: running ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontFamily: 'Manrope, sans-serif' }}>
                ↺
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4b5a72', textAlign: 'center' }}>
              Pasos: <span style={{ color: info.color, fontWeight: 700 }}>{steps.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div
          style={{
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.05)',
            height: '260px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
          }}
        >
          {bars.map((val, i) => {
            const isActive = active.includes(i);
            const isSorted = sorted.includes(i);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(val / maxVal) * 100}%`,
                  borderRadius: '3px 3px 0 0',
                  background: isSorted
                    ? 'var(--success)'
                    : isActive
                    ? info.color
                    : 'rgba(96,165,250,0.25)',
                  transition: 'background 0.1s',
                  boxShadow: isActive ? `0 0 8px ${info.color}80` : 'none',
                }}
              />
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.75rem', color: '#4b5a72' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(96,165,250,0.25)', display: 'inline-block' }} /> Sin procesar
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: info.color, display: 'inline-block' }} /> Comparando
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--success)', display: 'inline-block' }} /> Ordenado
          </span>
        </div>
      </div>
    </div>
  );
}
