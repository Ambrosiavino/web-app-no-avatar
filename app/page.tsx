'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Messaggio = {
  autore: 'utente' | 'dioniso';
  testo: string;
};

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Messaggio[]>([]);

  const inviaDomanda = async (domanda: string) => {
    setChat(prev => [...prev, { autore: 'utente', testo: domanda }]);
    setInput('');

    const res = await fetch('/api/dioniso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        olfatto_primo: [],
        olfatto_secondo: [],
        gusto: [],
        extra: domanda
      })
    });

    const data = await res.json();
    const rispostaCompleta = (data.risposta || 'Dioniso tace...') + ' Ora vuoi che iniziamo la degustazione?';
    setChat(prev => [...prev, { autore: 'dioniso', testo: rispostaCompleta }]);
  };

  useEffect(() => {
    const presentazione = `Salve esploratore del gusto! 
Io sono Dioniso, Dio del vino, del piacere..e della buona compagnia.
Benvenuto in Ambrosia, il nettare degli Dei!
Ti guiderò in un viaggio sensoriale dove ogni sorso racconta una storia, assieme scopriremo le sorprese di questo magico mondo.
Niente paura, non servirà essere sommelier. Basta un naso curioso, voglia di divertirsi..e un buon bicchiere!
Con me ti divertirai, ne so qualcosa! Puoi domandarmi quello che vuoi, ma non essere impertinente, sono pur sempre un Dio anche se poco serio! ..ora vuoi che iniziamo la degustazione?`;
    setChat([{ autore: 'dioniso', testo: presentazione }]);
  }, []);

  const handleInvia = () => {
    if (!input.trim()) return;
    inviaDomanda(input);
  };

  return (
    <main style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1>Chatta con Dioniso 🍷</h1>

      <div style={{
        flex: 1,
        minHeight: '300px',
        overflowY: 'auto',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        background: '#fff'
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
      </div>

      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi a Dioniso..."
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginRight: '0.5rem'
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={() => router.push('/degustazione/olfatto/primo-livello')}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Inizia la degustazione
        </button>
        <a
          href="https://www.ambrosiavino.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
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
      </div>
    </main>
  );
}
