import { type NextRequest, NextResponse } from "next/server"
import { generateQRCodeBuffer } from "@/lib/qr-code"
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get("data")

    if (!data) {
      return NextResponse.json(
        { error: "Missing data parameter" },
        { status: 400 }
      )
    }

    const qrCodeBuffer = await generateQRCodeBuffer(data)

    // Convert Buffer -> ArrayBuffer
    const arrayBuffer = qrCodeBuffer.buffer.slice(
      qrCodeBuffer.byteOffset,
      qrCodeBuffer.byteOffset + qrCodeBuffer.byteLength
    ) as ArrayBuffer   

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    )
  }
}
