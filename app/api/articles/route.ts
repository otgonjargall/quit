import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";


export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const clerkId = searchParams.get("clerk_id")

        let results = await pool.query("SELECT * FROM articles WHERE clerk_id = $1", [clerkId])

        return NextResponse.json({ message: "amjilttai", rows: results.rows }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "servert aldaa garlaa"
        },
            { status: 500 }
        )
    }


}
export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const { title, content, summerize, clerk_id } = body
        if (!title || !content || !clerk_id) {
            return NextResponse.json({
                message: "medeelel dutuu bn"
            },

                { status: 400 }
            )
        }
        //----------------ai holboh logic code-----------------
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINAI_KEY })
        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: `Дараах текстийг монгол хэлээр яг 2 товч бөгөөд оновчтой өгүүлбэрт багтаан хураангуйлж өгнө үү: ${content}`,

        });

        const summaryText = interaction.output_text;
        //--------------------database hadgalagdah logic------------------//
        const queryText = `
 INSERT INTO articles(title,content,summerize,clerk_id)
 VALUES($1,$2,$3,$4)`;

        const values = [title, content, summaryText, clerk_id];
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


