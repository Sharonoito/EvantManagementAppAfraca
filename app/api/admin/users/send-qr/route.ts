import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, getUserById } from "@/lib/db"
import { generateQRCode, createCheckInURL } from "@/lib/qr-code"
import { sendEmail, createQRCodeEmailTemplate } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { userIds, bulk } = await request.json()

    if (bulk) {
      const users = await getAllUsers()

      if (users.length === 0) {
        return NextResponse.json({
          success: false,
          message: "No users found to send QR codes to",
        })
      }

      const results = []
      let successCount = 0

      for (const user of users) {
        try {
          console.log(`[v0] Processing QR code for user: ${user.name} (${user.email})`)

          // Generate QR code
          const checkInURL = createCheckInURL(user.qr_code)
          const qrCodeDataURL = await generateQRCode(checkInURL)

          // Create email template
          const emailHTML = createQRCodeEmailTemplate(user.name, qrCodeDataURL, checkInURL)

          // Send email
          const emailSent = await sendEmail({
            to: user.email,
            subject: "Your QR Code - 8th World Congress on Rural & Agricultural Finance",
            html: emailHTML,
          })

          if (emailSent) {
            successCount++
            results.push({
              email: user.email,
              success: true,
              message: `QR code sent to ${user.name}`,
            })
          } else {
            results.push({
              email: user.email,
              success: false,
              message: `Failed to send email to ${user.name}`,
            })
          }
        } catch (error) {
          console.error(`[v0] Error sending QR code to ${user.email}:`, error)
          results.push({
            email: user.email,
            success: false,
            message: `Error: ${error}`,
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: `QR codes sent to ${successCount} out of ${users.length} users`,
        results,
      })
    } else if (userIds && Array.isArray(userIds)) {
      const results = []
      let successCount = 0

      for (const userId of userIds) {
        try {
          const user = await getUserById(userId)
          if (user) {
            console.log(`[v0] Processing QR code for user: ${user.name} (${user.email})`)

            // Generate QR code
            const checkInURL = createCheckInURL(user.qr_code)
            const qrCodeDataURL = await generateQRCode(checkInURL)

            // Create email template
            const emailHTML = createQRCodeEmailTemplate(user.name, qrCodeDataURL, checkInURL)

            // Send email
            const emailSent = await sendEmail({
              to: user.email,
              subject: "Your QR Code - 8th World Congress on Rural & Agricultural Finance",
              html: emailHTML,
            })

            if (emailSent) {
              successCount++
              results.push({
                email: user.email,
                success: true,
                message: `QR code sent to ${user.name}`,
              })
            } else {
              results.push({
                email: user.email,
                success: false,
                message: `Failed to send email to ${user.name}`,
              })
            }
          } else {
            results.push({
              userId,
              success: false,
              message: "User not found",
            })
          }
        } catch (error) {
          console.error(`[v0] Error processing user ${userId}:`, error)
          results.push({
            userId,
            success: false,
            message: `Error: ${error}`,
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: `QR codes sent to ${successCount} out of ${userIds.length} users`,
        results,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Either 'bulk: true' or 'userIds' array is required",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Send QR code error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
