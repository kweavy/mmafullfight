// pages/api/fight-result.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fighter1, fighter2, stats } = req.body;

  const prompt = `
Two UFC fighters just fought:

- Fighter 1: ${fighter1.name}
  - Health: ${stats.fighter1.health}
  - Strikes: ${stats.fighter1.strikes}
  - Significant Hits: ${stats.fighter1.significant}
  - Takedowns: ${stats.fighter1.takedowns}
  - Control: ${stats.fighter1.control}
  - Energy: ${stats.fighter1.energy}

- Fighter 2: ${fighter2.name}
  - Health: ${stats.fighter2.health}
  - Strikes: ${stats.fighter2.strikes}
  - Significant Hits: ${stats.fighter2.significant}
  - Takedowns: ${stats.fighter2.takedowns}
  - Control: ${stats.fighter2.control}
  - Energy: ${stats.fighter2.energy}

Analyze the fight and determine the winner. 
Give a short commentary, followed by: 
Winner: [NAME]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate fight result.' });
  }
}
