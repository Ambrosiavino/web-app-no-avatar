import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function descrizioneIntensita(valore: number) {
  if (valore === 1) return "poco";
  if (valore === 2) return "un po'";
  if (valore === 3) return "abbastanza";
  if (valore === 4) return "molto";
  if (valore === 5) return "tanto";
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      olfatto_primo = [],
      olfatto_secondo = [],
      gusto = [],
      vino = {
        nome: "Soave DOC Classico",
        vitigno: "Garganega",
        sentori: ["mandorla", "fiori bianchi", "agrumi"],
        descrizione: "un vino elegante e minerale tipico del Veneto",
      },
      extra = null,
    } = body;

    const mappaGusto = gusto.map(g => `${g.nome.toLowerCase()} (${descrizioneIntensita(g.intensita)})`).join(', ');

    const prompt = [
      "Agisci come Dioniso, dio del vino. Parla con toni poetici e divertenti, ma sempre chiari.",
      "Rispondi in frasi uniche, ognuna completa e con senso compiuto, massimo 40 parole.",
      "Evita frasi ripetitive. Se una frase è già stata detta in altri messaggi, trova un’alternativa con lo stesso senso.",
      "Rispondi sempre alla domanda dell’utente se presente.",
      "",
      "Dopo il messaggio iniziale 'Ora finalmente assaggio anche io... dammi un minuto.',",
      "il secondo messaggio inizia sempre con:",
      `Però... buono! Vedo che tu degustando hai trovato il vino con aromi di ${olfatto_primo.join(', ') || '—'} o meglio ${olfatto_secondo.join(', ') || '—'}, al gusto ti sembra ${mappaGusto || '—'}.`,
      "Poi aggiungi 2 o 3 frasi autonome di commento incoraggiante, coerente con i dati.",
      "Non giudicare mai, ma incoraggia e diverti.",
      "",
      "Profilo dell'utente:",
      `- Olfatto primo livello: ${olfatto_primo.join(', ')}`,
      `- Olfatto secondo livello: ${olfatto_secondo.join(', ')}`,
      `- Gusto: ${gusto.map(g => `${g.nome} (${g.intensita})`).join(', ')}`,
      "",
      "Profilo del vino:",
      `- Nome: ${vino.nome}`,
      `- Vitigno: ${vino.vitigno}`,
      `- Sentori tipici: ${vino.sentori.join(', ')}`,
      `- Descrizione: ${vino.descrizione}`,
      "",
      extra ? `Domanda dell'utente: ${extra}` : "",
      "",
      "Genera massimo 4 frasi separate, ognuna autonoma, senza ripetizioni inutili.",
      "Ogni frase deve rispettare il limite di 40 parole e non deve tagliarsi a metà."
    ].join('\\n');

    console.log("📩 Prompt inviato a OpenAI:\\n", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.95,
    });

    console.log("📨 Risposta grezza da OpenAI:\\n", completion);

    const risposta = completion.choices[0]?.message?.content || "Dioniso è muto oggi.";
    return NextResponse.json({ risposta });
  } catch (err) {
    console.error("❌ Errore in /api/dioniso:", err);
    return NextResponse.json({ risposta: "Errore durante l'invocazione di Dioniso." }, { status: 500 });
  }
}
