import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: any, res: NextApiResponse) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const data = await req.json();

        const prompt = data.body + " give me time and space complexity of above code and also suggest optimize code with explaination.";

        // console.log(prompt);

        const result = await model.generateContent(prompt);
        const text = result.response?.text();

        return NextResponse.json({
            text
        })
    } catch (error) {
        console.error(error)
    }
}

const extractValues = (text: string, section: string) => {
    const sectionHeader = `**${section}:**`;
    const startIndex = text.indexOf(sectionHeader);
    if (startIndex === -1) return null;

    const endIndex = text.indexOf('**', startIndex + sectionHeader.length);
    const sectionContent = text.substring(
        startIndex + sectionHeader.length,
        endIndex !== -1 ? endIndex : text.length
    ).trim();

    return sectionContent;
};