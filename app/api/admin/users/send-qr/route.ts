import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, getUserById } from "@/lib/db"
import { generateQRCode, createCheckInURL } from "@/lib/qr-code"
import { sendEmail, createQRCodeEmailTemplate } from "@/lib/email"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const { userIds, bulk } = await request.json()

    // Handle bulk send
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

          // Upload QR to Cloudinary
          const result = await cloudinary.uploader.upload(qrCodeDataURL, {
            folder: "qrcodes",
          })
          const imageUrl = result.secure_url

          console.log("Uploaded QR:", imageUrl)

          // Create email template
          const emailHTML = createQRCodeEmailTemplate(user.name, imageUrl, checkInURL)

          // Send email
          const emailSent = await sendEmail({
            to: user.email,
            subject: "Your QR Code - 8th World Congress on Rural & Agricultural Finance",
            html: emailHTML,
          })

          if (emailSent) {
            console.log("Email sent")
            successCount++
            results.push({
              email: user.email,
              success: true,
              message: `QR code sent to ${user.name}`,
            })
          } else {
            console.log("Email not sent")
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
    }

    // Handle single/multiple user IDs
    else if (userIds && Array.isArray(userIds)) {
      console.log("Processing specific userIds")

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

            // Upload QR to Cloudinary
            const result = await cloudinary.uploader.upload(qrCodeDataURL, {
              folder: "qrcodes",
            })
            const imageUrl = result.secure_url

            console.log("Uploaded QR:", imageUrl)

            // Create email template
            const emailHTML = createQRCodeEmailTemplate(user.name, imageUrl, checkInURL)

            // Send email
            const emailSent = await sendEmail({
              to: user.email,
              subject: "Your QR Code - 8th World Congress on Rural & Agricultural Finance",
              html: emailHTML,
            })

            if (emailSent) {
              console.log("Email sent for specific user")
              successCount++
              results.push({
                email: user.email,
                success: true,
                message: `QR code sent to ${user.name}`,
              })
            } else {
              console.log("Email not sent for specific user")
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
    }

    // Invalid request
    else {
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
