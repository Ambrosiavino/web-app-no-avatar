'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Sensazione = {
  nome: string;
  zona: string;
  intensita: number;
};

export default function Gusto() {
  const router = useRouter();

  const iniziali: Sensazione[] = [
    { nome: 'Dolce', zona: 'punta', intensita: 0 },
    { nome: 'Acido', zona: 'laterale', intensita: 0 },
    { nome: 'Sapido', zona: 'laterale_posteriore', intensita: 0 },
    { nome: 'Tannico', zona: 'palato', intensita: 0 },
    { nome: 'Amaro', zona: 'fondo', intensita: 0 },
  ];

  const [sensazioni, setSensazioni] = useState<Sensazione[]>(iniziali);

  const incrementa = (nome: string) => {
    setSensazioni((prev) =>
      prev.map((s) =>
        s.nome === nome
          ? { ...s, intensita: (s.intensita + 1) % 6 }
          : s
      )
    );
  };

  const handleNext = () => {
    const selezionati = sensazioni.filter((s) => s.intensita > 0);
    if (selezionati.length > 0) {
      localStorage.setItem('gusto', JSON.stringify(selezionati));
      router.push('/degustazione/riepilogo');
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Degustazione – Gusto</h1>
      <p>Clicca sui sapori per indicarne l’intensità (da 0 a 5):</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sensazioni.map((s) => (
          <li key={s.nome}>
            <button
              onClick={() => incrementa(s.nome)}
              style={{
                margin: '0.5rem 0',
                padding: '0.5rem 1rem',
                backgroundColor: s.intensita > 0 ? '#a3e635' : '#e5e7eb',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              {s.nome} (zona: {s.zona}) — Intensità: {s.intensita}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        disabled={sensazioni.every((s) => s.intensita === 0)}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: sensazioni.some((s) => s.intensita > 0) ? '#2563eb' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: sensazioni.some((s) => s.intensita > 0) ? 'pointer' : 'not-allowed',
        }}
      >
        Vai al Riepilogo
      </button>
    </main>
  );
}
