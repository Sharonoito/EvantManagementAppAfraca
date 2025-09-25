// app/api/checkin/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getUserByQRCode, checkInUser } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json()

    if (!qrCode) {
      return NextResponse.json(
        { success: false, message: "QR code is required" },
        { status: 400 },
      )
    }

    // Find user by QR code
    const user = await getUserByQRCode(qrCode)

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid QR code. User not found.",
      })
    }

    // Check if already checked in
    if (user.checked_in) {
      // ✅ Still set cookie so we know who current user is
      cookies().set("current_user_id", user.id)

      return NextResponse.json({
        success: false,
        message: "User is already checked in",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          organization: user.organization,
          already_checked_in: true,
        },
      })
    }

    // Check in the user
    const updatedUser = await checkInUser(qrCode)

    if (updatedUser.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Failed to check in user",
      })
    }

    // ✅ Store their id in a cookie
    cookies().set("current_user_id", user.id)

    return NextResponse.json({
      success: true,
      message: `${user.name} checked in successfully!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        already_checked_in: false,
      },
    })
  } catch (error) {
    console.error("Check-in error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error during check-in" },
      { status: 500 },
    )
  }
}
