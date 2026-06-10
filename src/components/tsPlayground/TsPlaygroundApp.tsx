import { useState } from 'react';

type UtilityDemo = {
  name: string;
  description: string;
  input: Record<string, string>;
  transform: (keys: string[]) => Record<string, string>;
  badge: string;
  color: string;
};

const BASE_TYPE = {
  id: 'number',
  name: 'string',
  email: 'string',
  age: 'number',
  role: '"admin" | "user"',
  active: 'boolean',
};

const DEMOS: UtilityDemo[] = [
  {
    name: 'Partial<T>',
    description: 'Hace todas las propiedades opcionales. Útil para updates parciales.',
    badge: 'Mapped Type',
    color: 'var(--primary)',
    input: BASE_TYPE,
    transform: (keys) => Object.fromEntries(keys.map(k => [`${k}?`, BASE_TYPE[k as keyof typeof BASE_TYPE]])),
  },
  {
    name: 'Pick<T, K>',
    description: 'Selecciona solo algunas propiedades del tipo original.',
    badge: 'Conditional',
    color: 'var(--success)',
    input: BASE_TYPE,
    transform: () => ({ name: 'string', email: 'string' }),
  },
  {
    name: 'Omit<T, K>',
    description: 'Elimina propiedades específicas del tipo.',
    badge: 'Utility',
    color: 'var(--secondary)',
    input: BASE_TYPE,
    transform: (keys) => Object.fromEntries(keys.filter(k => k !== 'role' && k !== 'active').map(k => [k, BASE_TYPE[k as keyof typeof BASE_TYPE]])),
  },
  {
    name: 'Readonly<T>',
    description: 'Convierte todas las propiedades en inmutables.',
    badge: 'Modifier',
    color: 'var(--tertiary)',
    input: BASE_TYPE,
    transform: (keys) => Object.fromEntries(keys.map(k => [`readonly ${k}`, BASE_TYPE[k as keyof typeof BASE_TYPE]])),
  },
];

const TypeBlock = ({ label, fields, color }: { label: string; fields: Record<string, string>; color: string }) => (
  <div
    style={{
      background: 'rgba(0,0,0,0.4)',
      border: `1px solid ${color}30`,
      borderRadius: '12px',
      padding: '1.25rem',
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
      fontSize: '0.82rem',
    }}
  >
    <div style={{ color, fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
      {label}
    </div>
    <div style={{ color: '#94a3b8' }}>{'{'}</div>
    {Object.entries(fields).map(([key, val]) => (
      <div key={key} style={{ paddingLeft: '1rem', lineHeight: 1.8 }}>
        <span style={{ color: '#7dd3fc' }}>{key}</span>
        <span style={{ color: '#94a3b8' }}>: </span>
        <span style={{ color: '#86efac' }}>{val}</span>
        <span style={{ color: '#94a3b8' }}>;</span>
      </div>
    ))}
    <div style={{ color: '#94a3b8' }}>{'}'}</div>
  </div>
);

export default function TsPlaygroundApp() {
  const [activeDemo, setActiveDemo] = useState(0);
  const demo = DEMOS[activeDemo];
  const inputKeys = Object.keys(demo.input);
  const outputFields = demo.transform(inputKeys);

  return (
    <div style={{ minHeight: '100vh', background: '#020814', color: '#eef2ff', fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/" style={{ color: '#60a5fa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          ← Volver al portfolio
        </a>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#7dd3fc' }}>
          TypeScript Type Explorer
        </span>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.04em' }}>
          Utility Types{' '}
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Visualizados
          </span>
        </h1>
        <p style={{ color: '#8896b3', marginBottom: '3rem', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.7 }}>
          Los Utility Types de TypeScript transforman tipos existentes. Acá podés ver cómo cambia la firma de un tipo según cada utilidad.
        </p>

        {/* Selector tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {DEMOS.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setActiveDemo(i)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                border: `1px solid ${i === activeDemo ? d.color + '50' : 'rgba(255,255,255,0.08)'}`,
                background: i === activeDemo ? d.color + '15' : 'rgba(255,255,255,0.02)',
                color: i === activeDemo ? d.color : '#8896b3',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: '"Fira Code", monospace',
                transition: 'all 0.2s',
              }}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            background: `${demo.color}0d`,
            border: `1px solid ${demo.color}25`,
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ background: `${demo.color}20`, color: demo.color, fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px', letterSpacing: '0.08em' }}>
            {demo.badge}
          </span>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>{demo.description}</p>
        </div>

        {/* Before / After */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
          <TypeBlock label="// Input type" fields={demo.input} color="#8896b3" />
          <div style={{ textAlign: 'center', color: demo.color, fontSize: '1.5rem', fontWeight: 700 }}>→</div>
          <TypeBlock label={`// ${demo.name} result`} fields={outputFields} color={demo.color} />
        </div>

        {/* Real world use */}
        <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(11,22,40,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Caso de uso real
          </h3>
          <div style={{ fontFamily: '"Fira Code", monospace', fontSize: '0.82rem', lineHeight: 1.8, color: '#94a3b8' }}>
            {activeDemo === 0 && (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {`// PUT /user/:id — actualización parcial\nfunction updateUser(id: number, data: Partial<User>) {\n  // data puede tener solo { name } sin el resto\n  return db.update(id, data);\n}`}
              </pre>
            )}
            {activeDemo === 1 && (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {`// DTO para mostrar perfil público\ntype PublicProfile = Pick<User, 'name' | 'email'>;\n// Sin exponer role, id, active...`}
              </pre>
            )}
            {activeDemo === 2 && (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {`// Crear usuario sin conocer el id\ntype CreateUserDTO = Omit<User, 'id'>;\n// La DB asigna el id — no lo recibimos`}
              </pre>
            )}
            {activeDemo === 3 && (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {`// Config de la app — nunca mutable\nconst config: Readonly<AppConfig> = {\n  apiUrl: 'https://api.example.com',\n  version: '1.0.0',\n};\n// config.version = '2.0'; // Error TS!`}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
