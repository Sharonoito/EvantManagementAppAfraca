import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/db"
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    console.log("[v0] Verifying user with email:", email)

    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      checked_in: user.checked_in,
      check_in_time: user.check_in_time,
      role: user.role,
    })
  } catch (error) {
    console.error("[v0] User verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
