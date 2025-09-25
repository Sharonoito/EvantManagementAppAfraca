// app/api/messages/route.ts

import { NextResponse, NextRequest } from "next/server";
// Import both database functions needed for this endpoint
import { createMessage, getMessages } from "@/lib/db"; 

// ==========================================================
// POST - Send a new message (API Method: POST)
// ==========================================================
export async function POST(request: NextRequest) {
    try {
        // 1. Get data from the request body
        const body = await request.json();
        const { senderId, receiverId, content } = body;

        // 2. Validate required fields
        if (!senderId || !receiverId || !content) {
            return NextResponse.json(
                { success: false, statusMessage: "Missing required fields." },
                { status: 400 }
            );
        }

        // 3. Create the message in the database
        const newMessage = await createMessage(senderId, receiverId, content);

        // 4. Return success response - FIXED: Changed the duplicated 'message' property to 'statusMessage'
        return NextResponse.json(
            { success: true, statusMessage: "Message sent successfully.", message: newMessage },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending message:", error);
        // 5. Return error response
        return NextResponse.json(
            { success: false, statusMessage: "Failed to send message." },
            { status: 500 }
        );
    }
}

// ==========================================================
// GET - Fetch messages between two users (API Method: GET)
// ==========================================================
export async function GET(request: NextRequest) {
    try {
        // 1. Get user IDs from the URL query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const otherUserId = searchParams.get("otherUserId");

        // 2. Validate required parameters
        if (!userId || !otherUserId) {
            return NextResponse.json(
                { success: false, message: "User IDs are required." },
                { status: 400 }
            );
        }

        // 3. Fetch messages from the database
        const messages = await getMessages(userId, otherUserId);
        
        // 4. Return success response with the messages
        return NextResponse.json({ success: true, messages }, { status: 200 });

    } catch (error) {
        console.error("Error fetching messages:", error);
        // 5. Return error response
        return NextResponse.json(
            { success: false, message: "Failed to fetch messages." },
            { status: 500 }
        );
    }
}





// import { NextRequest, NextResponse } from "next/server";
// import { createMessage } from "@/lib/db";

// export async function POST(req: NextRequest) {
//   try {
//     const { senderId, receiverId, content } = await req.json();
//     const message = await createMessage(senderId, receiverId, content);
//     return NextResponse.json({ success: true, message });
//   } catch (error) {
//     console.error("Error saving message:", error);
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }