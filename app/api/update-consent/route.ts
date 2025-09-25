// app/api/update-consent/route.ts

import { NextResponse } from 'next/server';
import { updateConsent } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the incoming request
    const { userId, consent } = await request.json();
    
    // Basic validation to ensure data is present
    if (!userId || consent === undefined) {
      return NextResponse.json(
        { success: false, error: 'User ID and consent value are required.' }, 
        { status: 400 } // Bad Request
      );
    }

    // Call the database function to update the user's consent status
    const user = await updateConsent(userId, consent);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found.' }, 
        { status: 404 } // Not Found
      );
    }

    // Return a success response with the updated user data
    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('Error updating consent:', error);
    // Return an error response if something goes wrong
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' }, 
      { status: 500 } // Internal Server Error
    );
  }
}