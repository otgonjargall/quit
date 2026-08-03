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
                        description: "Asuultiin 4 songolt"
                    },
                    correctAnswer: {
                        type: "string",
                        description: "zow hariult"
                    }
                },
                required: ["question", "options", "correctAnswer"]
            }


        }


    },
    required: ["questions"]
} as const

export const POST = async (request: Request) => {
    const body = await request.json();
    const textContent = body.text

    const cleint = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINAI_KEY });
    const recipeSchema = z.fromJSONSchema(quizJsonSchema as any);
    const prompt = `
Танд дараах хураангуйлсан текст өгөгдсөн байна:
"${textContent}"

Дээрх АГУУЛГАД ҮНДЭСЛЭН хэрэглэгчийн мэдлэгийг шалгах 5 асуулттай квиз үүсгэж өгнө үү.
Асуултууд болон сонголтуудыг ЗҮГЭЭР Л өгөгдсөн текстийн хүрээнд хийнэ үү. Текстээс гадуур асуулт асууж БОЛОХГҮЙ.
`;
    const interaction = await cleint.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: quizJsonSchema
        },
    });
    if (interaction.output_text) {
        const recipe = recipeSchema.parse(JSON.parse(interaction.output_text));
        console.log(recipe);
        return NextResponse.json({
            message: "amjilttai data irsen ",
            data: recipe
        }, { status: 200 })
    }
    return NextResponse.json({ message: "hariult oldsongvi" }, { status: 500 })
}



