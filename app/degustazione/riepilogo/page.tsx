'use client';

import { useEffect, useState } from 'react';

type Messaggio = {
  autore: 'utente' | 'dioniso';
  testo: string;
};

export default function Riepilogo() {
  const [chat, setChat] = useState<Messaggio[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [olf1, setOlf1] = useState<string[]>([]);
  const [olf2, setOlf2] = useState<string[]>([]);
  const [gusto, setGusto] = useState<{ nome: string; intensita: number }[]>([]);

  useEffect(() => {
    const olf1Data = JSON.parse(localStorage.getItem('olfatto_primo_livello') || '[]');
    const olf2Data = JSON.parse(localStorage.getItem('olfatto_secondo_livello') || '[]');
    const gustoData = JSON.parse(localStorage.getItem('gusto') || '[]');

    setOlf1(olf1Data);
    setOlf2(olf2Data);
    setGusto(gustoData);

    const placeholder = "Ora finalmente assaggio anche io... dammi un minuto.";
    setChat([{ autore: 'dioniso', testo: placeholder }]);

    inviaDioniso(null, olf1Data, olf2Data, gustoData);
  }, []);

  const inviaDioniso = async (extra: string | null, olf1Data = olf1, olf2Data = olf2, gustoData = gusto) => {
    setLoading(true);
    const res = await fetch('/api/dioniso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        olfatto_primo: olf1Data,
        olfatto_secondo: olf2Data,
        gusto: gustoData,
        vino: {
          nome: "Soave DOC Classico",
          vitigno: "Garganega",
          sentori: ["mandorla", "fiori bianchi", "agrumi"],
          descrizione: "un vino elegante e minerale tipico del Veneto"
        },
        extra
      })
    });

    const data = await res.json();
    const risposta = data.risposta || "Dioniso tace...";
    const limitata = risposta.split(" ").slice(0, 30).join(" ");
    setChat(prev => [...prev, { autore: 'dioniso', testo: limitata }]);
    setLoading(false);
  };

  const handleInvia = () => {
    if (!input.trim()) return;
    setChat(prev => [...prev, { autore: 'utente', testo: input }]);
    inviaDioniso(input);
    setInput('');
  };

  return (
    <main style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Riepilogo Degustazione 🍷</h1>

      <section style={{
        background: '#f9fafb',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        <h2>I tuoi risultati</h2>
        <p><strong>Olfatto - Primo livello:</strong> {olf1.join(', ') || '—'}</p>
        <p><strong>Olfatto - Secondo livello:</strong> {olf2.join(', ') || '—'}</p>
        <p><strong>Gusto:</strong> {gusto.map(g => `${g.nome} (${g.intensita})`).join(', ') || '—'}</p>
      </section>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        background: '#fff',
        minHeight: '300px'
      }}>
        {chat.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.autore === 'utente' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            marginBottom: '1rem',
            gap: '0.5rem'
          }}>
            {msg.autore === 'dioniso' && (
              <img src="/dioniso-avatar.png" alt="Dioniso" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%'
              }} />
            )}
            <span style={{
              background: msg.autore === 'utente' ? '#dcfce7' : '#fef3c7',
              padding: '0.5rem 1rem',
              borderRadius: '16px',
              maxWidth: '70%',
              wordBreak: 'break-word'
            }}>
              {msg.testo}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
            <img src="/dioniso-avatar.png" alt="Dioniso" style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%'
            }} />
            <em>Dioniso sta pensando...</em>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', marginTop: '1rem', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi a Dioniso..."
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
        <button onClick={handleInvia} style={{
          backgroundColor: '#7c3aed',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Invia
        </button>
      </div>

      <a
        href="https://www.ambrosiavino.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          textDecoration: 'none'
        }}
      >
        Scopri il progetto Ambrosia
      </a>
    </main>
  );
}
