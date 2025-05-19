'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  async function sendMessage() {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    if (!res.ok) {
      setResponse("Errore nella risposta dell'API");
      return;
    }

    const data = await res.json();
    setResponse(data.reply || "Nessuna risposta");
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Parla con Dioniso 🍷</h1>
      <input
        className="border p-2 w-full mb-4 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Scrivi la tua domanda..."
      />
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={sendMessage}
      >
        Invia
      </button>
      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <p><strong>Risposta di Dioniso:</strong></p>
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}


