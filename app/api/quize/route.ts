import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import * as z from "zod";

export const quizJsonSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "Quiz question text" },
          options: {
            type: "array",
            items: { type: "string" },
            description: "Asuultiin 4 songolt",
          },
          correctAnswer: {
            type: "string",
            description: "zow hariult",
          },
        },
        required: ["question", "options", "correctAnswer"],
      },
    },
  },
  required: ["questions"],
} satisfies Parameters<typeof z.fromJSONSchema>[0];

export const POST = async (request: Request) => {
  const body = await request.json();
  const textContent = body.text;

  if (!textContent || typeof textContent !== "string" || !textContent.trim()) {
    return NextResponse.json({ message: "text шаардлагатай" }, { status: 400 });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMIN_AI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "Gemini API key тохируулагдаагүй байна." },
      { status: 500 },
    );
  }

  const client = new GoogleGenAI({ apiKey });
  const recipeSchema = z.fromJSONSchema(quizJsonSchema);
  const prompt = `
Танд дараах хураангуйлсан текст өгөгдсөн байна:
"${textContent}"

Дээрх АГУУЛГАД ҮНДЭСЛЭН хэрэглэгчийн мэдлэгийг шалгах 5 асуулттай квиз үүсгэж өгнө үү.
Асуултууд болон сонголтуудыг ЗҮГЭЭР Л өгөгдсөн текстийн хүрээнд хийнэ үү. Текстээс гадуур асуулт асууж БОЛОХГҮЙ.
`;

  try {
    const interaction = await client.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: quizJsonSchema,
      },
    });

    const rawText =
      typeof interaction.text === "string" ? interaction.text : "";

    if (!rawText) {
      return NextResponse.json(
        { message: "hariult oldsongvi" },
        { status: 500 },
      );
    }

    const result = recipeSchema.parse(
      typeof rawText === "string" ? JSON.parse(rawText) : rawText,
    );

    return NextResponse.json(
      {
        message: "amjilttai data irsen ",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return NextResponse.json(
      {
        message:
          "Quiz үүсгэхэд үнэ цагаар AI үйлчилгээ боломжгүй байна. Дараа дахин оролдоно уу.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }
};
