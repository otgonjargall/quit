import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
export const GET = async () => {
    const result = await pool.query("SELECT * FROM users")
    return NextResponse.json({ message: "hello", result }, { status: 200 })
}
export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        console.log("Бэкенд дээр ирсэн body:", body);
        const { email, name, clerkid, createdat, updatedat } = body
        if (!clerkid || !email) {
            return NextResponse.json({
                message: "medeelel dutuu bn"
            }, { status: 400 })
        }

        const queryText = `
      INSERT INTO users (email,name, "clerkid","createdat","updatedat")
      VALUES ($1, $2, $3, NOW(),NOW())
      ON CONFLICT (clerkid) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        updatedat = NOW()
      RETURNING *
    `;
        const values = [email, name || "", clerkid];
        const result = await pool.query(queryText, values);
        return NextResponse.json({
            message: "amjilttai vvslee",
            result: result.rows[0]
        }, { status: 200 })
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json({ message: "server error" }, { status: 500 })
    }

}
