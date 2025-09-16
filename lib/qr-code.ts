import QRCode from "qrcode"

export async function generateQRCode(data: string): Promise<string> {
  try {
    // Generate QR code as data URL (base64 encoded PNG)
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    return qrCodeDataURL
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

export async function generateQRCodeBuffer(data: string): Promise<Uint8Array> {
  try {
    const buffer = await QRCode.toBuffer(data, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })

    // Convert Node.js Buffer → Uint8Array
    // return new Uint8Array(buffer)
    return buffer

  } catch (error) {
    console.error("Error generating QR code buffer:", error)
    throw new Error("Failed to generate QR code")
  }
}

export function createCheckInURL(qrCode: string): string {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseURL}/checkin/${qrCode}`
}
