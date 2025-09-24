import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db" // make sure this is your DB helper

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Fetch user from DB
    const users = await query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const user = users[0]

    return NextResponse.json({ user })
  } catch (err: any) {
    console.error("Error fetching user:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
