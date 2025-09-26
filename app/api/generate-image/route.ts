import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { prompt, modelType = "gemini" } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model:
        modelType === "imagen"
          ? "imagen-3.0"
          : "gemini-2.5-flash-image-preview",
    });

    const result = await model.generateContent(prompt);

    const candidates = result.response?.candidates;
    let imageData: string | null = null;

    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { error: "No image data received from model" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: imageData,
      mimeType: "image/png",
    });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
