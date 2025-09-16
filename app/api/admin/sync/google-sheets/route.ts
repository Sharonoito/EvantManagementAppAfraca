import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sheetId, intervalMinutes = 30 } = await request.json()

    if (!sheetId) {
      return NextResponse.json({ success: false, message: "Sheet ID is required" }, { status: 400 })
    }

    const syncConfig = {
      sheetId,
      intervalMinutes,
      lastSync: new Date().toISOString(),
      active: true,
    }

    // 1. Store this config in database
    // 2. Set up a cron job or background worker
    // 3. Use a queue system for reliable processing

    return NextResponse.json({
      success: true,
      message: `Auto-sync configured for sheet ${sheetId} every ${intervalMinutes} minutes`,
      config: syncConfig,
    })
  } catch (error) {
    console.error("Sync configuration error:", error)
    return NextResponse.json({ success: false, message: "Failed to configure auto-sync" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Auto-sync is configured but requires a background worker to be fully operational",
    note: "In production, implement with cron jobs or background workers",
  })
}
