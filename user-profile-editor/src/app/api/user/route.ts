import { NextResponse } from "next/server";
import { mockUser, delay } from "../../lib/mock-data";
import { userProfileSchema } from "../../lib//schemas";

export async function GET() {
  await delay(1000);
  
  return NextResponse.json({ user: mockUser });
}

export async function PUT(request: Request) {
  await delay(1500);
  
  try {
    const body = await request.json();
    
    const validationResult = userProfileSchema.safeParse({
      ...body,
      id: mockUser.id, 
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: validationResult.error.format(),
          message: "Validation failed" 
        }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      user: validationResult.data,
      message: "Profile updated successfully" 
    });
    
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update profile" 
      }, 
      { status: 500 }
    );
  }
}