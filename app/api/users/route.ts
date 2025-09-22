// app/api/users/route.ts
import { NextResponse } from "next/server"
import { getUserByQr } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const qr = searchParams.get("qr")
  if (!qr) return NextResponse.json({ error: "QR code required" }, { status: 400 })

  const user = await getUserByQr(qr)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  return NextResponse.json({ user })
}
