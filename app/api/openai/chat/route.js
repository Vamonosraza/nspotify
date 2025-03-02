import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';


const openai = new OpenAI(
    {apiKey: process.env.OPEN_API_KEY,}
);

export const POST = async (req) => {
    try {
        const { message } = await req.json();

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = response.choices[0].message;

        // console.log(reply);
        // console.log(reply.content)
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch response from OpenAI' }, { status: 500 });
    }
};