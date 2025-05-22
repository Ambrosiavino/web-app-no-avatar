'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OlfattoSecondoLivello() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const sentori = ['Pesca', 'Fragola', 'Erba tagliata', 'Agrumi', 'Miele'];

  const toggleSelection = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  };

  const handleNext = () => {
    if (selected.length > 0) {
      localStorage.setItem('olfatto_secondo_livello', JSON.stringify(selected));
      router.push('/degustazione/gusto');
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Olfatto – Secondo Livello</h1>
      <p>Quali sentori specifici riesci a identificare?</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sentori.map((s) => (
          <li key={s}>
            <button
              onClick={() => toggleSelection(s)}
              style={{
                margin: '0.5rem 0',
                padding: '0.5rem 1rem',
                backgroundColor: selected.includes(s) ? '#a3e635' : '#e5e7eb',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        disabled={selected.length === 0}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: selected.length > 0 ? '#2563eb' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
        }}
      >
        Vai al Gusto
      </button>
    </main>
  );
}
