import { pool } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const isRecoverableGeminiError = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const status =
      (error as { status?: number; response?: { status?: number } }).status ||
      (error as { response?: { status?: number } }).response?.status;

    return status === 404 || status === 429 || status === 503;
  }
  return false;
};

const getSummary = async (text: string) => {
  if (!text?.trim()) return "";

  // NEXT_PUBLIC_ ашиглаж болохгүй (нууц түлхүүрийг клиент талд задруулна)
  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMIN_AI_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key тохируулагдаагүй байна.");
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const prompt = `Дараах нийтлэлийг 2-3 өгүүлбэрт богино бөгөөд ойлгомжтой хураангуй болгоно уу:\n\n${text}`;

    let lastError: unknown;
    const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

    for (const model of models) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
        });

        const summary = response.text?.trim();
        if (!summary) {
          throw new Error("Gemini хоосон хариу буцаалаа.");
        }

        return summary;
      } catch (error) {
        lastError = error;
        if (!isRecoverableGeminiError(error)) throw error;
        console.warn(`Gemini ${model} unavailable; trying the next model.`);
      }
    }

    throw lastError;
  } catch (error) {
    console.error("Summary generation failed:", error);
    throw error;
  }
};

export const GET = async (request: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Нэвтрээгүй байна (Unauthorized)" },
        { status: 401 },
      );
    }

    const articleId = new URL(request.url).searchParams.get("id");
    const results = articleId
      ? await pool.query(
          "SELECT * FROM articles WHERE clerk_id = $1 AND id = $2",
          [userId, articleId],
        )
      : await pool.query(
          "SELECT * FROM articles WHERE clerk_id = $1 ORDER BY id DESC",
          [userId],
        );

    return NextResponse.json(
      {
        message: "amjilttai",
        rows: results.rows,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ GET /api/articles ERROR:", error);

    return NextResponse.json(
      {
        message: "server aldaa",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Нэвтрээгүй байна (Unauthorized)" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { title, content, summery } = body;

    if (!title) {
      return NextResponse.json(
        { message: "title заавал шаардлагатай" },
        { status: 400 },
      );
    }

    const generatedSummary =
      summery?.trim() || (content ? await getSummary(content) : "");

    if (!generatedSummary) {
      return NextResponse.json(
        { message: "Хураангуй үүссэнгүй. Нийтлэлийн агуулгаа шалгана уу." },
        { status: 400 },
      );
    }

    try {
      const result = await pool.query(
        `INSERT INTO articles (title, content, summery, clerk_id, createdat, updateat)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [title, content || "", generatedSummary, userId],
      );

      return NextResponse.json(
        {
          message: "Амжилттай хадгалагдлаа",
          Summary: generatedSummary,
          data: result.rows[0],
        },
        { status: 201 },
      );
    } catch (dbError) {
      console.error("❌ DB save failed:", dbError);
      return NextResponse.json(
        {
          message: "DB write failed",
          error: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ POST /api/articles ERROR:", error);
    const isRecoverableError = isRecoverableGeminiError(error);

    return NextResponse.json(
      {
        message: isRecoverableError
          ? "Gemini-ийн model одоогоор боломжгүй байна. Дахин оролдоно уу."
          : "Хураангуй үүсгэхэд серверийн алдаа гарлаа.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: isRecoverableError ? 503 : 500 },
    );
  }
};
