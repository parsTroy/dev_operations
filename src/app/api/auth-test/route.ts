import { NextResponse } from "next/server";
import { authConfig } from "~/server/auth/config";

export async function GET() {
  try {
    // Test if we can create the providers without errors
    const providers = authConfig.providers;
    
    return NextResponse.json({
      success: true,
      providerCount: providers.length,
      providerNames: providers.map(p => p.id),
      hasGitHub: providers.some(p => p.id === 'github'),
      hasGoogle: providers.some(p => p.id === 'google'),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
