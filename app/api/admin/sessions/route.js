// app/api/admin/sessions/route.js

import { NextResponse } from 'next/server';
import { createSession } from '@/lib/db';

export async function POST(req) {
    try {
        const data = await req.json();

        // 1. Perform client-side validation for required fields
        if (!data.eventId || !data.title || !data.description || !data.startTime || !data.endTime) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // 2. Transform the data to match your database schema
        // This is the crucial part that was likely missing
        const sessionData = {
            eventId: data.eventId,
            title: data.title,
            description: data.description,
            speakerName: data.speakerName,
            speakerBio: data.speakerBio,
            location: data.location,
            sessionType: data.sessionType,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees, 10) : null,
        };

        await createSession(sessionData);

        return NextResponse.json({ message: "Session created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating session:", error);

        return NextResponse.json({ 
            message: "Internal Server Error",
            details: error.message 
        }, { status: 500 });
    }
}