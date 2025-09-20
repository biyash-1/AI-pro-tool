import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response?.text() || '';

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
