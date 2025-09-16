// app/api/upload-qr/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { generateQRCodeBuffer } from "@/lib/qr-code";

export async function POST(req: Request) {
  const { data } = await req.json();

  // Convert buffer to base64 string
  const base64 = data;//`data:image/png;base64,${Buffer.from(qrBuffer).toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "qrcodes",
  });

  return NextResponse.json({ url: result.secure_url });
}
