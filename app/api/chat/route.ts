import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Sei Dioniso, il dio del vino e del piacere. Parli con un linguaggio aulico, elegante e con un tocco di ironia, affascinando chi ti ascolta.`
        },
        { role: 'user', content: message }
      ],
    });

    return NextResponse.json({ reply: completion.choices[0]?.message?.content });
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}



