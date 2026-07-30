import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { Summary } from "lucide-react";

export const GET = async () => {
    const result = await pool.query("SELECT * FROM users")
    return NextResponse.json({ message: "amjilttai", rows: result.rows }, { status: 200 })
}
export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const { title, content, summerize, clerkid } = body
        if (!title || !content || !clerkid) {
            return NextResponse.json({
                message: "medeelel dutuu bn"
            },

                { status: 400 }
            )
        }
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINAI_KEY })
        const interaction = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: `Дараах текстийг монгол хэлээр яг 2 товч бөгөөд оновчтой өгүүлбэрт багтаан хураангуйлж өгнө үү: ${content}`,

        });
        const summaryText = interaction.output_text;
        const queryText = `
 INSERT INTO articles(title,content,summerize,clerkid)
 VALUES($1,$2,$3,$4)`;


        const values = [title, content, summaryText, clerkid];
        const result = await pool.query(queryText, values);
        return NextResponse.json({
            message: "amjilttai vvslee",
            result: result.rows[0],
            Summary: summaryText
        }, { status: 200 })

    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json({ message: "server error" }, { status: 500 })
    }

}




//  