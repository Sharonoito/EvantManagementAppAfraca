// app/api/messages/[userId]/[otherUserId]/route.ts

import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/db'; // Make sure this path is correct

// The dynamic segments are available in the 'params' object
export async function GET(
  request: Request,
  { params }: { params: { userId: string, otherUserId: string } }
) {
  try {
    const { userId, otherUserId } = params;

    const messages = await getMessages(userId, otherUserId);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages.' },
      { status: 500 }
    );
  }
}