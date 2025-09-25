// app/api/networking-attendees/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getNetworkingAttendees } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required." },
                { status: 400 }
            );
        }

        const attendees = await getNetworkingAttendees(userId);
        
        return NextResponse.json({ success: true, attendees }, { status: 200 });
    } catch (error) {
        console.error("Error fetching networking attendees:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch networking attendees." },
            { status: 500 }
        );
    }
}