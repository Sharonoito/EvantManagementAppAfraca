import { type NextRequest, NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email address is required" }, { status: 400 })
    }

    console.log(`[v0] Testing email to: ${email}`)

    const result = await sendTestEmail(email)

    if (result) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${email}`,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: `Failed to send test email to ${email}`,
      })
    }
  } catch (error) {
    console.error("[v0] Test email API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
