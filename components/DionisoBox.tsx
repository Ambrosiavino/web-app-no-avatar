'use client';

import { useState } from 'react';

export default function DionisoBox({
  risposta,
  onUserMessage,
}: {
  risposta: string;
  onUserMessage?: (extraPrompt: string) => void;
}) {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([{ sender: 'dioniso', text: risposta }]);

  const handleSend = () => {
    if (!userMessage.trim()) return;

    const userText = userMessage.trim();
    setMessages((prev) => [...prev, { sender: 'utente', text: userText }]);
    setUserMessage('');

    if (onUserMessage) {
      onUserMessage(userText);
    }
  };

  return (
    <div className="mt-6 bg-[#f9f4ee] border border-[#ddd0c4] rounded-xl p-4 shadow-md flex flex-col space-y-4">
      <h2 className="text-[#6e4f3a] font-semibold text-lg">🍷 Dioniso risponde</h2>

      <div className="max-h-48 overflow-y-auto space-y-2 px-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md text-sm ${
              msg.sender === 'dioniso'
                ? 'bg-[#e8ddd1] text-[#4b382b] self-start'
                : 'bg-[#d7ecf5] text-[#1a2a3a] self-end text-right'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Chiedi a Dioniso..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSend}
          className="bg-[#6e4f3a] text-white px-4 py-2 rounded-md"
        >
          Invia
        </button>
      </div>
    </div>
  );
}
