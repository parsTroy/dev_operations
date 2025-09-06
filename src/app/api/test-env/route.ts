import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET() {
  try {
    return NextResponse.json({
      hasGitHubId: !!env.GITHUB_CLIENT_ID,
      hasGitHubSecret: !!env.GITHUB_CLIENT_SECRET,
      hasGoogleId: !!env.GOOGLE_CLIENT_ID,
      hasGoogleSecret: !!env.GOOGLE_CLIENT_SECRET,
      nextAuthUrl: env.NEXTAUTH_URL,
      nextAuthSecret: !!env.NEXTAUTH_SECRET,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
